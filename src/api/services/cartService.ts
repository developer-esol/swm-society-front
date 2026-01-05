import type { CartItem, Cart, ServerCartRow, ApiError } from '../../types/cart';
import { apiClient } from '../apiClient';
import { productsService } from './products';

// Server types are defined in `src/types/cart.ts`

const CART_STORAGE_KEY = 'swm_cart';
const USER_UUID_CACHE_KEY = 'nestjs_user_uuid';

// Helper: Get NestJS user UUID by Spring Boot externalId
async function getNestJsUserUuid(externalId: string): Promise<string> {
  try {
    // Check cache first
    const cached = sessionStorage.getItem(USER_UUID_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.externalId === externalId && parsed.uuid) {
        console.log('[CartService] Using cached UUID:', parsed.uuid);
        return parsed.uuid;
      }
    }

    // Fetch user from NestJS by externalId
    console.log('[CartService] Fetching NestJS user UUID for externalId:', externalId);
    const users = await apiClient.get<any[]>(`/users?externalId=${externalId}`);
    
    if (users && users.length > 0 && users[0].id) {
      const uuid = users[0].id;
      // Cache it
      sessionStorage.setItem(USER_UUID_CACHE_KEY, JSON.stringify({ externalId, uuid }));
      console.log('[CartService] ✅ Mapped externalId', externalId, '→ UUID:', uuid);
      return uuid;
    }

    throw new Error(`No NestJS user found with externalId: ${externalId}`);
  } catch (error) {
    console.error('[CartService] ❌ Failed to get NestJS user UUID:', error);
    throw error;
  }
}

// Helper: aggregate cart rows by productId + size + color
const aggregateCartItems = (items: CartItem[]): CartItem[] => {
  const map: Record<string, CartItem> = {};
  items.forEach((it) => {
    const key = `${it.productId}||${it.size || ''}||${it.color || ''}`;
    if (!map[key]) {
      // clone to avoid mutating original
      map[key] = { ...it };
      // ensure numeric
      map[key].quantity = Number(it.quantity || 0);
      map[key].maxQuantity = Number(it.maxQuantity || 0);
      map[key].price = Number(it.price || 0);
      map[key].productName = it.productName || '';
      map[key].productImage = it.productImage || '';
    } else {
      // sum quantities
      map[key].quantity = Number(map[key].quantity || 0) + Number(it.quantity || 0);
      // sum available/max quantities where meaningful
      map[key].maxQuantity = Number(map[key].maxQuantity || 0) + Number(it.maxQuantity || 0);
      // pick the minimum price as representative
      map[key].price = Math.min(Number(map[key].price || Infinity), Number(it.price || Infinity));
      // prefer existing productImage, otherwise use this one
      if (!map[key].productImage && it.productImage) map[key].productImage = it.productImage;
      // prefer non-empty productName
      if (!map[key].productName && it.productName) map[key].productName = it.productName;
      // merge stockId list into a joined id for traceability
      map[key].stockId = String(map[key].stockId || '') + (map[key].stockId ? '|' : '') + String(it.stockId || '');
    }
  });

  return Object.values(map);
};

export const cartService = {
  /**
   * Get all cart items
   */
  getCart(): Cart {
    try {
      const currentUserId = localStorage.getItem('userId');
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!storedCart) {
        return { items: [], totalItems: 0 };
      }
      const parsed = JSON.parse(storedCart) as Cart;
      
      // Filter items to only show current user's items
      const items = parsed.items || [];
      const filteredItems = currentUserId 
        ? items.filter(item => !item.userId || item.userId === currentUserId)
        : items.filter(item => !item.userId); // Anonymous users only see items without userId
      
      return {
        items: filteredItems,
        totalItems: filteredItems.length,
      };
    } catch {
      return { items: [], totalItems: 0 };
    }
  },

  /**
   * Update a cart item on the server by userId and productId (API: PUT /carts/user/{userId}/product/{productId})
   */
  async updateServerCartItemByUserProduct(userId: string | undefined, productId: string, payload: Record<string, unknown>): Promise<unknown> {
    try {
      userId = userId || localStorage.getItem('userId') || undefined;
      if (!userId) throw new Error('No user id provided for updateServerCartItemByUserProduct');

      // Convert Spring Boot numeric ID to NestJS UUID if not already UUID format
      const nestJsUserId = userId.includes('-') ? userId : await getNestJsUserUuid(userId);

      // Ensure numeric price if present
      if (payload.price !== undefined) {
        payload.price = Number(payload.price as number | string);
      }

      const url = `/carts/user/${nestJsUserId}/product/${productId}`;
      const response = await apiClient.put<unknown>(url, payload);

      // Optionally, sync local cache
      try {
        await this.syncServerCartToLocal();
      } catch (e) {
        // ignore sync errors
        console.warn('Failed to sync local cart after updateServerCartItemByUserProduct', e);
      }

      return response;
    } catch (error) {
      console.error('updateServerCartItemByUserProduct error:', error);
      throw error;
    }
  },

  /**
   * Add item to server-side cart for the logged-in user.
   * Uses the stored auth token (handled by `apiClient`) and `userId` from localStorage.
   * On success, updates local cart cache via `addItem`.
   */
  async addToServerCart(item: CartItem): Promise<unknown> {
    try {
      const externalId = localStorage.getItem('userId'); // Spring Boot numeric ID
      const token = localStorage.getItem('authToken');

      console.log('[CartService] ========================================');
      console.log('[CartService] Adding item to cart...');
      console.log('[CartService] Spring Boot externalId:', externalId);
      console.log('[CartService] Token:', token ? '✅ Present' : '❌ Missing');
      console.log('[CartService] Item:', item);

      if (!externalId) {
        throw new Error('User not authenticated. Cannot add to server cart.');
      }
      
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      // Get NestJS user UUID from Spring Boot externalId
      const nestJsUserId = await getNestJsUserUuid(externalId);
      console.log('[CartService] Using NestJS UUID:', nestJsUserId);

      // Ensure price is sent in a numeric form the API expects
      const numericPrice = Number(item.price);
      if (Number.isNaN(numericPrice)) {
        throw new Error('Invalid price value. Price must be a number.');
      }

      const payload = {
        userId: nestJsUserId, // Use NestJS UUID
        productId: item.productId,
        quantity: item.quantity,
        price: numericPrice,
        size: item.size,
        color: item.color,
        imageUrl: item.productImage,
      } as Record<string, unknown>;

      console.log('[CartService] Payload:', payload);
      console.log('[CartService] Checking if item exists in cart...');

      // Check if this exact variant (productId + size + color) already exists in the user's server cart.
      // Use the raw server response (not aggregated) so we can target an existing DB row to update.
      try {
        const rawServerItems = await apiClient.get<ServerCartRow[]>(`/carts/user/${nestJsUserId}`);
        const existingRaw = (rawServerItems || []).find((s: ServerCartRow) =>
          String(s.productId) === String(item.productId) &&
          String(s.size || '') === String(item.size || '') &&
          String(s.color || '') === String(item.color || '') &&
          String(s.userId || '') === String(nestJsUserId)
        );

        if (existingRaw) {
          console.log('[CartService] Item exists, updating quantity...');
          // Compute new quantity based on the existing DB row
          const newQuantity = Math.min(Number(existingRaw.maxQuantity || Infinity), Number(existingRaw.quantity || 0) + Number(item.quantity || 0));

          const updatePayload = {
            quantity: newQuantity,
            price: numericPrice,
            size: item.size,
            color: item.color,
            imageUrl: item.productImage,
            isActive: true,
          } as Record<string, unknown>;

          // Call the route-based update (server should update the matching row)
          const resp = await this.updateServerCartItemByUserProduct(nestJsUserId, String(item.productId), updatePayload);

          // Sync local cache from server so client reflects database state
          try {
            await this.syncServerCartToLocal();
          } catch (e) {
            console.warn('[CartService] Failed to sync local cart after update', e);
          }
          console.log('[CartService] ✅ Item updated successfully');
          console.log('[CartService] ========================================');
          return resp;
        }
      } catch (e) {
        // If raw fetch failed, fall back to attempting POST (will let API decide)
        console.warn('[CartService] Failed to check existing cart, will POST new item:', e);
      }

      console.log('[CartService] Creating new cart item...');
      console.log('[CartService] POST to:', '/carts');
      const response = await apiClient.post<unknown>('/carts', payload);
      console.log('[CartService] ✅ Item added successfully:', response);

      // If server call succeeded, sync local cart cache from server
      try {
        await this.syncServerCartToLocal();
      } catch (e) {
        // non-fatal: local cache update failed
        console.warn('[CartService] Failed to sync local cart after add:', e);
      }

      console.log('[CartService] ========================================');
      return response;
    } catch (error) {
      // Provide more detailed logging for easier debugging
      console.error('[CartService] ❌ Failed to add to cart:', error);
      console.error('[CartService] ========================================');
      const apiErr = error as ApiError;
      if (apiErr?.status) {
        console.error('[CartService] API status:', apiErr.status, 'statusText:', apiErr.statusText);
        console.error('[CartService] API body:', apiErr.body);
        throw new Error(apiErr.body?.message || `API Error: ${apiErr.status} ${apiErr.statusText}`);
      }

      throw error;
    }
  },

  /**
   * Fetch cart items from server for the logged-in user.
   * Returns an array of client `CartItem` objects mapped from server response.
   */
  async getServerCart(externalId?: string): Promise<CartItem[]> {
    try {
      externalId = externalId || localStorage.getItem('userId') || undefined;

      if (!externalId) {
        throw new Error('User not authenticated. getServerCart requires a userId');
      }

      // Get NestJS user UUID from Spring Boot externalId
      console.log('[CartService] Getting NestJS UUID for externalId:', externalId);
      const nestJsUserId = await getNestJsUserUuid(externalId);
      console.log('[CartService] Fetching cart for NestJS UUID:', nestJsUserId);
      
      const serverItems = await apiClient.get<ServerCartRow[]>(`/carts/user/${nestJsUserId}`);
      console.log('[CartService] Server returned', serverItems?.length || 0, 'cart items');
      
      // Log each item's userId to verify backend filtering
      if (serverItems && serverItems.length > 0) {
        const userIds = serverItems.map(item => item.userId);
        console.log('[CartService] Cart items userIds:', userIds);
        const wrongUserItems = serverItems.filter(item => String(item.userId) !== String(nestJsUserId));
        if (wrongUserItems.length > 0) {
          console.error('[CartService] ⚠️ BACKEND RETURNED WRONG USER DATA! Expected userId:', nestJsUserId, 'but got items for:', wrongUserItems.map(i => i.userId));
        }
      }

      // Persist raw server response for debugging
      try {
        localStorage.setItem('lastServerCartRaw', JSON.stringify(serverItems || []));
      } catch {}

      // Filter server items to ensure they belong to this user (safety net)
      const itemsArr = (serverItems || []) as ServerCartRow[];
      const before = itemsArr.length;
      const filtered = itemsArr.filter((s: ServerCartRow) => {
        const matches = String(s.userId) === String(nestJsUserId);
        if (!matches) {
          console.warn('[CartService] Filtering out item with userId:', s.userId, 'expected:', nestJsUserId);
        }
        return matches;
      });
      const after = filtered.length;
      
      if (before !== after) {
        console.error(`[CartService] ⚠️ Filtered out ${before - after} items! Backend should only return current user's data!`);
      } else {
        console.log('[CartService] ✓ All', after, 'items belong to current user');
      }

      // Map server response to client CartItem, fetching product name when missing
      const mappedPromises: Promise<CartItem>[] = filtered.map(async (s: ServerCartRow) => {
        let productName = s.productName || '';
        if (!productName && s.productId) {
          try {
            const prod = await productsService.getProductById(String(s.productId));
            if (prod && prod.name) productName = prod.name;
          } catch (e) {
            console.warn('Failed to fetch product name for cart item', s.productId, e);
          }
        }

        return {
          stockId: s.stockId || s.id || String(s.productId || ''),
          productId: String(s.productId || ''),
          productName: productName || '',
          productImage: s.imageUrl || s.image || s.productImage || '',
          userId: s.userId ? String(s.userId) : undefined,
          price: typeof s.price === 'string' ? parseFloat(String(s.price)) : Number(s.price || 0),
          color: s.color || '',
          size: s.size || '',
          quantity: Number(s.quantity || 0),
          maxQuantity: Number(s.maxQuantity || s.availableQuantity || 0),
          addedAt: s.createAt || s.createdAt || new Date().toISOString(),
        } as CartItem;
      });

      const mapped = await Promise.all(mappedPromises);
      const aggregated = aggregateCartItems(mapped);
      return aggregated;
    } catch (error) {
      console.error('getServerCart error:', error);
      throw error;
    }
  },

  /**
   * Get cart items for a specific user (preferred, mirrors orderService pattern).
   * Tries `/carts/user/:userId` first, then falls back to query param and client-side filtering.
   */
  async getUserCart(userId?: string): Promise<CartItem[]> {
    try {
      if (!userId) {
        userId = localStorage.getItem('userId') || undefined;
      }

      if (!userId) {
        throw new Error('No user id provided for getUserCart');
      }

      // Convert Spring Boot numeric ID to NestJS UUID
      const externalId = userId; // This is Spring Boot numeric ID
      const nestJsUserId = await getNestJsUserUuid(externalId);
      console.log('[CartService] getUserCart - externalId:', externalId, '→ NestJS UUID:', nestJsUserId);

      // Try route-based endpoint first
      try {
        const serverItems = await apiClient.get<unknown[]>(`/carts/user/${nestJsUserId}`);
        try {
          localStorage.setItem('lastServerCartRaw', JSON.stringify(serverItems || []));
        } catch {
          // ignore
        }
        console.debug('getUserCart raw serverItems (route):', serverItems);
        console.log('[CartService] getUserCart - received', (serverItems || []).length, 'items from server');
        // Map same as getServerCart but fetch product names when missing
        const serverArr = (serverItems || []) as ServerCartRow[];
        console.log('[CartService] getUserCart - mapping', serverArr.length, 'items...');
        const mappedPromises: Promise<CartItem>[] = serverArr.map(async (s: ServerCartRow) => {
          console.log('[CartService] getUserCart - mapping item:', { id: s.id, productId: s.productId, productName: s.productName });
          let productName = s.productName || '';
          if (!productName && s.productId) {
            console.log('[CartService] getUserCart - fetching product name for productId:', s.productId);
            try {
              const prod = await productsService.getProductById(String(s.productId));
              if (prod && prod.name) {
                productName = prod.name;
                console.log('[CartService] getUserCart - fetched product name:', productName);
              }
            } catch (e) {
              console.warn('Failed to fetch product name for cart item', s.productId, e);
            }
          }

          const cartItem = {
            stockId: s.stockId || s.id || String(s.productId || ''),
            productId: String(s.productId || ''),
            productName: productName || '',
            productImage: s.imageUrl || s.image || s.productImage || '',
            userId: s.userId ? String(s.userId) : undefined,
            price: typeof s.price === 'string' ? parseFloat(String(s.price)) : Number(s.price || 0),
            color: s.color || '',
            size: s.size || '',
            quantity: Number(s.quantity || 0),
            maxQuantity: Number(s.maxQuantity || s.availableQuantity || 0),
            addedAt: s.createAt || s.createdAt || new Date().toISOString(),
          } as CartItem;
          console.log('[CartService] getUserCart - created cart item:', cartItem);
          return cartItem;
        });

        const mapped = await Promise.all(mappedPromises);
        console.log('[CartService] getUserCart - mapped items:', mapped.length);
        const aggregated = aggregateCartItems(mapped);
        console.log('[CartService] getUserCart - aggregated items:', aggregated.length);
        console.log('[CartService] getUserCart - returning items:', aggregated);
        return aggregated;
      } catch (err) {
        console.warn('Route /carts/user/:userId not available or failed, falling back to query param', err);
      }

      // Fallback to existing getServerCart (which also filters by userId)
      console.log('[CartService] getUserCart - falling back to getServerCart with externalId:', externalId);
      return this.getServerCart(externalId);
    } catch (error) {
      console.error('getUserCart error:', error);
      throw error;
    }
  },

  /**
   * Sync server cart into local storage (replaces local cart with server items).
   * Returns the synced `Cart`.
   */
  async syncServerCartToLocal(): Promise<Cart> {
    try {
      const serverItems = await this.getServerCart();
      const cart: Cart = {
        items: serverItems,
        totalItems: serverItems.length,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return cart;
    } catch (error) {
      console.error('syncServerCartToLocal error:', error);
      throw error;
    }
  },

  /**
   * Remove a server-side cart item for a user by productId (DELETE /carts/user/{userId}/product/{productId})
   */
  async removeServerCartItemByUserProduct(userId: string | undefined, productId: string): Promise<unknown> {
    try {
      userId = userId || localStorage.getItem('userId') || undefined;
      if (!userId) throw new Error('No user id provided for removeServerCartItemByUserProduct');
      
      // Convert Spring Boot numeric ID to NestJS UUID if not already UUID format
      const nestJsUserId = userId.includes('-') ? userId : await getNestJsUserUuid(userId);
      
      const url = `/carts/user/${encodeURIComponent(nestJsUserId)}/product/${encodeURIComponent(productId)}`;
      const resp = await apiClient.delete<unknown>(url);
      // Sync local cache after delete
      try { await this.syncServerCartToLocal(); } catch (e) { console.warn('Failed to sync local cart after server delete', e); }
      return resp;
    } catch (error) {
      console.error('removeServerCartItemByUserProduct error:', error);
      throw error;
    }
  },

  /**
   * Add item to cart
   */
  addItem(item: CartItem): void {
    const currentUserId = localStorage.getItem('userId');
    const cart = this.getCart();
    
    // Tag item with current userId if user is logged in
    const itemToAdd = currentUserId ? { ...item, userId: currentUserId } : item;
    
    const existingItem = cart.items.find((i: CartItem) => i.stockId === itemToAdd.stockId);

    if (existingItem) {
      // If item already in cart, increase quantity. Respect max only when it's a positive number.
      const existingMax = Number(existingItem.maxQuantity || 0);
      if (!Number.isFinite(existingMax) || existingMax <= 0) {
        existingItem.quantity = Number(existingItem.quantity || 0) + Number(itemToAdd.quantity || 0);
      } else {
        existingItem.quantity = Math.min(
          Number(existingItem.quantity || 0) + Number(itemToAdd.quantity || 0),
          existingMax
        );
      }
      // Update userId if logged in
      if (currentUserId) {
        existingItem.userId = currentUserId;
      }
    } else {
      // Add new item to cart
      cart.items.push(itemToAdd);
    }

    cart.totalItems = cart.items.length;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  /**
   * Remove item from cart
   */
  removeItem(stockId: string): void {
    const cart = this.getCart();
    cart.items = cart.items.filter((item: CartItem) => item.stockId !== stockId);
    cart.totalItems = cart.items.length;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  },

  /**
   * Update item quantity
   */
  updateItemQuantity(stockId: string, quantity: number): void {
    const cart = this.getCart();
    const item = cart.items.find((i: CartItem) => i.stockId === stockId);

    if (item) {
      // Validate quantity against max available.
      // Treat non-positive or missing maxQuantity as "unlimited".
      const maxQ = Number(item.maxQuantity || 0);
      if (!Number.isFinite(maxQ) || maxQ <= 0) {
        item.quantity = Math.max(1, Number(quantity));
      } else {
        item.quantity = Math.max(1, Math.min(Number(quantity), maxQ));
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  },

  /**
   * Check if item is in cart
   */
  isInCart(stockId: string): boolean {
    const cart = this.getCart();
    return cart.items.some((item: CartItem) => item.stockId === stockId);
  },

  /**
   * Clear entire cart
   */
  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  /**
   * Get total item count
   */
  getItemCount(): number {
    const cart = this.getCart();
    return cart.items.length;
  },

  /**
   * Get cart total price
   */
  getCartTotal(): number {
    const cart = this.getCart();
    return cart.items.reduce((total: number, item: CartItem) => total + (Number(item.price) * item.quantity), 0);
  },
};


import type { CartItem, Cart, ServerCartRow, ApiError } from '../../types/cart';
import { apiClient } from '../apiClient';
import { productsService } from './products';

// Server types are defined in `src/types/cart.ts`

const CART_STORAGE_KEY = 'swm_cart';

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
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!storedCart) {
        return { items: [], totalItems: 0 };
      }
      const parsed = JSON.parse(storedCart) as Cart;
      return {
        items: parsed.items || [],
        totalItems: parsed.items?.length || 0,
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

      // Ensure numeric price if present
      if (payload.price !== undefined) {
        payload.price = Number(payload.price as number | string);
      }

      const url = `/carts/user/${userId}/product/${productId}`;
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
      const userId = localStorage.getItem('userId');

      if (!userId) {
        throw new Error('User not authenticated. Cannot add to server cart.');
      }

      // Ensure price is sent in a numeric form the API expects
      const numericPrice = Number(item.price);
      if (Number.isNaN(numericPrice)) {
        throw new Error('Invalid price value. Price must be a number.');
      }

      const payload = {
        userId,
        productId: item.productId,
        quantity: item.quantity,
        price: numericPrice,
        size: item.size,
        color: item.color,
        imageUrl: item.productImage,
      } as Record<string, unknown>;

      console.log('addToServerCart payload:', payload);

      // Check if this exact variant (productId + size + color) already exists in the user's server cart.
      // Use the raw server response (not aggregated) so we can target an existing DB row to update.
      try {
        const rawServerItems = await apiClient.get<ServerCartRow[]>(`/carts/user/${userId}`);
        const existingRaw = (rawServerItems || []).find((s: ServerCartRow) =>
          String(s.productId) === String(item.productId) &&
          String(s.size || '') === String(item.size || '') &&
          String(s.color || '') === String(item.color || '') &&
          String(s.userId || '') === String(userId)
        );

        if (existingRaw) {
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
          const resp = await this.updateServerCartItemByUserProduct(userId, String(item.productId), updatePayload);

          // Sync local cache from server so client reflects database state
          try {
            await this.syncServerCartToLocal();
          } catch (e) {
            console.warn('Failed to sync local cart after update in addToServerCart', e);
          }
          return resp;
        }
      } catch (e) {
        // If raw fetch failed, fall back to attempting POST (will let API decide)
        console.warn('Failed to check existing server cart during addToServerCart (raw fetch), will POST:', e);
      }

      const response = await apiClient.post<unknown>('/carts', payload);
      console.log('addToServerCart response:', response);

      // If server call succeeded, sync local cart cache from server
      try {
        await this.syncServerCartToLocal();
      } catch (e) {
        // non-fatal: local cache update failed
        console.warn('Failed to sync local cart after server add:', e);
      }

      return response;
    } catch (error) {
      // Provide more detailed logging for easier debugging
      console.error('addToServerCart error:', error);
      const apiErr = error as ApiError;
      if (apiErr?.status) {
        console.error('API status:', apiErr.status, 'statusText:', apiErr.statusText);
        console.error('API body:', apiErr.body);
        throw new Error(apiErr.body?.message || `API Error: ${apiErr.status} ${apiErr.statusText}`);
      }

      throw error;
    }
  },

  /**
   * Fetch cart items from server for the logged-in user.
   * Returns an array of client `CartItem` objects mapped from server response.
   */
  async getServerCart(userId?: string): Promise<CartItem[]> {
    try {
      userId = userId || localStorage.getItem('userId') || undefined;

      if (!userId) {
        // Do not fetch global cart list for unauthenticated access.
        throw new Error('User not authenticated. getServerCart requires a userId');
      }

      // Prefer the route-based endpoint which returns items for a specific user.
      // The backend rejects `userId` as a query param, so call `/carts/user/:userId`.
      const serverItems = await apiClient.get<ServerCartRow[]>(`/carts/user/${userId}`);

      // Persist raw server response for debugging (helps identify missing userId fields)
      try {
        // Save a copy so the UI can surface it if necessary
        localStorage.setItem('lastServerCartRaw', JSON.stringify(serverItems || []));
      } catch {
        // ignore storage errors
      }

      // Also log to console for quick inspection
      console.debug('getServerCart raw serverItems:', serverItems);

      // Filter server items to ensure they belong to this user (safety net)
      const itemsArr = (serverItems || []) as ServerCartRow[];
      const before = itemsArr.length;
      const filtered = itemsArr.filter((s: ServerCartRow) => String(s.userId) === String(userId));
      const after = filtered.length;
      if (before !== after) {
        console.warn(`Filtered server cart items: removed ${before - after} items not belonging to user ${userId}`);
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

      // Try route-based endpoint first
      try {
        const serverItems = await apiClient.get<unknown[]>(`/carts/user/${userId}`);
        try {
          localStorage.setItem('lastServerCartRaw', JSON.stringify(serverItems || []));
        } catch {
          // ignore
        }
        console.debug('getUserCart raw serverItems (route):', serverItems);
        // Map same as getServerCart but fetch product names when missing
        const serverArr = (serverItems || []) as ServerCartRow[];
        const mappedPromises: Promise<CartItem>[] = serverArr.map(async (s: ServerCartRow) => {
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
      } catch (err) {
        console.warn('Route /carts/user/:userId not available or failed, falling back to query param', err);
      }

      // Fallback to existing getServerCart (which also filters by userId)
      return this.getServerCart(userId);
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
   * Add item to cart
   */
  addItem(item: CartItem): void {
    const cart = this.getCart();
    const existingItem = cart.items.find((i: CartItem) => i.stockId === item.stockId);

    if (existingItem) {
      // If item already in cart, increase quantity (but respect max)
      existingItem.quantity = Math.min(
        existingItem.quantity + item.quantity,
        existingItem.maxQuantity
      );
    } else {
      // Add new item to cart
      cart.items.push(item);
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
      // Validate quantity against max available
      item.quantity = Math.max(1, Math.min(quantity, item.maxQuantity));
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


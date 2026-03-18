// @ts-nocheck
import type { WishlistItem, Wishlist } from '../../types/wishlist';
import { apiClient } from '../apiClient';
import { productsService } from './products';

const WISHLIST_STORAGE_KEY = 'swm_wishlist';

/**
 * Helper function to get NestJS user UUID from Spring Boot externalId
 * Caches the result in sessionStorage to avoid repeated API calls
 */
async function getNestJsUserUuid(externalId: string): Promise<string> {
  // Check cache first
  const cacheKey = 'nestjs_user_uuid';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.externalId === externalId && parsed.uuid) {
        console.log('[WishlistService] Using cached UUID:', parsed.uuid);
        return parsed.uuid;
      }
    } catch (e) {
      // Invalid cache, continue to fetch
    }
  }

  // Fetch from API
  console.log('[WishlistService] Fetching UUID for externalId:', externalId);
  const response = await apiClient.get<any[]>(`/users?externalId=${externalId}`);
  if (!response || response.length === 0) {
    throw new Error(`No user found with externalId: ${externalId}`);
  }
  
  const uuid = response[0].id;
  console.log('[WishlistService] Mapped externalId', externalId, '→ UUID:', uuid);
  
  // Cache the result
  sessionStorage.setItem(cacheKey, JSON.stringify({ externalId, uuid }));
  
  return uuid;
}

/**
 * Normalize and validate price according to API constraints.
 * - must be numeric
 * - must be >= 0.01
 * - must have at most 2 decimal places
 * - returns a Number rounded to 2 decimals
 */
const normalizePriceValue = (v: any): number => {
  if (v === undefined || v === null) throw new Error('Invalid price: missing');
  const str = String(v).trim();

  // Reject scientific notation or non-numeric characters
  if (!/^-?\d+(?:\.\d+)?$/.test(str)) throw new Error('Invalid price: must be a number');

  const n = Number(str);
  if (!Number.isFinite(n)) throw new Error('Invalid price: must be a finite number');
  if (n < 0.01) throw new Error('Invalid price: must be >= 0.01');
  if (n > 9999999.99) throw new Error('Invalid price: value too large');

  const decimals = (str.split('.')[1] || '').length;
  if (decimals > 2) throw new Error('Invalid price: maximum two decimal places allowed');

  return Math.round(n * 100) / 100;
};

// Convert server price to unit price if server stored total price.
const serverPriceToUnit = (priceValue: any, quantityValue: any): number => {
  const raw = Number(priceValue ?? 0);
  const qty = Number(quantityValue ?? 1) || 1;
  if (!Number.isFinite(raw) || raw <= 0) return 0;

  // If quantity > 1, check if server price looks like a total (unit * qty)
  if (qty > 1) {
    const candidate = Math.round((raw / qty) * 100) / 100;
    const recomposed = Math.round(candidate * qty * 100) / 100;
    if (Math.abs(recomposed - raw) < 0.01) {
      // Looks like server stored total price; log diagnostic and return candidate as unit price
      try {
        console.warn(`[wishlistService] Detected server-stored total price. raw=${raw}, qty=${qty}, unit=${candidate}`);
      } catch {}
      return candidate;
    }
  }

  // Otherwise treat server price as unit price
  return Math.round(raw * 100) / 100;
};

// Get wishlist from localStorage
const getWishlistFromStorage = (): WishlistItem[] => {
  try {
    const currentUserId = localStorage.getItem('userId');
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];
    
    const items = JSON.parse(stored) as WishlistItem[];
    
    // Filter to only show current user's items
    if (currentUserId) {
      return items.filter(item => !item.userId || item.userId === currentUserId);
    }
    
    // Anonymous users only see items without userId
    return items.filter(item => !item.userId);
  } catch (error) {
    console.error('Failed to parse wishlist from localStorage:', error);
    return [];
  }
};

const saveWishlistToStorage = (items: WishlistItem[]): void => {
  try {
    const currentUserId = localStorage.getItem('userId');
    // Tag all items with current userId if user is logged in
    const taggedItems = currentUserId 
      ? items.map(item => ({ ...item, userId: currentUserId }))
      : items;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(taggedItems));
  } catch (error) {
    console.error('Failed to save wishlist to localStorage:', error);
  }
};

export const wishlistService = {
  /**
   * Get all wishlist items
   * @returns Wishlist object with items and total count
   */
  getWishlist: (): Wishlist => {
    // synchronous fallback kept for callers that expect immediate value
    const items = getWishlistFromStorage();
    return {
      items,
      totalItems: items.length,
    };
  },

  /**
   * Async version of getWishlist which retrieves data from server when authenticated.
   */
  /**
   * Async version of getWishlist which retrieves data from server when authenticated.
   * If `wishlistId` is provided, will attempt to fetch that specific wishlist item for the user.
   */
  getWishlistAsync: async (wishlistId?: string): Promise<Wishlist> => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const externalId = localStorage.getItem('userId') || '';
      try {
        // Convert Spring Boot numeric ID to NestJS UUID
        const nestJsUserId = await getNestJsUserUuid(externalId);
        console.log('[WishlistService] Fetching wishlist - externalId:', externalId, '→ UUID:', nestJsUserId);
        const endpoint = wishlistId
          ? `/wishlists/user/${encodeURIComponent(nestJsUserId)}/${encodeURIComponent(wishlistId)}`
          : `/wishlists/user/${encodeURIComponent(nestJsUserId)}`;
        const serverItems = await apiClient.get<any[]>(endpoint);
        
        console.log('[WishlistService] Server returned', serverItems?.length || 0, 'wishlist items');

        const serverArray = Array.isArray(serverItems) ? serverItems : serverItems ? [serverItems] : [];
        
        // Log userIds to verify backend filtering
        if (serverArray.length > 0) {
          const userIds = serverArray.map(item => item.userId);
          console.log('[WishlistService] Wishlist items userIds:', userIds);
          const wrongUserItems = serverArray.filter(item => item.userId && String(item.userId) !== String(nestJsUserId));
          if (wrongUserItems.length > 0) {
            console.error('[WishlistService] ⚠️ BACKEND RETURNED WRONG USER DATA! Expected userId:', nestJsUserId, 'but got items for:', wrongUserItems.map(i => i.userId));
          }
        }
        
        // Filter out inactive records (server may return items with isActive=false)
        const activeServerArray = serverArray.filter((si: any) => {
          const active = si.isActive ?? si.active ?? si.is_active;
          const belongsToUser = !si.userId || String(si.userId) === String(nestJsUserId);
          if (!belongsToUser) {
            console.warn('[WishlistService] Filtering out item with userId:', si.userId, 'expected:', nestJsUserId);
          }
          return (active === undefined || !!active) && belongsToUser;
        });
        
        console.log('[WishlistService] After filtering:', activeServerArray.length, 'active items for current user');
          const items = activeServerArray.map((si) => ({
              id: si.id || si._id || si.wishlistId || '',
              stockId: si.stockId || si.stock_id || '',
              productId: si.productId || si.product_id || si.productId || '',
              productName: si.productName || si.product_name || si.name || '',
              productImage: si.imageUrl || si.productImage || si.image || '',
              userId: si.userId || userId || '',
              price: serverPriceToUnit(si.price, si.quantity),
                color: si.color ?? si.variantColor ?? si.optionColor ?? si.variant_color ?? si.option_color ?? (si.variant && (si.variant.color || si.variant.colour)) ?? '',
                size: si.size ?? si.variantSize ?? si.optionSize ?? si.variant_size ?? si.option_size ?? (si.variant && (si.variant.size || si.variant.sizeLabel)) ?? '',
              quantity: Number(si.quantity) || 1,
              maxQuantity: Number(si.maxQuantity) || 0,
              isOutOfStock: !!si.isOutOfStock,
              addedAt: si.addedAt || new Date().toISOString(),
              expiresAt: si.expiresAt || undefined,
            }))
          ;

        // If some items lack productName (server didn't return it), fetch product details
        const missingNameIds = Array.from(new Set(items.filter(it => !it.productName && it.productId).map(it => it.productId)));
        const allProductIds = Array.from(new Set(items.map(it => it.productId).filter(Boolean)));
        
        if (allProductIds.length > 0) {
          try {
            const fetched = await Promise.all(allProductIds.map(pid => productsService.getProductById(pid).catch(() => null)));
            const productMap: Record<string, any> = {};
            fetched.forEach(p => { 
              if (p && p.id) {
                productMap[p.id] = p;
              }
            });
            
            for (const it of items) {
              if (it.productId && productMap[it.productId]) {
                const product = productMap[it.productId];
                // Update product name if missing
                if (!it.productName || it.productName === '') {
                  it.productName = product.name || product.productName || '';
                }
                // Add brand name
                it.brandName = product.brandName || '';
              }
            }
          } catch (err) {
            console.warn('[WishlistService] Failed to fetch product details:', err);
          }
        }

        // Keep local cache in sync
        try {
          saveWishlistToStorage(items);
        } catch {
          // ignore storage errors
        }

        return { items, totalItems: items.length };
      } catch (error) {
        console.error('Failed to fetch wishlist from server, falling back to local storage', error);
        const items = getWishlistFromStorage();
        return { items, totalItems: items.length };
      }
    }

    // Not authenticated: return local storage wishlist
    const items = getWishlistFromStorage();
    return { items, totalItems: items.length };
  },

  /**
   * Add item to wishlist
   * @param item - WishlistItem to add
   * @returns Updated wishlist
   */
  addItem: async (item: WishlistItem): Promise<Wishlist> => {
    // If user is authenticated, try to persist to server
    const token = localStorage.getItem('authToken');
    if (token) {
      const externalId = localStorage.getItem('userId') || ''; // Spring Boot numeric ID
      try {
          // Convert Spring Boot numeric ID to NestJS UUID
          const nestJsUserId = await getNestJsUserUuid(externalId);
          console.log('[WishlistService] addItem - externalId:', externalId, '→ UUID:', nestJsUserId);

          // Validate and normalize price according to API constraints
          const normalizedPrice = normalizePriceValue(item.price);

          // Build search params to detect existing wishlist entries for this user+product+variant
          const params = new URLSearchParams();
          if (nestJsUserId) params.set('userId', nestJsUserId);
          if (item.productId) params.set('productId', item.productId);
          if (item.size) params.set('size', item.size);
          if (item.color) params.set('color', item.color);

          // Try to find existing server record to avoid duplicates
          let foundOnServer: any[] = [];
          if (params.toString()) {
            try {
              const searchRes = await apiClient.get<any[]>(`/wishlists?${params.toString()}`);
              foundOnServer = Array.isArray(searchRes) ? searchRes : (searchRes && searchRes.items) || [];
            } catch (searchErr) {
              // If search fails, log and continue to create path
              console.warn('Wishlist search failed; will attempt create:', searchErr);
              foundOnServer = [];
            }
          }

          const items = getWishlistFromStorage();

          if (foundOnServer.length > 0) {
            // Merge all matching server records to avoid duplicates.
            // Sum quantities across all matches and include the new add quantity.
            const addQty = Number(item.quantity) || 1;
            let totalQuantity = addQty;
            for (const f of foundOnServer) {
              totalQuantity += Number(f.quantity) || 0;
            }

            // Update the first matching record with the aggregated quantity
            const primary = foundOnServer[0];
            const primaryId = primary.id || primary._id || primary.wishlistId || primary.id;
            const updateBody: any = {
              quantity: totalQuantity,
              price: normalizedPrice,
              size: item.size,
              color: item.color,
              imageUrl: item.productImage,
            };

            const updatedServer = await apiClient.put(`/wishlists/${encodeURIComponent(primaryId)}`, updateBody);
              const serverItem = updatedServer || primary;

            // Delete any duplicate server records (those after the first)
            const duplicates = foundOnServer.slice(1);
            try {
              await Promise.all(
                duplicates.map((d) => {
                  const did = d.id || d._id || d.wishlistId || d.id;
                  return did ? apiClient.delete(`/wishlists/${encodeURIComponent(did)}`) : Promise.resolve(null);
                })
              );
            } catch (delErr) {
              // Non-fatal: log duplicate-delete failures but continue
              console.warn('Failed to delete some duplicate wishlist entries:', delErr);
            }

            const mapped: WishlistItem = {
              id: serverItem.id || serverItem._id || serverItem.wishlistId || (item && item.id) || '',
              stockId: serverItem.stockId || serverItem.stock_id || item.stockId || '',
              productId: serverItem.productId || serverItem.product_id || item.productId || '',
              productName: serverItem.productName || serverItem.product_name || item.productName || '',
              productImage: serverItem.imageUrl || serverItem.productImage || item.productImage || '',
              price: serverPriceToUnit(serverItem.price ?? normalizedPrice ?? item.price ?? 0, serverItem.quantity ?? totalQuantity ?? item.quantity ?? 1),
              color: serverItem.color ?? serverItem.variantColor ?? serverItem.optionColor ?? serverItem.variant_color ?? serverItem.option_color ?? (serverItem.variant && (serverItem.variant.color || serverItem.variant.colour)) ?? item.color ?? '',
                size: serverItem.size ?? serverItem.variantSize ?? serverItem.optionSize ?? serverItem.variant_size ?? serverItem.option_size ?? (serverItem.variant && (serverItem.variant.size || serverItem.variant.sizeLabel)) ?? item.size ?? '',
              quantity: Number(serverItem.quantity ?? totalQuantity ?? item.quantity ?? 1),
              maxQuantity: Number(serverItem.maxQuantity ?? item.maxQuantity ?? 0),
              isOutOfStock: !!serverItem.isOutOfStock,
              addedAt: serverItem.addedAt || item.addedAt || new Date().toISOString(),
              expiresAt: serverItem.expiresAt ?? item.expiresAt,
            };

            const idx = items.findIndex((i) => (i.id && i.id === mapped.id) || (mapped.stockId && i.stockId === mapped.stockId));
            if (idx >= 0) items[idx] = mapped; else items.push(mapped);
              saveWishlistToStorage(items);
              try { window.dispatchEvent(new Event('wishlist-updated')); } catch {}

            return { items, totalItems: items.length };
          }

          // No existing server record found - create new one
          const createBody: any = {
            userId: nestJsUserId,
            productId: item.productId,
            quantity: item.quantity || 1,
            price: normalizedPrice,
            size: item.size,
            color: item.color,
            imageUrl: item.productImage,
          };

          console.log('[WishlistService] Creating wishlist item with body:', createBody);
          console.log('[WishlistService] userId type:', typeof createBody.userId, 'value:', createBody.userId);

          const created = await apiClient.post('/wishlists', createBody);

          const serverItem = created || {};
          const mappedCreated: WishlistItem = {
            id: serverItem.id || serverItem._id || serverItem.wishlistId || item.id || '',
            stockId: serverItem.stockId || serverItem.stock_id || item.stockId || '',
            productId: serverItem.productId || serverItem.product_id || item.productId || '',
            productName: serverItem.productName || serverItem.product_name || item.productName || '',
            productImage: serverItem.imageUrl || serverItem.productImage || item.productImage || '',
            price: serverPriceToUnit(serverItem.price ?? normalizedPrice ?? item.price ?? 0, serverItem.quantity ?? createBody.quantity ?? item.quantity ?? 1),
            color: serverItem.color ?? serverItem.variantColor ?? serverItem.optionColor ?? serverItem.variant_color ?? serverItem.option_color ?? (serverItem.variant && (serverItem.variant.color || serverItem.variant.colour)) ?? item.color ?? '',
            size: serverItem.size ?? serverItem.variantSize ?? serverItem.optionSize ?? serverItem.variant_size ?? serverItem.option_size ?? (serverItem.variant && (serverItem.variant.size || serverItem.variant.sizeLabel)) ?? item.size ?? '',
            quantity: Number(serverItem.quantity ?? createBody.quantity ?? item.quantity ?? 1),
            maxQuantity: Number(serverItem.maxQuantity ?? item.maxQuantity ?? 0),
            isOutOfStock: !!serverItem.isOutOfStock,
            addedAt: serverItem.addedAt || item.addedAt || new Date().toISOString(),
            expiresAt: serverItem.expiresAt ?? item.expiresAt,
          };

          const existsIdx = items.findIndex((i) => (i.id && i.id === mappedCreated.id) || (mappedCreated.stockId && i.stockId === mappedCreated.stockId));
          if (existsIdx >= 0) items[existsIdx] = mappedCreated; else items.push(mappedCreated);
          saveWishlistToStorage(items);
          try { window.dispatchEvent(new Event('wishlist-updated')); } catch {}

          return { items, totalItems: items.length };
      } catch (error) {
        console.error('Failed to add wishlist item to server:', error);
        // Surface the server error so callers can react (do not silently succeed)
        throw error;
      }
    }

    // Local storage fallback for unauthenticated users or on server error
    const items = getWishlistFromStorage();

    // Normalize and enrich the item before saving locally so the UI shows selected
    // color/size/price immediately (avoids grey/placeholder after adding)
    const normalizeLocalItem = async (raw: WishlistItem): Promise<WishlistItem> => {
      const copy: WishlistItem = {
        id: raw.id || '',
        stockId: raw.stockId,
        productId: raw.productId,
        productName: raw.productName || '',
        productImage: raw.productImage || '',
        price: Number(raw.price) || 0,
        color: raw.color || '',
        size: raw.size || '',
        quantity: Number(raw.quantity) || 1,
        maxQuantity: Number(raw.maxQuantity) || 0,
        isOutOfStock: !!raw.isOutOfStock,
        addedAt: raw.addedAt || new Date().toISOString(),
        expiresAt: raw.expiresAt,
      };

      // If productName or image missing, try to fetch product info (best-effort)
      try {
        if ((!copy.productName || copy.productName === '' || !copy.productImage) && copy.productId) {
          const p = await productsService.getProductById(copy.productId).catch(() => null);
          if (p) {
            copy.productName = copy.productName || (p.name || p.productName || '');
            copy.productImage = copy.productImage || (p.imageUrl || p.productImage || '');
          }
        }
      } catch {}

      // If color/size/maxQuantity missing but stockId provided, try to fetch stock
      try {
        if ((!copy.color || !copy.size || copy.maxQuantity === 0) && copy.stockId) {
          // dynamic import to avoid circular deps at top-level
          const { stockService } = await import('./stockService');
          const s = await stockService.getStockById(copy.stockId).catch(() => null);
          if (s) {
            copy.color = copy.color || s.color || '';
            copy.size = copy.size || s.size || '';
            copy.maxQuantity = copy.maxQuantity || Number(s.quantity) || 0;
            copy.isOutOfStock = copy.maxQuantity === 0;
          } else if (copy.productId) {
            // If stockId lookup failed (some older entries stored productId as stockId),
            // try to fetch all stocks for the product and use the first as a best-effort
            try {
              const stocks = await stockService.getStocksByProductId(copy.productId).catch(() => []);
              if (stocks && stocks.length > 0) {
                const first = stocks[0];
                copy.color = copy.color || first.color || '';
                copy.size = copy.size || first.size || '';
                copy.maxQuantity = copy.maxQuantity || Number(first.quantity) || 0;
                copy.isOutOfStock = copy.maxQuantity === 0;
              }
            } catch {}
          }
        }
      } catch {}

      // Ensure price is a valid normalized number (best-effort)
      try {
        copy.price = normalizePriceValue(copy.price);
      } catch {
        copy.price = Math.round(Number(copy.price || 0) * 100) / 100;
      }

      return copy;
    };

    const exists = items.find((i) => i.stockId === item.stockId);
    if (!exists) {
      // normalize/enrich and then save
      try {
        const mapped = await normalizeLocalItem(item as WishlistItem);
        items.push(mapped);
        saveWishlistToStorage(items);
        // notify listeners so UI updates immediately
        try { window.dispatchEvent(new Event('wishlist-updated')); } catch {}
      } catch (err) {
        // fallback: push raw item
        items.push(item);
        saveWishlistToStorage(items);
        try { window.dispatchEvent(new Event('wishlist-updated')); } catch {}
      }
    }

    return {
      items,
      totalItems: items.length,
    };
  },

  /**
   * Remove item from wishlist
   * @param stockId - Stock ID to remove
   * @returns Updated wishlist
   */
  removeItem: (stockId: string): Wishlist => {
    const items = getWishlistFromStorage();
    const filtered = items.filter((item) => item.stockId !== stockId);
    saveWishlistToStorage(filtered);
    
    return {
      items: filtered,
      totalItems: filtered.length,
    };
  },

  /**
   * Async remove that will remove from server when authenticated, or local fallback.
   */
  removeItemAsync: async (stockIdOrId: string): Promise<Wishlist> => {
    const token = localStorage.getItem('authToken');
    // Helper to remove locally
    const removeLocal = () => {
      const items = getWishlistFromStorage();
      const filtered = items.filter((item) => item.stockId !== stockIdOrId && item.id !== stockIdOrId);
      saveWishlistToStorage(filtered);
      try { window.dispatchEvent(new Event('wishlist-updated')); } catch {}
      return { items: filtered, totalItems: filtered.length } as Wishlist;
    };

    if (token) {
      try {
        const userId = localStorage.getItem('userId') || '';
        const items = getWishlistFromStorage();
        // Try to find local item to derive search params
        const local = items.find(it => it.stockId === stockIdOrId || it.id === stockIdOrId);

        const params = new URLSearchParams();
        if (userId) params.set('userId', userId);
        // Prefer searching by wishlist record id if caller passed an id-like value
        if (local && local.id) {
          // attempt to delete directly
          try {
            await apiClient.delete(`/wishlists/${encodeURIComponent(local.id)}`);
          } catch {}
        }

        // If we have a logged-in user and a productId, there's a convenience
        // endpoint that deletes by userId + productId. Use it when available
        // because it exactly matches the server API for removing a user's
        // wishlist entry for a specific product variant.
        try {
          const productIdForDelete = local?.productId || stockIdOrId || '';
          if (userId && productIdForDelete) {
            try {
              // Convert Spring Boot numeric ID to NestJS UUID
              const nestJsUserId = userId.includes('-') ? userId : await getNestJsUserUuid(userId);
              await apiClient.delete(`/wishlists/user/${encodeURIComponent(nestJsUserId)}/product/${encodeURIComponent(productIdForDelete)}`);
              try { console.debug('[wishlistService] removed via user/product endpoint', nestJsUserId, productIdForDelete); } catch {}
              // Always remove locally afterwards
              return removeLocal();
            } catch (err) {
              try { console.debug('[wishlistService] user/product delete failed', userId, productIdForDelete, err); } catch {}
            }
          }
        } catch (err) {
          // ignore
        }

        // Also try by stockId/product+variant to cover server records. Build params
        // from local info where available, and include the passed identifier as a
        // fallback stockId/productId value.
        if (!params.get('productId') && local && local.productId) params.set('productId', local.productId);
        if (stockIdOrId) params.set('stockId', stockIdOrId);
        if (local && local.size) params.set('size', local.size);
        if (local && local.color) params.set('color', local.color);

        // First attempt: query with constructed params and delete returned ids
        if (params.toString()) {
          try {
            const found = await apiClient.get<any[]>(`/wishlists?${params.toString()}`);
            try { console.debug('[wishlistService] removeItemAsync - found (params):', params.toString(), found); } catch {}
            const arr = Array.isArray(found) ? found : (found && found.items) || [];
            await Promise.all(arr.map(async (f) => {
              const id = f.id || f._id || f.wishlistId || f.id;
              if (id) {
                try { console.debug('[wishlistService] removing id:', id); await apiClient.delete(`/wishlists/${encodeURIComponent(id)}`); } catch (e) { try { console.debug('[wishlistService] delete failed for id:', id, e); } catch {} }
              }
            }));
          } catch (err) {
            // ignore search/delete errors
          }
        }

        // Defensive fallback: query by productId directly (covers records saved using productId)
        try {
          const productQuery = stockIdOrId;
          const foundByProduct = await apiClient.get<any[]>(`/wishlists?productId=${encodeURIComponent(String(productQuery))}`);
          try { console.debug('[wishlistService] removeItemAsync - foundByProduct:', productQuery, foundByProduct); } catch {}
          const arr2 = Array.isArray(foundByProduct) ? foundByProduct : (foundByProduct && foundByProduct.items) || [];
          await Promise.all(arr2.map(async (f) => {
            const id = f.id || f._id || f.wishlistId || f.id;
            if (id) {
              try { console.debug('[wishlistService] removing id (productQuery):', id); await apiClient.delete(`/wishlists/${encodeURIComponent(id)}`); } catch (e) { try { console.debug('[wishlistService] delete failed for id (productQuery):', id, e); } catch {} }
            }
          }));
        } catch (err) {
          // ignore
        }

        // Aggressive cleanup: fetch the user's entire wishlist and remove any entries
        // that match this identifier by stockId OR by productId+size+color. This helps
        // when the server returns unexpected payload shapes or uses different query
        // parameters.
        try {
          if (userId) {
            // Convert Spring Boot numeric ID to NestJS UUID
            const nestJsUserId = userId.includes('-') ? userId : await getNestJsUserUuid(userId);
            const serverList = await apiClient.get<any[]>(`/wishlists/user/${encodeURIComponent(nestJsUserId)}`);
            const listArr = Array.isArray(serverList) ? serverList : (serverList && serverList.items) || [];
            const toDelete: string[] = [];
            for (const f of listArr) {
              const fid = f.id || f._id || f.wishlistId || f.id;
              const fStock = f.stockId || f.stock_id || '';
              const fProduct = f.productId || f.product_id || '';
              const fSize = f.size ?? f.variantSize ?? f.variant?.size ?? '';
              const fColor = f.color ?? f.variantColor ?? f.variant?.color ?? '';

              const matchesStock = Boolean(stockIdOrId && (String(fStock) === String(stockIdOrId) || String(fid) === String(stockIdOrId)));
              const matchesProductVariant = Boolean((String(fProduct) === String(stockIdOrId) || String(fProduct) === String(local?.productId || '')) && ((local && local.size && String(fSize) === String(local.size)) || (local && local.color && String(fColor) === String(local.color)) || (!local)));

              if (fid && (matchesStock || matchesProductVariant)) {
                toDelete.push(fid);
              }
            }
            try { console.debug('[wishlistService] aggressive cleanup, toDelete ids:', toDelete); } catch {}
            await Promise.all(toDelete.map(async (did) => {
              if (!did) return;
              try { console.debug('[wishlistService] removing id (aggressive):', did); await apiClient.delete(`/wishlists/${encodeURIComponent(did)}`); } catch (e) { try { console.debug('[wishlistService] delete failed aggressive id:', did, e); } catch {} }
            }));
          }
        } catch (err) {
          // ignore
        }

        // Always remove locally afterwards
        return removeLocal();
      } catch (err) {
        console.error('Failed to remove wishlist item from server, falling back to local remove', err);
        return removeLocal();
      }
    }

    // Not authenticated: remove locally
    return removeLocal();
  },

  /**
   * Check if item is in wishlist
   * @param stockId - Stock ID to check
   * @returns true if item is in wishlist, false otherwise
   */
  isInWishlist: (stockId: string): boolean => {
    const items = getWishlistFromStorage();
    return items.some((item) => item.stockId === stockId);
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist: (): void => {
    saveWishlistToStorage([]);
  },

  /**
   * Get wishlist item count
   * @returns Number of items in wishlist
   */
  getItemCount: (): number => {
    return getWishlistFromStorage().length;
  },
  
  /**
   * Update a wishlist item on the server (when authenticated) or locally as fallback.
   * @param id - server wishlist item id
   * @param updates - partial fields to update
   */
  updateItem: async (id: string, updates: Partial<WishlistItem> & { isActive?: boolean }): Promise<Wishlist> => {
    const token = localStorage.getItem('authToken');

    // local helper to apply updates to stored items
    const applyLocalUpdate = (items: WishlistItem[]) => {
      const idx = items.findIndex((it) => it.id === id || it.stockId === id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], ...updates } as WishlistItem;
        saveWishlistToStorage(items);
      }
      return items;
    };

    if (token) {
      // Prepare request body in outer scope so catch can reference it if needed
      let body: any = { ...updates };
      // If quantity is being updated but no price provided, include the unit price
      // (prevents server from interpreting/setting a total price)
      const preItems = getWishlistFromStorage();
      const localItemForUpdate = preItems.find(it => it.id === id || it.stockId === id) as WishlistItem | undefined;
      if (body.quantity !== undefined && body.price === undefined && localItemForUpdate) {
        try {
          body.price = normalizePriceValue(localItemForUpdate.price);
        } catch {
          // If normalization fails, don't block the update; leave price undefined
        }
      }
      try {
        // Validate/normalize price if provided
        if (body.price !== undefined) {
          body.price = normalizePriceValue(body.price);
        }

        // Perform PUT to update wishlist item
        const updated = await apiClient.put(`/wishlists/${encodeURIComponent(id)}`, body);

        // Update local cache: prefer server response if it contains the updated item
        const items = getWishlistFromStorage();
        if (updated && (updated.id || updated._id)) {
          const serverItem = updated;
          const mapped = {
            id: serverItem.id || serverItem._id || serverItem.wishlistId || id,
            stockId: serverItem.stockId || serverItem.stock_id || items.find(it => it.id === id)?.stockId || '',
            productId: serverItem.productId || serverItem.product_id || '',
            productName: serverItem.productName || serverItem.product_name || '',
            productImage: serverItem.imageUrl || serverItem.productImage || serverItem.image || '',
            price: serverPriceToUnit(serverItem.price, serverItem.quantity),
            color: serverItem.color ?? serverItem.variantColor ?? serverItem.optionColor ?? serverItem.variant_color ?? serverItem.option_color ?? (serverItem.variant && (serverItem.variant.color || serverItem.variant.colour)) ?? updates.color ?? '',
            size: serverItem.size ?? serverItem.variantSize ?? serverItem.optionSize ?? serverItem.variant_size ?? serverItem.option_size ?? (serverItem.variant && (serverItem.variant.size || serverItem.variant.sizeLabel)) ?? updates.size ?? '',
            quantity: Number(serverItem.quantity) || updates.quantity || 1,
            maxQuantity: Number(serverItem.maxQuantity) || 0,
            isOutOfStock: !!serverItem.isOutOfStock,
            addedAt: serverItem.addedAt || new Date().toISOString(),
            expiresAt: serverItem.expiresAt || undefined,
          } as WishlistItem;

          const idx = items.findIndex(it => it.id === id || it.stockId === mapped.stockId);
          if (idx >= 0) items[idx] = mapped;
          else items.push(mapped);
          saveWishlistToStorage(items);
          return { items, totalItems: items.length };
        }

        // Fallback: apply local update
        const localUpdated = applyLocalUpdate(items);
        return { items: localUpdated, totalItems: localUpdated.length };
      } catch (error) {
        // If the server reports the wishlist item not found, attempt to find existing
        // user+product+variant records and update/merge them instead of creating duplicates.
        const status = (error as any)?.status;
        if (status === 404) {
          try {
            const items = getWishlistFromStorage();
            const localItem = items.find(it => it.id === id || it.stockId === id) as WishlistItem | undefined;

            const userId = localStorage.getItem('userId') || '';
            // Build search criteria
            const searchProductId = localItem?.productId || body.productId || '';
            const searchSize = body.size ?? localItem?.size ?? '';
            const searchColor = body.color ?? localItem?.color ?? '';

            const params = new URLSearchParams();
            if (userId) params.set('userId', userId);
            if (searchProductId) params.set('productId', searchProductId);
            if (searchSize) params.set('size', searchSize);
            if (searchColor) params.set('color', searchColor);

            let foundOnServer: any[] = [];
            if (params.toString()) {
              try {
                const res = await apiClient.get<any[]>(`/wishlists?${params.toString()}`);
                foundOnServer = Array.isArray(res) ? res : (res && res.items) || [];
              } catch (searchErr) {
                console.warn('Wishlist search failed; will attempt create:', searchErr);
                foundOnServer = [];
              }
            }

            if (foundOnServer.length > 0) {
              // Update primary record (first match) with requested quantity (do not sum on explicit update)
              const primary = foundOnServer[0];
              const primaryId = primary.id || primary._id || primary.wishlistId || primary.id;
              let updateBody: any = { ...body };
              if (updateBody.price !== undefined) updateBody.price = normalizePriceValue(updateBody.price);

              const updatedServer = await apiClient.put(`/wishlists/${encodeURIComponent(primaryId)}`, updateBody);

              // Delete duplicate records, if any
              const duplicates = foundOnServer.slice(1);
              try {
                await Promise.all(
                  duplicates.map((d) => {
                    const did = d.id || d._id || d.wishlistId || d.id;
                    return did ? apiClient.delete(`/wishlists/${encodeURIComponent(did)}`) : Promise.resolve(null);
                  })
                );
              } catch (delErr) {
                console.warn('Failed to delete duplicate wishlist records:', delErr);
              }

              const serverItem = updatedServer || primary;
              const mapped: WishlistItem = {
                id: serverItem.id || serverItem._id || serverItem.wishlistId || (localItem && localItem.id) || '',
                stockId: serverItem.stockId || serverItem.stock_id || localItem?.stockId || '',
                productId: serverItem.productId || serverItem.product_id || searchProductId || localItem?.productId || '',
                productName: serverItem.productName || serverItem.product_name || localItem?.productName || '',
                productImage: serverItem.imageUrl || serverItem.productImage || localItem?.productImage || '',
                price: serverPriceToUnit(serverItem.price ?? body.price ?? localItem?.price ?? 0, serverItem.quantity ?? body.quantity ?? localItem?.quantity ?? 1),
                color: serverItem.color ?? serverItem.variantColor ?? serverItem.optionColor ?? serverItem.variant_color ?? serverItem.option_color ?? body.color ?? localItem?.color ?? '',
                size: serverItem.size ?? serverItem.variantSize ?? serverItem.optionSize ?? serverItem.variant_size ?? serverItem.option_size ?? body.size ?? localItem?.size ?? '',
                quantity: Number(serverItem.quantity ?? body.quantity ?? localItem?.quantity ?? 1),
                maxQuantity: Number(serverItem.maxQuantity ?? localItem?.maxQuantity ?? 0),
                isOutOfStock: !!serverItem.isOutOfStock,
                addedAt: serverItem.addedAt || localItem?.addedAt || new Date().toISOString(),
                expiresAt: serverItem.expiresAt ?? localItem?.expiresAt,
              };

              const existingIdx = items.findIndex(it => (it.id && it.id === mapped.id) || (mapped.stockId && it.stockId === mapped.stockId));
              if (existingIdx >= 0) items[existingIdx] = mapped; else items.push(mapped);
              saveWishlistToStorage(items);
              return { items, totalItems: items.length };
            }

            // No server matches found; create a new record
            const createBody: any = {
              userId,
              productId: localItem?.productId || body.productId || '',
              quantity: body.quantity ?? localItem?.quantity ?? 1,
              price: body.price ?? localItem?.price ?? 0,
              size: body.size ?? localItem?.size ?? '',
              color: body.color ?? localItem?.color ?? '',
              imageUrl: (localItem && localItem.productImage) || body.imageUrl || '',
            };

            createBody.price = normalizePriceValue(createBody.price);

            const created = await apiClient.post('/wishlists', createBody);

            const serverItem = created || {};
            const mapped: WishlistItem = {
              id: serverItem.id || serverItem._id || serverItem.wishlistId || (localItem && localItem.id) || '',
              stockId: serverItem.stockId || serverItem.stock_id || localItem?.stockId || '',
              productId: serverItem.productId || serverItem.product_id || createBody.productId || localItem?.productId || '',
              productName: serverItem.productName || serverItem.product_name || localItem?.productName || '',
              productImage: serverItem.imageUrl || serverItem.productImage || createBody.imageUrl || localItem?.productImage || '',
              price: serverPriceToUnit(serverItem.price ?? createBody.price ?? localItem?.price ?? 0, serverItem.quantity ?? createBody.quantity ?? localItem?.quantity ?? 1),
              color: serverItem.color ?? serverItem.variantColor ?? serverItem.optionColor ?? serverItem.variant_color ?? serverItem.option_color ?? createBody.color ?? localItem?.color ?? '',
              size: serverItem.size ?? serverItem.variantSize ?? serverItem.optionSize ?? serverItem.variant_size ?? serverItem.option_size ?? createBody.size ?? localItem?.size ?? '',
              quantity: Number(serverItem.quantity ?? createBody.quantity ?? localItem?.quantity ?? 1),
              maxQuantity: Number(serverItem.maxQuantity ?? localItem?.maxQuantity ?? 0),
              isOutOfStock: !!serverItem.isOutOfStock,
              addedAt: serverItem.addedAt || localItem?.addedAt || new Date().toISOString(),
              expiresAt: serverItem.expiresAt ?? localItem?.expiresAt,
            };

            const existingIdx = items.findIndex(it => (it.id && it.id === mapped.id) || (mapped.stockId && it.stockId === mapped.stockId));
            if (existingIdx >= 0) items[existingIdx] = mapped;
            else items.push(mapped);
            saveWishlistToStorage(items);
            return { items, totalItems: items.length };
          } catch (createErr) {
            console.error('Failed to create or update wishlist item after 404:', createErr);
            throw createErr;
          }
        }

        console.error('Failed to update wishlist item on server:', error);
        throw error;
      }
    }

    // Not authenticated - update local storage only
    const items = getWishlistFromStorage();
    const updatedLocal = applyLocalUpdate(items);
    return { items: updatedLocal, totalItems: updatedLocal.length };
  },
};

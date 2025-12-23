import type { WishlistItem, Wishlist } from '../../types/wishlist';
import { apiClient } from '../apiClient';
import { productsService } from './products';

const WISHLIST_STORAGE_KEY = 'swm_wishlist';

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
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse wishlist from localStorage:', error);
    return [];
  }
};

const saveWishlistToStorage = (items: WishlistItem[]): void => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
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
      const userId = localStorage.getItem('userId') || '';
      try {
        // Prefer the user-specific endpoint. If wishlistId provided, request the specific item.
        const endpoint = wishlistId
          ? `/wishlists/user/${encodeURIComponent(userId)}/${encodeURIComponent(wishlistId)}`
          : `/wishlists/user/${encodeURIComponent(userId)}`;
        const serverItems = await apiClient.get<any[]>(endpoint);

        // Map/normalize server response to WishlistItem[] if necessary
        const serverArray = Array.isArray(serverItems) ? serverItems : serverItems ? [serverItems] : [];
        const items = serverArray.map((si) => ({
              id: si.id || si._id || si.wishlistId || '',
              stockId: si.stockId || si.stock_id || '',
              productId: si.productId || si.product_id || si.productId || '',
              productName: si.productName || si.product_name || si.name || '',
              productImage: si.imageUrl || si.productImage || si.image || '',
              price: serverPriceToUnit(si.price, si.quantity),
              color: si.color || '',
              size: si.size || '',
              quantity: Number(si.quantity) || 1,
              maxQuantity: Number(si.maxQuantity) || 0,
              isOutOfStock: !!si.isOutOfStock,
              addedAt: si.addedAt || new Date().toISOString(),
              expiresAt: si.expiresAt || undefined,
            }))
          ;

        // If some items lack productName (server didn't return it), fetch product details
        const missingNameIds = Array.from(new Set(items.filter(it => !it.productName && it.productId).map(it => it.productId)));
        if (missingNameIds.length > 0) {
          try {
            const fetched = await Promise.all(missingNameIds.map(pid => productsService.getProductById(pid).catch(() => null)));
            const nameMap: Record<string, string> = {};
            fetched.forEach(p => { if (p && p.id) nameMap[p.id] = p.name || p.productName || ''; });
            for (const it of items) {
              if ((!it.productName || it.productName === '') && it.productId && nameMap[it.productId]) {
                it.productName = nameMap[it.productId];
              }
            }
          } catch (err) {
            // ignore product fetch errors
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
      const userId = localStorage.getItem('userId') || '';
      try {
          // Validate and normalize price according to API constraints
          const normalizedPrice = normalizePriceValue(item.price);

          // Build search params to detect existing wishlist entries for this user+product+variant
          const params = new URLSearchParams();
          if (userId) params.set('userId', userId);
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
              color: serverItem.color ?? item.color ?? '',
              size: serverItem.size ?? item.size ?? '',
              quantity: Number(serverItem.quantity ?? totalQuantity ?? item.quantity ?? 1),
              maxQuantity: Number(serverItem.maxQuantity ?? item.maxQuantity ?? 0),
              isOutOfStock: !!serverItem.isOutOfStock,
              addedAt: serverItem.addedAt || item.addedAt || new Date().toISOString(),
              expiresAt: serverItem.expiresAt ?? item.expiresAt,
            };

            const idx = items.findIndex((i) => (i.id && i.id === mapped.id) || (mapped.stockId && i.stockId === mapped.stockId));
            if (idx >= 0) items[idx] = mapped; else items.push(mapped);
            saveWishlistToStorage(items);

            return { items, totalItems: items.length };
          }

          // No existing server record found - create new one
          const createBody: any = {
            userId,
            productId: item.productId,
            quantity: item.quantity || 1,
            price: normalizedPrice,
            size: item.size,
            color: item.color,
            imageUrl: item.productImage,
          };

          const created = await apiClient.post('/wishlists', createBody);

          const serverItem = created || {};
          const mappedCreated: WishlistItem = {
            id: serverItem.id || serverItem._id || serverItem.wishlistId || item.id || '',
            stockId: serverItem.stockId || serverItem.stock_id || item.stockId || '',
            productId: serverItem.productId || serverItem.product_id || item.productId || '',
            productName: serverItem.productName || serverItem.product_name || item.productName || '',
            productImage: serverItem.imageUrl || serverItem.productImage || item.productImage || '',
            price: serverPriceToUnit(serverItem.price ?? normalizedPrice ?? item.price ?? 0, serverItem.quantity ?? createBody.quantity ?? item.quantity ?? 1),
            color: serverItem.color ?? item.color ?? '',
            size: serverItem.size ?? item.size ?? '',
            quantity: Number(serverItem.quantity ?? createBody.quantity ?? item.quantity ?? 1),
            maxQuantity: Number(serverItem.maxQuantity ?? item.maxQuantity ?? 0),
            isOutOfStock: !!serverItem.isOutOfStock,
            addedAt: serverItem.addedAt || item.addedAt || new Date().toISOString(),
            expiresAt: serverItem.expiresAt ?? item.expiresAt,
          };

          const existsIdx = items.findIndex((i) => (i.id && i.id === mappedCreated.id) || (mappedCreated.stockId && i.stockId === mappedCreated.stockId));
          if (existsIdx >= 0) items[existsIdx] = mappedCreated; else items.push(mappedCreated);
          saveWishlistToStorage(items);

          return { items, totalItems: items.length };
      } catch (error) {
        console.error('Failed to add wishlist item to server:', error);
        // Surface the server error so callers can react (do not silently succeed)
        throw error;
      }
    }

    // Local storage fallback for unauthenticated users or on server error
    const items = getWishlistFromStorage();
    
    // Check if item already exists
    const exists = items.find((i) => i.stockId === item.stockId);
    if (!exists) {
      items.push(item);
      saveWishlistToStorage(items);
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
            color: serverItem.color || updates.color || '',
            size: serverItem.size || updates.size || '',
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
                color: serverItem.color ?? body.color ?? localItem?.color ?? '',
                size: serverItem.size ?? body.size ?? localItem?.size ?? '',
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
              color: serverItem.color ?? createBody.color ?? localItem?.color ?? '',
              size: serverItem.size ?? createBody.size ?? localItem?.size ?? '',
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

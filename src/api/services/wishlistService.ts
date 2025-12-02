import type { WishlistItem, Wishlist } from '../../types/wishlist';

const WISHLIST_STORAGE_KEY = 'swm_wishlist';

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

// Save wishlist to localStorage
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
    const items = getWishlistFromStorage();
    return {
      items,
      totalItems: items.length,
    };
  },

  /**
   * Add item to wishlist
   * @param item - WishlistItem to add
   * @returns Updated wishlist
   */
  addItem: (item: WishlistItem): Wishlist => {
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
};

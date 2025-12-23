/**
 * Wishlist-related types
 */

export interface WishlistItem {
  /** Server-side wishlist item id (optional) */
  id?: string;
  stockId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  color: string;
  size: string;
  quantity: number; // Selected quantity by user
  maxQuantity: number; // Maximum available quantity for this size/color combination
  isOutOfStock?: boolean; // Flag to mark out-of-stock items
  addedAt: string;
  expiresAt?: string; // Optional 30-day expiration date for wishlist items
}

export interface Wishlist {
  items: WishlistItem[];
  totalItems: number;
}

/**
 * Cart-related types
 */

export interface CartItem {
  stockId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  maxQuantity: number; // Maximum available quantity for this size/color combination
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
}

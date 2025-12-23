
export interface CartItem {
  stockId: string;
  productId: string;
  productName: string;
  productImage: string;
  brandName?: string;
  userId?: string;
  price: number;
  color: string;
  size: string;
  quantity: number; // Selected quantity by user
  maxQuantity: number; // Maximum available quantity for this size/color combination
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
}

// Server-side cart row (partial) as returned by backend APIs
export interface ServerCartRow {
  id?: string;
  stockId?: string;
  userId?: string;
  productId?: string;
  productName?: string;
  imageUrl?: string;
  image?: string;
  productImage?: string;
  size?: string;
  color?: string;
  quantity?: number | string;
  maxQuantity?: number | string;
  availableQuantity?: number | string;
  price?: number | string;
  isActive?: boolean;
  createAt?: string;
  createdAt?: string;
}

export type ApiError = { status?: number; statusText?: string; body?: { message?: string } };


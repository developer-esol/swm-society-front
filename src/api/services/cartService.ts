import type { CartItem, Cart } from '../../types/cart';

const CART_STORAGE_KEY = 'swm_cart';

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


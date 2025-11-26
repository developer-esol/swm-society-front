import { useCallback } from 'react';
import { cartService } from '../api/services/cartService';
import type { CartItem } from '../types/cart';

export const useCart = () => {
  const getCart = useCallback(() => {
    return cartService.getCart();
  }, []);

  const addItem = useCallback((item: CartItem) => {
    cartService.addItem(item);
  }, []);

  const removeItem = useCallback((stockId: string) => {
    cartService.removeItem(stockId);
  }, []);

  const updateItemQuantity = useCallback((stockId: string, quantity: number) => {
    cartService.updateItemQuantity(stockId, quantity);
  }, []);

  const isInCart = useCallback((stockId: string) => {
    return cartService.isInCart(stockId);
  }, []);

  const clearCart = useCallback(() => {
    cartService.clearCart();
  }, []);

  const getItemCount = useCallback(() => {
    return cartService.getItemCount();
  }, []);

  const getCartTotal = useCallback(() => {
    return cartService.getCartTotal();
  }, []);

  return {
    getCart,
    addItem,
    removeItem,
    updateItemQuantity,
    isInCart,
    clearCart,
    getItemCount,
    getCartTotal,
  };
};

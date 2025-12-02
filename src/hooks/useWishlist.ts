import { useCallback } from 'react';
import { wishlistService } from '../api/services/wishlistService';
import type { WishlistItem } from '../types/wishlist';

/**
 * Hook for managing wishlist items
 * Provides methods to add, remove, and check wishlist items
 */
export const useWishlist = () => {
  const addItem = useCallback((item: WishlistItem) => {
    try {
      wishlistService.addItem(item);
      return true;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      return false;
    }
  }, []);

  const removeItem = useCallback((stockId: string) => {
    try {
      wishlistService.removeItem(stockId);
      return true;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return false;
    }
  }, []);

  const isInWishlist = useCallback((stockId: string) => {
    try {
      return wishlistService.isInWishlist(stockId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }, []);

  const getItemCount = useCallback(() => {
    try {
      return wishlistService.getItemCount();
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }, []);

  const getWishlist = useCallback(() => {
    try {
      return wishlistService.getWishlist();
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return { items: [], totalItems: 0 };
    }
  }, []);

  const clearWishlist = useCallback(() => {
    try {
      wishlistService.clearWishlist();
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }
  }, []);

  return {
    addItem,
    removeItem,
    isInWishlist,
    getItemCount,
    getWishlist,
    clearWishlist,
  };
};

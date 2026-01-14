import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../api/services/wishlistService';
import { QUERY_KEYS } from '../configs/queryKeys';
import type { WishlistItem } from '../types/wishlist';

/**
 * Hook for managing wishlist items
 * Provides methods to add, remove, and check wishlist items
 * Uses TanStack Query for automatic cache invalidation
 */
export const useWishlist = () => {
  const queryClient = useQueryClient();

  // Query for getting wishlist
  const { data: wishlist, refetch: refetchWishlist } = useQuery({
    queryKey: QUERY_KEYS.wishlist.all,
    queryFn: () => wishlistService.getWishlistAsync(),
    initialData: { items: [], totalItems: 0 },
  });

  // Mutation for adding item
  const addItemMutation = useMutation({
    mutationFn: (item: WishlistItem) => wishlistService.addItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist.all });
    },
  });

  const addItem = useCallback(async (item: WishlistItem) => {
    try {
      await addItemMutation.mutateAsync(item);
      return true;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      throw error;
    }
  }, [addItemMutation]);

  // Mutation for removing item
  const removeItemMutation = useMutation({
    mutationFn: (stockId: string) => {
      wishlistService.removeItem(stockId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist.all });
    },
  });

  const removeItem = useCallback((stockId: string) => {
    try {
      removeItemMutation.mutate(stockId);
      return true;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return false;
    }
  }, [removeItemMutation]);

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

  const getWishlist = useCallback(async () => {
    return wishlist;
  }, [wishlist]);

  // Mutation for clearing wishlist
  const clearWishlistMutation = useMutation({
    mutationFn: () => {
      wishlistService.clearWishlist();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist.all });
    },
  });

  const clearWishlist = useCallback(() => {
    try {
      clearWishlistMutation.mutate();
      return true;
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return false;
    }
  }, [clearWishlistMutation]);

  return {
    wishlist,
    addItem,
    removeItem,
    isInWishlist,
    getItemCount,
    getWishlist,
    clearWishlist,
    refetchWishlist,
  };
};

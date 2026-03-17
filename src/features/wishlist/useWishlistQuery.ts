import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../../api/services/wishlistService';
import { useAuthStore } from '../../store/useAuthStore';
import type { WishlistItem } from '../../types/wishlist';

export function useWishlistQuery() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id || localStorage.getItem('userId') || undefined;

  console.log('[useWishlistQuery] ========================================');
  console.log('[useWishlistQuery] Initializing wishlist for user:', userId);
  console.log('[useWishlistQuery] Authenticated:', isAuthenticated);
  console.log('[useWishlistQuery] Token:', localStorage.getItem('authToken') ? '✅ Present' : '❌ Missing');
  console.log('[useWishlistQuery] ========================================');

  const wishlistQueryKey = ['wishlist', userId || 'anonymous'];

  // Listen for wishlist updates from external components
  React.useEffect(() => {
    const handleWishlistUpdate = () => {
      console.log('[useWishlistQuery] Wishlist update event received, invalidating query');
      queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    };
    
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [queryClient, wishlistQueryKey]);

  const { data: wishlistItems = [], isLoading, isError } = useQuery<WishlistItem[]>({
    queryKey: wishlistQueryKey,
    queryFn: async () => {
      console.log('[useWishlistQuery] Fetching wishlist data...');
      if (isAuthenticated && userId) {
        console.log('[useWishlistQuery] → Fetching server wishlist for user:', userId);
        const wishlist = await wishlistService.getWishlistAsync();
        console.log('[useWishlistQuery] ✅ Received', wishlist.items.length, 'wishlist items from server');
        return wishlist.items;
      }
      console.log('[useWishlistQuery] → Using local wishlist (not authenticated)');
      const local = wishlistService.getWishlist();
      return local.items;
    },
    staleTime: 1000 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const addMutation = useMutation({
    mutationFn: async (item: WishlistItem) => {
      return await wishlistService.addItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (stockId: string) => {
      await wishlistService.removeItem(stockId);
    },
    onMutate: async (stockId: string) => {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKey });
      const previous = queryClient.getQueryData<WishlistItem[]>(wishlistQueryKey) || [];
      const next = previous.filter((it) => String(it.stockId) !== String(stockId) && String(it.productId) !== String(stockId));
      queryClient.setQueryData(wishlistQueryKey, next);
      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(wishlistQueryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: wishlistQueryKey }),
  });

  return {
    wishlistItems,
    isLoading,
    isError,
    addItem: (item: WishlistItem) => addMutation.mutate(item),
    removeItem: (stockId: string) => removeMutation.mutate(stockId),
    isInWishlist: (stockId: string) => wishlistItems.some(item => item.stockId === stockId),
  };
}

export default useWishlistQuery;

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../../api/services/cartService';
import { useAuthStore } from '../../store/useAuthStore';
import type { CartItem } from '../../types/cart';

type UpdateQtyInput = { stockId: string; quantity: number };

export function useCartQuery() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id || localStorage.getItem('userId') || undefined;

  console.log('[useCartQuery] ========================================');
  console.log('[useCartQuery] Initializing cart for user:', userId);
  console.log('[useCartQuery] Authenticated:', isAuthenticated);
  console.log('[useCartQuery] Token:', localStorage.getItem('authToken') ? '✅ Present' : '❌ Missing');
  console.log('[useCartQuery] ========================================');

  const cartQueryKey = ['cart', userId || 'anonymous'];

  // Listen for cart updates from external components
  React.useEffect(() => {
    const handleCartUpdate = () => {
      console.log('[useCartQuery] Cart update event received, invalidating query');
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [queryClient, cartQueryKey]);

  const { data: cartItems = [], isLoading, isError } = useQuery<CartItem[]>({
    queryKey: cartQueryKey,
    queryFn: async () => {
      console.log('[useCartQuery] Fetching cart data...');
      // Always check localStorage for userId even if auth store isn't ready yet
      const currentUserId = user?.id || localStorage.getItem('userId');
      const hasToken = !!localStorage.getItem('authToken');
      
      if (hasToken && currentUserId) {
        console.log('[useCartQuery] → Fetching server cart for user:', currentUserId);
        const items = await cartService.getUserCart(currentUserId);
        console.log('[useCartQuery] ✅ Received', items.length, 'cart items from server');
        return items;
      }
      console.log('[useCartQuery] → Using local cart (not authenticated)');
      const local = cartService.getCart();
      return local.items;
    },
    staleTime: 1000 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: true, // Always enabled, query will check auth internally
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ stockId, quantity }: UpdateQtyInput) => {
      // update local cache/storage first
      cartService.updateItemQuantity(stockId, quantity);

      // If authenticated, propagate to server
      if (isAuthenticated && userId) {
        const item = cartItems.find((i) => i.stockId === stockId);
        if (!item) return;
        const payload = {
          quantity: Number(quantity),
          price: Number(item.price),
          size: item.size,
          color: item.color,
          imageUrl: item.productImage,
          isActive: true,
        } as Record<string, unknown>;
        await cartService.updateServerCartItemByUserProduct(userId, item.productId, payload);
      }
    },
    onMutate: async ({ stockId, quantity }: UpdateQtyInput) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });
      const previous = queryClient.getQueryData<CartItem[]>(cartQueryKey) || [];
      const next = previous.map((it) => (it.stockId === stockId ? { ...it, quantity: Number(quantity) } : it));
      queryClient.setQueryData(cartQueryKey, next);
      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(cartQueryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartQueryKey }),
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: CartItem) => {
      console.log('[useCartQuery] Adding item to cart:', item);
      // Add to local storage first
      cartService.addItem(item);
      
      // If authenticated, add to server
      if (isAuthenticated && userId) {
        console.log('[useCartQuery] Adding to server cart for user:', userId);
        await cartService.addToServerCart(item);
      }
    },
    onSuccess: () => {
      console.log('[useCartQuery] Item added successfully, invalidating cart cache');
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
      // Dispatch event for other components listening (like cart icon)
      window.dispatchEvent(new Event('cart-updated'));
    },
    onError: (error) => {
      console.error('[useCartQuery] Error adding item to cart:', error);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      // id may be a stockId or a productId; try to resolve local item
      const item = (cartItems || []).find((i) => String(i.stockId) === String(id) || String(i.productId) === String(id));
      // Remove locally by stockId if available, otherwise by provided id
      const localStockId = item?.stockId || id;
      cartService.removeItem(localStockId);
      if (isAuthenticated && userId) {
        // If we can determine productId, attempt server delete by user/product endpoint
        const productId = item?.productId || id;
        try {
          await cartService.removeServerCartItemByUserProduct(userId, String(productId));
        } catch (err) {
          // fallback: try syncing from server
          try { await cartService.syncServerCartToLocal(); } catch (e) { /* ignore */ }
        }
      }
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });
      const previous = queryClient.getQueryData<CartItem[]>(cartQueryKey) || [];
      const next = previous.filter((it) => (String(it.stockId) !== String(id) && String(it.productId) !== String(id)));
      queryClient.setQueryData(cartQueryKey, next);
      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(cartQueryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartQueryKey }),
  });

  return {
    cartItems,
    isLoading,
    isError,
    addItem: (item: CartItem) => addItemMutation.mutate(item),
    increaseQuantity: (stockId: string, maxQuantity?: number) => {
      const current = Number((cartItems.find((i) => i.stockId === stockId)?.quantity) ?? 1);
      const maxQ = typeof maxQuantity !== 'undefined' ? Number(maxQuantity) : undefined;
      if (typeof maxQ === 'number' && !Number.isNaN(maxQ) && maxQ > 0) {
        if (current < maxQ) updateQuantityMutation.mutate({ stockId, quantity: current + 1 });
      } else {
        updateQuantityMutation.mutate({ stockId, quantity: current + 1 });
      }
    },
    decreaseQuantity: (stockId: string) => {
      const current = Number((cartItems.find((i) => i.stockId === stockId)?.quantity) ?? 1);
      if (current > 1) updateQuantityMutation.mutate({ stockId, quantity: current - 1 });
    },
    removeItem: (stockId: string) => removeMutation.mutate(stockId),
  };
}

export const useCart = useCartQuery;

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

  const { data: cartItems = [], isLoading, isError } = useQuery<CartItem[]>({
    queryKey: cartQueryKey,
    queryFn: async () => {
      console.log('[useCartQuery] Fetching cart data...');
      if (isAuthenticated && userId) {
        console.log('[useCartQuery] → Fetching server cart for user:', userId);
        const items = await cartService.getUserCart(userId);
        console.log('[useCartQuery] ✅ Received', items.length, 'cart items from server');
        return items;
      }
      console.log('[useCartQuery] → Using local cart (not authenticated)');
      const local = cartService.getCart();
      return local.items;
    },
    staleTime: 1000 * 30,
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

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../api/services/cartService';
import { QUERY_KEYS } from '../configs/queryKeys';
import type { CartItem } from '../types/cart';

export const useCart = () => {
  const queryClient = useQueryClient();

  // Query for getting cart
  const { data: cart, refetch: refetchCart } = useQuery({
    queryKey: QUERY_KEYS.cart.all,
    queryFn: () => cartService.getCart(),
    initialData: { items: [], totalItems: 0, totalPrice: 0 },
  });

  const getCart = useCallback(() => {
    return cart;
  }, [cart]);

  // Mutation for adding item
  const addItemMutation = useMutation({
    mutationFn: (item: CartItem) => {
      cartService.addItem(item);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.all });
    },
  });

  const addItem = useCallback((item: CartItem) => {
    addItemMutation.mutate(item);
  }, [addItemMutation]);

  // Mutation for adding to server cart
  const addItemServerMutation = useMutation({
    mutationFn: (item: CartItem) => cartService.addToServerCart(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.all });
    },
  });

  const addItemServer = useCallback(async (item: CartItem) => {
    return addItemServerMutation.mutateAsync(item);
  }, [addItemServerMutation]);

  const getServerCart = useCallback(async () => {
    return cartService.getServerCart();
  }, []);

  const syncServerCartToLocal = useCallback(async () => {
    const result = await cartService.syncServerCartToLocal();
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.all });
    return result;
  }, [queryClient]);

  // Mutation for removing item
  const removeItemMutation = useMutation({
    mutationFn: (stockId: string) => {
      cartService.removeItem(stockId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.all });
    },
  });

  const removeItem = useCallback((stockId: string) => {
    removeItemMutation.mutate(stockId);
  }, [removeItemMutation]);

  // Mutation for updating quantity
  const updateQuantityMutation = useMutation({
    mutationFn: ({ stockId, quantity }: { stockId: string; quantity: number }) => {
      cartService.updateItemQuantity(stockId, quantity);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.all });
    },
  });

  const updateItemQuantity = useCallback((stockId: string, quantity: number) => {
    updateQuantityMutation.mutate({ stockId, quantity });
  }, [updateQuantityMutation]);

  const isInCart = useCallback((stockId: string) => {
    return cartService.isInCart(stockId);
  }, []);

  // Mutation for clearing cart
  const clearCartMutation = useMutation({
    mutationFn: () => {
      cartService.clearCart();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.all });
    },
  });

  const clearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);

  const getItemCount = useCallback(() => {
    return cartService.getItemCount();
  }, []);

  const getCartTotal = useCallback(() => {
    return cartService.getCartTotal();
  }, []);

  return {
    cart,
    getCart,
    addItem,
    addItemServer,
    getServerCart,
    syncServerCartToLocal,
    removeItem,
    updateItemQuantity,
    isInCart,
    clearCart,
    getItemCount,
    getCartTotal,
    refetchCart,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loyaltyService } from '../api/services/loyaltyService';
import type { RedeemPointsRequest } from '../types/loyalty';

// Query key constants
const LOYALTY_KEYS = {
  balance: (userId: string | number) => ['loyalty', 'balance', userId] as const,
  maxRedeemable: (basketTotal: number) => ['loyalty', 'maxRedeemable', basketTotal] as const,
  history: (userId: string | number) => ['loyalty', 'history', userId] as const,
};

/**
 * Hook to fetch user's loyalty points balance
 */
export function useLoyaltyBalance(userId: string | number | undefined) {
  return useQuery({
    queryKey: LOYALTY_KEYS.balance(userId || ''),
    queryFn: () => loyaltyService.getUserBalance(userId!),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds - refresh more frequently
    refetchInterval: 1000 * 30, // Auto-refetch every 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 2,
  });
}

/**
 * Hook to calculate maximum redeemable points for a basket total
 */
export function useMaxRedeemable(basketTotal: number) {
  return useQuery({
    queryKey: LOYALTY_KEYS.maxRedeemable(basketTotal),
    queryFn: () => loyaltyService.calculateMaxRedeemable(basketTotal),
    enabled: basketTotal > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch user's loyalty transaction history
 */
export function useLoyaltyHistory(userId: string | number | undefined) {
  return useQuery({
    queryKey: LOYALTY_KEYS.history(userId || ''),
    queryFn: () => loyaltyService.getTransactionHistory(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to redeem loyalty points during checkout
 */
export function useRedeemPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RedeemPointsRequest) => 
      loyaltyService.redeemLoyaltyPoints(request),
    onSuccess: (_data, variables) => {
      // Invalidate the user's balance query to refresh points
      queryClient.invalidateQueries({ 
        queryKey: LOYALTY_KEYS.balance(variables.userId) 
      });
    },
    onError: (error) => {
      console.error('Failed to redeem loyalty points:', error);
    },
  });
}

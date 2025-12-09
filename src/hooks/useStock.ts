import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService } from '../api/services/stockService';
import { productsService } from '../api/services';
import type { CreateStockData } from '../types/product';

export const useStocks = (productId: string | undefined, refreshTrigger?: number) => {
  return useQuery({
    queryKey: ['stocks', productId, refreshTrigger],
    queryFn: () => stockService.getStocksByProductId(productId!),
    enabled: !!productId,
  });
};

export const useAllStocks = () => {
  return useQuery({
    queryKey: ['stocks', 'all'],
    queryFn: () => stockService.getAllStocks(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsService.getProductById(productId!),
    enabled: !!productId,
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productsService.getProducts(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStockData) => stockService.createStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStockData> }) => 
      stockService.updateStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => stockService.deleteStock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
    },
  });
};
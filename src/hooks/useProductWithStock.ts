import { useQuery } from '@tanstack/react-query';
import { productsService, stockService } from '../api/services';
import type { Product, Stock } from '../types/product';

export const useProductWithStock = (productId: string | undefined) => {
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsService.getProductById(productId!),
    enabled: !!productId,
  });

  const stockQuery = useQuery({
    queryKey: ['stocks', productId],
    queryFn: () => stockService.getStocksByProductId(productId!),
    enabled: !!productId,
  });

  return {
    product: productQuery.data,
    stocks: stockQuery.data || [],
    isLoading: productQuery.isLoading || stockQuery.isLoading,
    isError: productQuery.isError || stockQuery.isError,
    error: productQuery.error || stockQuery.error,
  };
};
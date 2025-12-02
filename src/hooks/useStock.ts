import { useQuery } from '@tanstack/react-query';
import { stockService } from '../api/services/stockService';
import { productsService } from '../api/services';

export const useStocks = (productId: string | undefined, refreshTrigger?: number) => {
  return useQuery({
    queryKey: ['stocks', productId, refreshTrigger],
    queryFn: () => stockService.getStocksByProductId(productId!),
    enabled: !!productId,
  });
};

export const useProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsService.getProductById(productId!),
    enabled: !!productId,
  });
};
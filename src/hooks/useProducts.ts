import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../configs/queryKeys";
import { getAdminProducts } from "../api/services/admin/productsService";
import { productsService } from "../api/services/products";

export function useAdminProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products.admin,
    queryFn: getAdminProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });
}


export function useProjectZeroProduct(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.projectZero,
    queryFn: async () => {
      console.log('Fetching Project ZerO products from database API');
      return await productsService.getProductsByCollection("Project ZerO's");
    },
    enabled,
    staleTime: 1000 * 60 * 5,  // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    retry: 2,
  });
}


export function useProjectThomasMushetProduct(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.thomasMushet,
    queryFn: async () => {
      console.log('Fetching Thomas Mushet products from database API');
      return await productsService.getProductsByCollection('Thomas Mushet');
    },
    enabled,
    staleTime: 1000 * 60 * 5,  // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    retry: 2,
  });
}

export function useHMVProduct(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.herMyVoice,
    queryFn: async () => {
      console.log('Fetching Hear My Voice products from database API');
      return await productsService.getProductsByCollection('Hear My Voice');
    },
    enabled,
    staleTime: 1000 * 60 * 5,  // 5 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
    retry: 2,
  });
}

// Hook for fetching products by collection/brand from real database API only
export function useProductsByCollection(collection: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.byCollection(collection || 'all'),
    queryFn: async () => {
      console.log('Hook: Fetching products for collection from database:', collection);
      console.log('Collection parameter type:', typeof collection);
      console.log('Collection parameter value:', JSON.stringify(collection));
      
      if (!collection) {
        // If no collection specified, get all products from database
        console.log('Hook: No collection specified, getting all products from database');
        return await productsService.getProducts();
      }
      
      // Get products by collection from database API
      console.log('Hook: Fetching from database API for collection:', collection);
      const result = await productsService.getProductsByCollection(collection);
      console.log('Hook: Result from getProductsByCollection:', result);
      return result;
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}
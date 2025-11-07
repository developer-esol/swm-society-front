import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../configs/queryKeys";
import { hmvProductService } from "../api/services/hmvProductsService";
import { projectZeroProductService } from "../api/services/projectZeroProductService";
import { thomasMushetProductService } from "../api/services/thomasMushetService";


export function useProjectZeroProduct(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.projectZero,
    queryFn: () => projectZeroProductService.getProducts(),
    enabled,
    staleTime: Infinity,  // never becomes stale
    gcTime: Infinity,  // never removed from memory while tab is open
    retry: 3,
  });
}


export function useProjectThomasMushetProduct(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.thomasMushet,
    queryFn: () => thomasMushetProductService.getProducts(),
    enabled,
    staleTime: Infinity,  // never becomes stale
    gcTime: Infinity,  // never removed from memory while tab is open
    retry: 3,
  });
}

export function useHMVProduct(enabled: boolean = true) {
  return useQuery({
    queryKey: QUERY_KEYS.products.herMyVoice,
    queryFn: () => hmvProductService.getProducts(),
    enabled,
    staleTime: Infinity,  // never becomes stale
    gcTime: Infinity,  // never removed from memory while tab is open
    retry: 3,
  });
}
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../configs/queryKeys";
import { brandService } from "../api/services/brandService";


export function useBrands() {
  return useQuery({
    queryKey: QUERY_KEYS.brands.all,
    queryFn: () => brandService.getBrands(),
    staleTime: Infinity,  // never becomes stale
    gcTime: Infinity,  // never removed from memory while tab is open
    retry: 3,
  });
}
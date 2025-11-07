import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateProductData, ProductFilters, UpdateProductData } from '../types';
import { QUERY_KEYS } from '../configs/queryKeys';
import { productsService } from '../api/services';

// READ HOOKS

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.products.lists(filters),
    queryFn: () => productsService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
}

export function useProduct(id?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products.detail(id!),
    queryFn: () => productsService.getProductById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useProductsByCollection(collection: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products.byCollection(collection),
    queryFn: () => productsService.getProductsByCollection(collection),
    enabled: !!collection,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsByBrand(brandId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products.byBrand(brandId),
    queryFn: () => productsService.getProductsByBrand(brandId),
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products.search(query),
    queryFn: () => productsService.searchProducts(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 2,
  });
}

// MUTATION HOOKS

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => productsService.createProduct(data),
    onSuccess: (newProduct) => {
      // Invalidate products list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
      
      // Add new product to cache
      queryClient.setQueryData(
        QUERY_KEYS.products.detail(newProduct.id),
        newProduct
      );
      
      // Invalidate brand and collection specific queries
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.byBrand(newProduct.brandId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.byCollection(newProduct.brandName) 
      });
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductData) => productsService.updateProduct(data),
    onSuccess: (updatedProduct) => {
      // Update the product in cache
      queryClient.setQueryData(
        QUERY_KEYS.products.detail(updatedProduct.id),
        updatedProduct
      );
      
      // Invalidate products list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
      
      // Invalidate brand and collection specific queries
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.byBrand(updatedProduct.brandId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.byCollection(updatedProduct.brandName) 
      });
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.products.detail(deletedId) });
      
      // Invalidate products list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
    },
  });
}

export function useDuplicateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.duplicateProduct(id),
    onSuccess: (duplicatedProduct) => {
      // Add duplicated product to cache
      queryClient.setQueryData(
        QUERY_KEYS.products.detail(duplicatedProduct.id),
        duplicatedProduct
      );
      
      // Invalidate products list queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
      
      // Invalidate brand and collection specific queries
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.byBrand(duplicatedProduct.brandId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.products.byCollection(duplicatedProduct.brandName) 
      });
    },
    onError: (error) => {
      console.error('Failed to duplicate product:', error);
    },
  });
}

export function useUpdateProductStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, inStock }: { id: string; inStock: boolean }) => 
      productsService.updateProductStock(id, inStock),
    onSuccess: (updatedProduct) => {
      // Update the product in cache
      queryClient.setQueryData(
        QUERY_KEYS.products.detail(updatedProduct.id),
        updatedProduct
      );
      
      // Invalidate products list queries to refresh stock status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
    },
    onError: (error) => {
      console.error('Failed to update product stock:', error);
    },
  });
}
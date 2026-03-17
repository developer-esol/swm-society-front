import { apiClient } from '../apiClient';
import type { Product, ProductFilters, CreateProductData, UpdateProductData } from '../../types';

export const hmvProductService = {
  // READ operations
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const allProducts: Product[] = [
    ];


    return Promise.resolve(allProducts);
  },

  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async getProductsByCollection(collection: string): Promise<Product[]> {
    return apiClient.get<Product[]>('/products', { collection });
  },

  async getProductsByBrand(brandId: string): Promise<Product[]> {
    return apiClient.get<Product[]>('/products', { brandId });
  },

  async searchProducts(query: string): Promise<Product[]> {
    return apiClient.get<Product[]>('/products/search', { q: query });
  },

  // CREATE operation
  async createProduct(data: CreateProductData): Promise<Product> {
    return apiClient.post<Product>('/products', data);
  },

  // UPDATE operation
  async updateProduct(data: UpdateProductData): Promise<Product> {
    const { id, ...updateData } = data;
    return apiClient.put<Product>(`/products/${id}`, updateData);
  },

  // DELETE operation
  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete<{ success: boolean; message: string }>(`/products/${id}`);
  },

  // Additional operations
  async duplicateProduct(id: string): Promise<Product> {
    return apiClient.post<Product>(`/products/${id}/duplicate`);
  },

  async updateProductStock(id: string, inStock: boolean): Promise<Product> {
    return apiClient.put<Product>(`/products/${id}/stock`, { inStock });
  },
};
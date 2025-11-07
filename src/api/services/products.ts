import { apiClient } from '../apiClient';
import type { Product, ProductFilters, CreateProductData, UpdateProductData } from '../../types';

// Import the individual product services for demo data
import { hmvProductService } from './hmvProductsService';
import { projectZeroProductService } from './projectZeroProductService';
import { thomasMushetProductService } from './thomasMushetService';

export const productsService = {
  // READ operations
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    // For demo purposes, combine all product services
    try {
      const hmvProducts = await hmvProductService.getProducts(filters);
      const projectZeroProducts = await projectZeroProductService.getProducts(filters);
      const thomasMushetProducts = await thomasMushetProductService.getProducts(filters);
      
      return [...hmvProducts, ...projectZeroProducts, ...thomasMushetProducts];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product> {
    // Try to find the product in all services
    try {
      const allProducts = await this.getProducts();
      const product = allProducts.find(p => p.id === id);
      
      if (!product) {
        throw new Error(`Product with id ${id} not found`);
      }
      
      return product;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      throw error;
    }
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
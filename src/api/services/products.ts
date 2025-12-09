import { apiClient } from '../apiClient';
import type { Product, ProductFilters, CreateProductData, UpdateProductData } from '../../types';

export const productsService = {
  // READ operations
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    console.log('Fetching all products from database API');
    // Fetch from actual database API only
    return await apiClient.get<Product[]>('/products');
  },

  async getProductById(id: string): Promise<Product> {
    console.log('Fetching product by ID from database API:', id);
    // Get the specific product from API only
    return await apiClient.get<Product>(`/products/${id}`);
  },

  async getProductsByCollection(collection: string): Promise<Product[]> {
    console.log('Fetching products by brand from database API:', collection);
    
    try {
      // First get all products and brands
      const allProducts = await apiClient.get<Product[]>('/products');
      console.log('All products fetched:', allProducts.length);
      console.log('Sample product:', allProducts[0]);
      
      if (!collection) {
        return allProducts;
      }
      
      // Get brands from database
      const brands = await apiClient.get<Brand[]>('/brands');
      console.log('All brands fetched:', brands);
      
      // Find the brand that matches the collection name
      // Based on your database, brands have a 'name' field, not 'brandName'
      const matchingBrand = brands.find(brand => {
        const brandName = brand.name || brand.brandName || '';
        const matches = brandName.toLowerCase().trim() === collection.toLowerCase().trim();
        console.log(`Comparing brand "${brandName}" with "${collection}": ${matches}`);
        return matches;
      });
      
      if (!matchingBrand) {
        console.log(`No brand found for collection: ${collection}`);
        console.log('Available brands:', brands.map(b => b.name || b.brandName));
        return [];
      }
      
      console.log('Matching brand found:', matchingBrand);
      const brandId = matchingBrand.id;
      
      // Filter products by brandId
      const filteredProducts = allProducts.filter(product => {
        const matches = product.brandId === brandId;
        console.log(`Product "${product.name}" (brandId: ${product.brandId}) matches brandId "${brandId}": ${matches}`);
        return matches;
      });
      
      console.log(`Found ${filteredProducts.length} products for brand "${collection}" (brandId: ${brandId})`);
      return filteredProducts;
      
    } catch (error) {
      console.error('Error fetching products by collection:', error);
      return [];
    }
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

  async createProductAPI(productData: CreateProductData): Promise<CreateProductResponse> {
    try {
      return await apiClient.post<CreateProductResponse>('/products', productData);
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },
};
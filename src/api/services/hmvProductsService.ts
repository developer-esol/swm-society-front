import { apiClient } from '../apiClient';
import type { Product, ProductFilters, CreateProductData, UpdateProductData } from '../../types';

export const hmvProductService = {
  // READ operations
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const allProducts: Product[] = [
      // Project ZerO's Collection
      {
        id: '1',
        name: 'SWMSOCIETY X PROJECT ZERO CIC X A-STAR FOUNDATION X LEYTON ORIENT FOOTBALL Puffer Jacket',
        brandId: 'hear-my-voice',
        brandName: 'Hear My Voice',
        description: 'Premium puffer jacket from the Project ZerO\'s collaboration collection',
        price: 190,
        image: "/d1.jpg",
        inStock: true,
        isActive: true,
        tags: ['jacket', 'puffer', 'collaboration'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: "SWMSOCIETY X PROJECT ZERO CIC X A-STAR FOUNDATION X LEYTON ORIENT FOOTBALL Project Zero's jacket",
        brandId: 'hear-my-voice',
        brandName: 'Hear My Voice',
        description: 'Signature jacket from the Project ZerO\'s collaboration',
        price: 100,
        image: "/d2.jpg",
        inStock: true,
        isActive: true,
        tags: ['jacket', 'collaboration'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'SWMSOCIETY X PROJECT ZERO CIC X A-STAR FOUNDATION X LEYTON ORIENT FOOTBALL over the head jacket',
        brandId: 'hear-my-voice',
        brandName: 'Hear My Voice',
        description: 'Over-the-head style jacket from the Project ZerO\'s collection',
        price: 100,
        image: "/d4.jpg",
        inStock: true,
        isActive: true,
        tags: ['jacket', 'pullover', 'collaboration'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        name: 'SWMSOCIETY X PROJECT ZERO CIC X A-STAR FOUNDATION X LEYTON ORIENT FOOTBALL Old English Hoodie',
        brandId: 'hear-my-voice',
        brandName: 'Hear My Voice',
        description: 'Old English style hoodie from the Project ZerO\'s collaboration',
        price: 100,
        image: "/HOODIE1_1024x1024.webp",
        inStock: true,
        isActive: true,
        tags: ['hoodie', 'collaboration', 'old-english'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      // Thomas Mushet Collection
      {
        id: '5',
        name: 'Thomas Mushet Knicks-Inspired Jacket',
        brandId: 'hear-my-voice',
        brandName: 'Hear My Voice',
        description: 'Basketball-inspired jacket with Knicks colorway',
        price: 150,
        image: "/B2.webp",
        inStock: true,
        isActive: true,
        tags: ['jacket', 'basketball', 'knicks'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '6',
        name: 'Thomas Mushet Basketball Hoodie',
        brandId: 'hear-my-voice',
        brandName: 'Hear My Voice',
        description: 'Premium basketball hoodie with athletic styling',
        price: 85,
        image: "/JACKET4a_grande.webp",
        inStock: true,
        isActive: true,
        tags: ['hoodie', 'basketball', 'athletic'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      // Hear My Voice Collection
      {
        id: '7',
        name: 'Hear My Voice Denim Jacket',
        brandId: 'hear-my-voice',
        brandName: 'Hear My Voice',
        description: 'Statement denim jacket with unique voice-inspired details',
        price: 120,
        image: "/b3.jpg",
        inStock: true,
        isActive: true,
        tags: ['jacket', 'denim', 'statement'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
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
import type { ProductFilters } from "../types";


export const QUERY_KEYS = {
  // Products
  products: {
    all: ['products'] as const,
    herMyVoice: ['herMyVoice'] as const,
    projectZero: ['projectZero'] as const,
    thomasMushet: ['thomasMushet'] as const,
    lists: (filters?: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    byCollection: (collection: string) => ['products', 'collection', collection] as const,
    byBrand: (brandId: string) => ['products', 'brand', brandId] as const,
    search: (query: string) => ['products', 'search', query] as const,
  },
  stocks:{
    byProductId: (productId: string) => ['stocks', 'product', productId] as const,
  },

  // Brands
  brands: {
    all: ['brands'] as const,
    detail: (id: string) => ['brands', 'detail', id] as const,
  },
  
  // Collections
  collections: {
    all: ['collections'] as const,
    detail: (id: string) => ['collections', 'detail', id] as const,
  },
  
  // Cart
  cart: {
    all: ['cart'] as const,
  },
  
  // Orders
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    user: (userId: string) => ['orders', 'user', userId] as const,
  },
  
  // User
  user: {
    profile: ['user', 'profile'] as const,
    orders: ['user', 'orders'] as const,
  },
} as const;
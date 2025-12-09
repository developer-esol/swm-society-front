export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  description: string;
  price: number;
  image?: string;
  imageurl?: string;
  inStock: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deliveryMethod?: string;
  // Optional fields for detailed product views
  stocks?: Stock[];
  rating?: number;
  reviewCount?: number;
  images?: string[];
  collection?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string>; // Map color names to image URLs
  [key: string]: unknown; // Allow additional properties for flexibility
}

export interface ProductDetailsResponse {
  product: Product;
  relatedProducts?: Product[];
  success: boolean;
}

export interface ProductFilters {
  collection?: string;
  brandId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface CreateProductData {
  brandId: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  deliveryMethod: string;
}

export interface CreateProductResponse {
  id: string;
  brandId: string;
  name: string;
  price: string; // Backend returns price as string "149.99"
  description: string;
  imageUrl: string;
  deliveryMethod: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: null | string;
  updatedBy: null | string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface BrandsResponse {
  brands: Brand[];
  total: number;
  page: number;
  limit: number;
}
//   price: number;
//   images: string[];
//   collection: string;
//   brandId: string;
//   sizes: string[];
//   colors: string[];
//   category: string;
//   tags: string[];
// }

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}


export interface Stock {
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockData {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  imageUrl: string;
}
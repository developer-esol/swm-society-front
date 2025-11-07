export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
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
  name: string;
  description: string;
  price: number;
  images: string[];
  collection: string;
  brandId: string;
  sizes: string[];
  colors: string[];
  category: string;
  tags: string[];
}

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
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
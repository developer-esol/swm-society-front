/**
 * Common/Shared types used across the application
 */

export interface PageResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: ApiError | null;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Shipping related types
export interface ShippingFeature {
  id: string;
  icon: 'LocalShipping' | 'AccessTime' | 'Public' | 'CardGiftcard';
  title: string;
  description: string;
}

export interface ShippingOption {
  id: string;
  method: string;
  deliveryTime: string;
  cost: string;
  freeShippingMinimum: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Return Policy related types
export interface ReturnFeature {
  id: string;
  icon: 'AssignmentReturn' | 'LocalShipping' | 'CheckCircle';
  title: string;
  description: string;
}

export interface ReturnCondition {
  id: string;
  text: string;
}

export interface ReturnStep {
  id: string;
  title: string;
  description: string[];
}

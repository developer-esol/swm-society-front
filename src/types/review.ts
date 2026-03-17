/**
 * Review-related types
 */

export interface Review {
  id: string;
  productId?: string;
  userId: string;
  imageUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewInput {
  comment: string;
  rating: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateReviewData {
  productId: string;
  comment: string;
  rating: number;
  imageUrl?: string;
}

export interface UpdateReviewData {
  id: string;
  comment?: string;
  rating?: number;
}

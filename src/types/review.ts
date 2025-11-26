/**
 * Review-related types
 */

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  verified?: boolean;
}

export interface ReviewInput {
  title: string;
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
  title: string;
  comment: string;
  rating: number;
}

export interface UpdateReviewData {
  id: string;
  title?: string;
  comment?: string;
  rating?: number;
}

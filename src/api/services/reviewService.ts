import type { Review } from '../../types/review';
import { apiClient } from '../apiClient';
import { authService } from './authService';

// Start with no dummy review data. If backend is unavailable,
// behavior will fall back to the runtime mock list (initially empty).
const mockReviews: Review[] = [];

export const reviewService = {
  /**
   * Get all reviews for a specific product
   * @param productId - Product ID to filter reviews
   * @returns Array of reviews for the product
   */
  getReviewsByProduct: async (productId: string): Promise<Review[]> => {
    if (!productId) return [];
    try {
      // Prefer backend endpoint that returns reviews for a product
      const items = await apiClient.get<any[]>(`/reviews/product/${productId}`);
      const mapped: Review[] = (items || []).map((r) => ({
        id: r.id,
        productId: r.productId || r.productId,
        userId: r.userId,
        imageUrl: r.imageUrl || r.image || undefined,
        rating: r.rating,
        comment: r.description || r.comment || '',
        createdAt: r.date || r.createdAt || new Date().toISOString(),
        updatedAt: r.updatedAt || undefined,
      } as Review));

      return mapped;
    } catch (err) {
      console.warn('reviewService.getReviewsByProduct API failed, falling back to mock:', err);
      // fallback to runtime mock list
      return mockReviews.filter((review) => review.productId === productId);
    }
  },

  /**
   * Get all reviews (admin)
   * @param page - page number
   * @param limit - page size
   */
  getAllReviews: async (page = 1, limit = 100): Promise<Review[]> => {
    try {
      const items = await apiClient.get<any[]>('/reviews', { page, limit });
      // Map backend `description` -> frontend `comment` if needed
      const mapped: Review[] = items.map((r) => ({
        id: r.id,
        productId: r.productId || r.productId,
        userId: r.userId,
        imageUrl: r.imageUrl || r.imageUrl || undefined,
        rating: r.rating,
        comment: r.description || r.comment || '',
        createdAt: r.date || r.createAt || r.createdAt || new Date().toISOString(),
        updatedAt: r.updateAt || r.updatedAt || undefined,
      } as Review));

      return mapped;
    } catch (err) {
      console.error('reviewService.getAllReviews error:', err);
      // fallback to mock reviews
      return Promise.resolve([...mockReviews]);
    }
  },

  /**
   * Create a new review
   * @param review - Review data
   * @returns Created review
   */
  createReview: async (
    review: Omit<Review, 'id' | 'createdAt'>
  ): Promise<Review> => {
    // Build payload mapping to backend contract and call API.
    const currentUser = authService.getCurrentUser();
    const payload: Record<string, unknown> = {
      productId: review.productId,
      userId: review.userId || currentUser.id,
      rating: review.rating,
      // backend expects `description` for the comment text
      description: review.comment || '',
      imageUrl: (review as unknown as { imageUrl?: string }).imageUrl,
    };

    // Let apiClient.post throw on errors so callers can handle/display them.
    const created = await apiClient.post<Review>('/reviews', payload);
    return created;
  },

  /**
   * Delete a review
   * @param reviewId - Review ID
   * @returns void
   */
  deleteReview: async (reviewId: string): Promise<void> => {
    if (!reviewId) throw new Error('reviewId is required')
    try {
      await apiClient.delete(`/reviews/${reviewId}`)
      // also remove from runtime mock cache if present
      const index = mockReviews.findIndex((r) => r.id === reviewId)
      if (index > -1) mockReviews.splice(index, 1)
    } catch (err) {
      // Surface error to caller so UI can handle/display it
      console.error('reviewService.deleteReview error:', err)
      throw err
    }
  },

  /**
   * Get mock reviews (for initial load)
   * @returns Array of mock reviews
   */
  getMockReviews: (): Review[] => {
    return [...mockReviews];
  },
};

import type { Review } from '../../types/review';
import { apiClient } from '../apiClient';
import { authService } from './authService';

/**
 * Helper function to get NestJS user UUID from Spring Boot externalId
 * Caches the result in sessionStorage to avoid repeated API calls
 */
async function getNestJsUserUuid(externalId: string): Promise<string> {
  // Check cache first
  const cacheKey = 'nestjs_user_uuid';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.externalId === externalId && parsed.uuid) {
        console.log('[ReviewService] Using cached UUID:', parsed.uuid);
        return parsed.uuid;
      }
    } catch (e) {
      // Invalid cache, continue to fetch
    }
  }

  // Fetch from API
  console.log('[ReviewService] Fetching UUID for externalId:', externalId);
  const response = await apiClient.get<any[]>(`/users?externalId=${externalId}`);
  if (!response || response.length === 0) {
    throw new Error(`No user found with externalId: ${externalId}`);
  }
  
  const uuid = response[0].id;
  console.log('[ReviewService] Mapped externalId', externalId, '→ UUID:', uuid);
  
  // Cache the result
  sessionStorage.setItem(cacheKey, JSON.stringify({ externalId, uuid }));
  
  return uuid;
}

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
    const externalId = review.userId || currentUser.id;
    
    // Convert Spring Boot numeric ID to NestJS UUID
    const nestJsUserId = await getNestJsUserUuid(externalId ?? '');
    console.log('[ReviewService] createReview - externalId:', externalId, '→ UUID:', nestJsUserId);
    
    const payload: Record<string, unknown> = {
      productId: review.productId,
      userId: nestJsUserId,
      rating: review.rating,
      // backend expects `description` for the comment text
      description: review.comment || '',
      imageUrl: (review as unknown as { imageUrl?: string }).imageUrl,
    };

    console.log('[ReviewService] Creating review with payload:', payload);

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

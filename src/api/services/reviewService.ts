import type { Review } from '../../types/review';

// Mock/Dummy review data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'James K.',
    rating: 5,
    title: 'Amazing quality and fit',
    comment: 'Love the design! Amazing quality and fit.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah M.',
    rating: 4,
    title: 'Great product',
    comment: 'Really happy with this purchase. Very comfortable.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'David L.',
    rating: 5,
    title: 'Highly recommend',
    comment: 'Worth every penny. Fantastic quality and style.',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
  },
];

export const reviewService = {
  /**
   * Get all reviews for a product
   * @param productId - Product ID
   * @returns Array of reviews
   */
  getReviewsByProduct: (): Promise<Review[]> => {
    // Mock delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockReviews);
      }, 300);
    });
  },

  /**
   * Create a new review
   * @param review - Review data
   * @returns Created review
   */
  createReview: (
    review: Omit<Review, 'id' | 'createdAt'>
  ): Promise<Review> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          ...review,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        mockReviews.unshift(newReview);
        resolve(newReview);
      }, 300);
    });
  },

  /**
   * Delete a review
   * @param reviewId - Review ID
   * @returns void
   */
  deleteReview: (reviewId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockReviews.findIndex((r) => r.id === reviewId);
        if (index > -1) {
          mockReviews.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  },

  /**
   * Get mock reviews (for initial load)
   * @returns Array of mock reviews
   */
  getMockReviews: (): Review[] => {
    return [...mockReviews];
  },
};

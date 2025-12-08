import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
import ReviewCard from '../../components/ReviewCard';
import type { Review } from '../../types/review';

interface CustomerReviewsProps {
  reviews: Review[];
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Customer Reviews
      </Typography>

      {/* Average Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box>
          <Rating value={Number(averageRating)} readOnly precision={0.1} size="large" />
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {reviews.length} reviews
        </Typography>
      </Box>

      {/* Reviews List */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Latest Reviews
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Box>
    </Box>
  );
};

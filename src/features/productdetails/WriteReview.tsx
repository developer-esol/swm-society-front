import React from 'react';
import { Box, Button, TextField, Typography, Rating } from '@mui/material';
import { colors } from '../../theme';

interface WriteReviewProps {
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewComment: string;
  setReviewComment: (comment: string) => void;
  reviewImageUrl?: string;
  setReviewImageUrl?: (url: string) => void;
  onSubmitReview: () => void;
}

export const WriteReview: React.FC<WriteReviewProps> = ({
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  reviewImageUrl,
  setReviewImageUrl,
  onSubmitReview,
}) => {
  return (
    <Box sx={{ mb: 6, borderTop: `1px solid ${colors.border.default}`, pt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Write a Review
      </Typography>

      {/* Rating */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Rating
        </Typography>
        <Rating
          value={reviewRating}
          onChange={(_, newValue) => setReviewRating(newValue || 0)}
          size="large"
        />
      </Box>



      {/* Review Comment */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Your Review"
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          multiline
          minRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderColor: colors.border.default,
            },
          }}
        />
      </Box>

      {/* Optional Image URL */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Image URL (optional)"
          value={reviewImageUrl || ''}
          onChange={(e) => setReviewImageUrl && setReviewImageUrl(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderColor: colors.border.default,
            },
          }}
        />
      </Box>

      {/* Submit Button */}
      <Button
        variant="contained"
        onClick={onSubmitReview}
        sx={{
          bgcolor: colors.button.primary,
          color: 'white',
          fontWeight: 600,
          '&:hover': { bgcolor: colors.button.primaryHover },
        }}
      >
        Submit Review
      </Button>
    </Box>
  );
};

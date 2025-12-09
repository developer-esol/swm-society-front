import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
import { colors } from '../../theme';
import type { Product} from '../../types/product';
import type { Review } from '../../types/review';

interface ProductDetailsHeaderProps {
  product: Product;
  reviews: Review[];
}

export const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({
  product,
  reviews,
}) => {
  return (
    <>
      {/* Brand Name */}
      {product?.brandName && (
        <Typography
          variant="body2"
          sx={{
            color: '#374151',
            mb: 2,
            textTransform: 'uppercase',
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          {product.brandName}
        </Typography>
      )}

      {/* Product Name */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '1.5rem', md: '2rem' },
          lineHeight: 1.2,
        }}
      >
        {product?.name}
      </Typography>

      {/* Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Rating
          value={reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0}
          readOnly
          precision={0.1}
        />
        <Typography variant="body2" sx={{ color: colors.text.gray }}>
          {reviews.length} reviews
        </Typography>
      </Box>

      {/* Price */}
      <Typography
        variant="h5"
        sx={{
          color: '#000000ff',
          fontWeight: 'bold',
          mb: 3,
          fontSize: '1.875rem',
        }}
      >
        £{product?.price ? Number(product.price).toFixed(2) : '0.00'}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: colors.text.gray,
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        {product?.description}
      </Typography>
    </>
  );
};

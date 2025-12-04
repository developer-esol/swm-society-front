import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
import { colors } from '../../theme';
import type { Product } from '../../types/product';

interface ProductInfoProps {
  product: Product | null;
  displayImage: string;
  reviews: Array<{ rating: number }>;
  productData?: Product | null;
  availableColors?: string[];
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  displayImage, 
  reviews = [],
  productData,
  availableColors = [],
  selectedColor = '',
  onColorSelect,
}) => {
  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (!product) return null;

  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 2 }}>
        {/* Product Image Section - Left */}
        <Box>
          {/* Main Image */}
          <Box
            sx={{
              width: '100%',
              height: { xs: 400, md: 500 },
              bgcolor: colors.background.lighter,
              borderRadius: 2,
              border: `1px solid ${colors.border.default}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `url(${displayImage || product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mb: 3,
            }}
          />

          {/* Color Variants Below Main Image */}
          {availableColors.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {availableColors.map((color) => {
                let colorImage = productData?.colorImages?.[color];
                if (!colorImage && productData?.colorImages) {
                  const normalizedColor = color.toLowerCase();
                  const matchingKey = Object.keys(productData.colorImages).find(
                    key => key.toLowerCase() === normalizedColor
                  );
                  colorImage = matchingKey ? productData.colorImages[matchingKey] : undefined;
                }

                return (
                  <Box
                    key={color}
                    onClick={() => onColorSelect?.(color)}
                    sx={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: selectedColor === color ? `3px solid ${colors.button.primary}` : `1px solid ${colors.border.default}`,
                      backgroundImage: colorImage ? `url(${colorImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: colors.button.primary,
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }
                    }}
                  />
                );
              })}
            </Box>
          )}
        </Box>

        {/* Product Details - Right */}
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            {product.name}
          </Typography>

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={Number(averageRating)} readOnly precision={0.1} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {reviews.length} reviews
            </Typography>
          </Box>

          {/* Price */}
          <Typography
            variant="h5"
            sx={{
              color: colors.button.primary,
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            £{product.price}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            {product.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

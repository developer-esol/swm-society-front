import React from 'react';
import { Box } from '@mui/material';
import { colors } from '../../theme';
import type { Product } from '../../types/product';

interface ProductDetailsImageProps {
  displayImage: string;
  productImage: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
  availableColors: string[];
  productData: Product | null;
}

export const ProductDetailsImage: React.FC<ProductDetailsImageProps> = ({
  displayImage,
  productImage,
  selectedColor,
  onColorChange,
  availableColors,
  productData,
}) => {
  return (
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
          backgroundImage: `url(${displayImage || productImage})`,
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
                onClick={() => onColorChange(color)}
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
  );
};

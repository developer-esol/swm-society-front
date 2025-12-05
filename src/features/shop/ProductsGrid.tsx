import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ProductCard } from '../../components';
import { colors } from '../../theme';
import type { Product } from '../../types';

interface ProductsGridProps {
  products: Product[];
  clearAllFilters: () => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products, clearAllFilters }) => {
  return (
    <Box>
      {/* Product Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>

      {/* No Results */}
      {products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            No products match your filters.
          </Typography>
          <Button
            onClick={clearAllFilters}
            sx={{
              color: colors.button.primary,
              '&:hover': {
                color: colors.button.primaryHover,
                bgcolor: 'rgba(220, 38, 38, 0.04)', // Red background tint
              },
            }}
          >
            Clear all filters
          </Button>
        </Box>
      )}
    </Box>
  );
};

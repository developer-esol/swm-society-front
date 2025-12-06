import React from 'react';
import { Box, Typography, Link as MuiLink, Divider } from '@mui/material';
import { colors } from '../../theme';
import type { Stock } from '../../types/product';

interface ProductDetailsProps {
  currentStock: Stock | undefined;
  onViewReturnPolicy: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ currentStock, onViewReturnPolicy }) => {
  return (
    <Box sx={{ mb: 6, borderTop: `1px solid ${colors.border.default}`, pt: 4 }}>
      {/* Shipping Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Shipping:
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Free shipping on orders over £100. Standard delivery 3-5 working days.
        </Typography>
        <MuiLink
          href="/shipping-info"
          sx={{
            color: colors.button.primary,
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View shipping details
        </MuiLink>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Returns Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Returns:
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Free 30-day returns for unworn items.
        </Typography>
        <MuiLink
          href="/return-policy"
          onClick={(e) => {
            e.preventDefault();
            onViewReturnPolicy();
          }}
          sx={{
            color: colors.button.primary,
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View return policy
        </MuiLink>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stock Information */}
      {currentStock && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Available Stock Information:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              S - Red: {currentStock.quantity} available (£{currentStock.price})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              M - Red: 20 available (£{currentStock.price})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              L - Red: 12 available (£{currentStock.price})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              S - Black: 18 available (£{currentStock.price})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              M - Black: 16 available (£{currentStock.price})
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              L - Black: 14 available (£{currentStock.price})
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Collection Info */}
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Part of the Hear My Voice collection.
      </Typography>
    </Box>
  );
};

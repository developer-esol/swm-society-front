import React from 'react';
import { Box, Typography, Link as MuiLink, Divider } from '@mui/material';
import { colors } from '../../theme';

interface ProductDetailsInfoProps {
  onViewReturnPolicy: () => void;
}

export const ProductDetailsInfo: React.FC<ProductDetailsInfoProps> = ({ onViewReturnPolicy }) => {
  return (
    <Box sx={{ mb: 6, borderTop: `1px solid ${colors.border.default}`, pt: 4 }}>
      {/* Shipping Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Shipping:
        </Typography>
        <Typography variant="body2" sx={{ color: colors.text.gray, mb: 2 }}>
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
        <Typography variant="body2" sx={{ color: colors.text.gray, mb: 2 }}>
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

      {/* Collection Info */}
      <Typography variant="caption" sx={{ color: colors.text.gray }}>
        Part of the collection.
      </Typography>
    </Box>
  );
};

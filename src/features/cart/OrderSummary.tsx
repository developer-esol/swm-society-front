import React from 'react';
import { Box, Paper, Typography, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme';

interface OrderSummaryProps {
  totalAmount: number;
  totalItems: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalItems,
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'sticky', top: 100 }}>
      <Paper
        sx={{
          p: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: '1.1rem',
            mb: 2,
          }}
        >
          Order Summary
        </Typography>

        {/* Subtotal */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: '0.9rem', color: colors.text.disabled }}>
            Subtotal ( {totalItems} {totalItems === 1 ? 'item' : 'items'} )
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: colors.text.primary }}>
            £{totalAmount.toFixed(2)}
          </Typography>
        </Box>

        {/* Shipping */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: '0.9rem', color: colors.text.disabled }}>
            Shipping
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: colors.text.disabled }}>
            Calculated at checkout
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{ height: '1px', backgroundColor: colors.border.light, mb: 2 }} />

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography sx={{ fontSize: '1rem', color: colors.text.primary, fontWeight: 500 }}>
            Total
          </Typography>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: colors.button.primary }}>
            £{totalAmount.toFixed(2)}
          </Typography>
        </Box>

        {/* Checkout Button */}
        <MuiButton
          variant="contained"
          fullWidth
          onClick={() => navigate('/checkout')}
          sx={{
            backgroundColor: colors.text.primary,
            color: colors.text.secondary,
            textTransform: 'none',
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 600,
            mb: 2,
            '&:hover': {
              backgroundColor: colors.text.dark,
            },
          }}
        >
          Proceed to Checkout
        </MuiButton>

        {/* Continue Shopping Link */}
        <Typography
          onClick={() => navigate('/shop')}
          sx={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: colors.text.primary,
            cursor: 'pointer',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Continue Shopping
        </Typography>
      </Paper>
    </Box>
  );
};

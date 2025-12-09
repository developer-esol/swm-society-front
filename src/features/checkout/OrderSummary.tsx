import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { colors } from '../../theme';
import type { CartItem } from '../../types/cart';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotal,
  shipping,
  total,
}) => {
  return (
    <Paper sx={{ p: 3, bgcolor: colors.background.light, position: 'sticky', top: 100 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Order Summary
      </Typography>

      {/* Order Items */}
      <Box sx={{ mb: 3 }}>
        {cartItems.map((item, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">
                {item.productName}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                £{(Number(item.price) * item.quantity).toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: colors.text.disabled }}>
              Qty: {item.quantity} × £{Number(item.price).toFixed(2)}
            </Typography>
            {item.color && (
              <Typography variant="caption" sx={{ color: 'grey.600', display: 'block' }}>
                Color: {item.color}
              </Typography>
            )}
            {item.size && (
              <Typography variant="caption" sx={{ color: 'grey.600', display: 'block' }}>
                Size: {item.size}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Pricing Details */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            Subtotal
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            £{subtotal.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'grey.600' }}>
            Shipping
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            £{shipping.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Total
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.button.primary }}>
          £{total.toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};

export default OrderSummary;

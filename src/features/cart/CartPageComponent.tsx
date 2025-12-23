import React from 'react';
import { Box, Typography, Container, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CartItems } from './CartItems';
import { OrderSummary } from './OrderSummary';
import type { CartItem } from '../../types/cart';
import { colors } from '../../theme';
import { useCart } from './useCart';

export const CartPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading: loading, isError: error, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const [privacyWarning] = React.useState<string | null>(null);

  const handleRemove = (stockId: string) => removeItem(stockId);
  const handleUpdateQuantity = (stockId: string, quantity: number) => {}; // noop - handled by hook methods
  const handleDecreaseQuantity = (stockId: string) => decreaseQuantity(stockId);
  const handleIncreaseQuantity = (stockId: string, maxQuantity?: number) => increaseQuantity(stockId, maxQuantity);

  const calculateTotal = () => cartItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0);

  const totalAmount = calculateTotal();
  const totalItems = cartItems.length;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colors.text.primary,
            mb: 1,
          }}
        >
          Your Cart
        </Typography>
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography>Loading cart...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: colors.status.error }}>{error}</Typography>
        </Box>
      ) : cartItems.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.text.disabled,
              textAlign: 'center',
            }}
          >
            Your cart is empty
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.text.disabled,
              textAlign: 'center',
              mb: 2,
            }}
          >
            Add products to your cart to get started
          </Typography>
          <MuiButton
            variant="contained"
            onClick={() => navigate('/shop')}
            sx={{
              backgroundColor: colors.button.primary,
              color: colors.text.secondary,
              textTransform: 'none',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: colors.button.primaryHover,
              },
            }}
          >
            Continue Shopping
          </MuiButton>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 4 }}>
          {privacyWarning && (
            <Box sx={{ gridColumn: '1 / -1', mb: 2 }}>
              <Typography sx={{ color: colors.status.processing }}>{privacyWarning}</Typography>
            </Box>
          )}
          <CartItems
            cartItems={cartItems}
            onRemove={handleRemove}
            onDecreaseQuantity={handleDecreaseQuantity}
            onIncreaseQuantity={handleIncreaseQuantity}
          />

          <OrderSummary
            totalAmount={totalAmount}
            totalItems={totalItems}
          />
        </Box>
      )}
    </Container>
  );
};

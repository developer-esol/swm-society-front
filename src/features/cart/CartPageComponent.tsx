import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../api/services/cartService';
import { CartItems } from './CartItems';
import { OrderSummary } from './OrderSummary';
import type { CartItem } from '../../types/cart';
import { colors } from '../../theme';

export const CartPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load cart items on component mount
    const cart = cartService.getCart();
    setCartItems(cart.items);

    // Initialize quantities from cart items
    const quantitiesMap: Record<string, number> = {};
    cart.items.forEach((item: CartItem) => {
      quantitiesMap[item.stockId] = item.quantity;
    });
    setQuantities(quantitiesMap);
  }, []);

  const handleRemove = (stockId: string) => {
    cartService.removeItem(stockId);
    const updatedCart = cartService.getCart();
    setCartItems(updatedCart.items);

    // Remove quantity entry
    const newQuantities = { ...quantities };
    delete newQuantities[stockId];
    setQuantities(newQuantities);
  };

  const handleUpdateQuantity = (stockId: string, quantity: number) => {
    cartService.updateItemQuantity(stockId, quantity);
    setQuantities(prev => ({
      ...prev,
      [stockId]: quantity
    }));
  };

  const handleDecreaseQuantity = (stockId: string) => {
    const currentQty = quantities[stockId] || 1;
    if (currentQty > 1) {
      handleUpdateQuantity(stockId, currentQty - 1);
    }
  };

  const handleIncreaseQuantity = (stockId: string, maxQuantity: number) => {
    const currentQty = quantities[stockId] || 1;
    if (currentQty < maxQuantity) {
      handleUpdateQuantity(stockId, currentQty + 1);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const qty = quantities[item.stockId] || 1;
      return total + (Number(item.price) * qty);
    }, 0);
  };

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
      {cartItems.length === 0 ? (
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
          <CartItems
            cartItems={cartItems}
            quantities={quantities}
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

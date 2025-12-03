import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button as MuiButton, IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete as TrashIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { cartService } from '../api/services/cartService';
import type { CartItem } from '../types/cart';
import { colors } from '../theme';

const CartPage: React.FC = () => {
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
      return total + (item.price * qty);
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
        // Empty State
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
        // Cart Layout - Two Column
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 4 }}>
          {/* Left Column - Products */}
          <Box>
            {/* Column Headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px', gap: 2, mb: 3, pb: 2, borderBottom: `1px solid ${colors.border.light}` }}>
              <Typography sx={{ fontWeight: 600, color: colors.text.disabled, fontSize: '0.9rem' }}>Product</Typography>
              <Typography sx={{ fontWeight: 600, color: colors.text.disabled, fontSize: '0.9rem', textAlign: 'center' }}>Price</Typography>
              <Typography sx={{ fontWeight: 600, color: colors.text.disabled, fontSize: '0.9rem', textAlign: 'center' }}>Quantity</Typography>
              <Typography sx={{ fontWeight: 600, color: colors.text.disabled, fontSize: '0.9rem', textAlign: 'right' }}>Total</Typography>
            </Box>

            {/* Cart Items */}
            {cartItems.map((item) => (
              <Box
                key={item.stockId}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 100px 100px',
                  gap: 2,
                  py: 3,
                  px: 2,
                  borderBottom: `1px solid ${colors.border.light}`,
                  alignItems: 'center',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                {/* Product Info */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    component="img"
                    src={item.productImage}
                    alt={item.productName}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: '4px',
                      backgroundColor: colors.background.lighter,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: colors.text.primary,
                        fontSize: '0.95rem',
                        mb: 0.5,
                        cursor: 'pointer',
                        '&:hover': {
                          color: colors.button.primary,
                        },
                      }}
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.productName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: colors.text.disabled, mb: 0.3 }}>
                      Size: {item.size}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: colors.text.disabled, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Color:
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: item.color.toLowerCase(),
                          border: `1px solid ${colors.border.light}`,
                        }}
                      />
                      {item.color}
                    </Typography>
                    {/* Remove Button */}
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        onClick={() => handleRemove(item.stockId)}
                        sx={{
                          fontSize: '0.8rem',
                          color: colors.button.primary,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        <TrashIcon sx={{ fontSize: 14 }} /> Remove
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Price */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 600, color: colors.text.primary, fontSize: '0.9rem' }}>
                    £{item.price.toFixed(2)}
                  </Typography>
                </Box>

                {/* Quantity */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleDecreaseQuantity(item.stockId)}
                    sx={{
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: '4px',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: colors.background.lighter,
                      },
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <Typography sx={{ minWidth: '25px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: colors.text.primary }}>
                    {quantities[item.stockId] || item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleIncreaseQuantity(item.stockId, item.maxQuantity)}
                    sx={{
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: '4px',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: colors.background.lighter,
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>

                {/* Total */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, color: colors.button.primary, fontSize: '0.95rem' }}>
                    £{(item.price * (quantities[item.stockId] || item.quantity)).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Right Column - Order Summary */}
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
        </Box>
      )}
    </Container>
  );
};

export default CartPage;

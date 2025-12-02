import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button as MuiButton, IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete as TrashIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { cartService } from '../api/services/cartService';
import type { CartItem } from '../types/cart';

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
            color: 'black',
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
              color: 'grey.600',
              textAlign: 'center',
            }}
          >
            Your cart is empty
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'grey.500',
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
              backgroundColor: '#dc2626',
              color: 'white',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#b91c1c',
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
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 100px', gap: 2, mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontWeight: 600, color: 'grey.600', fontSize: '0.9rem' }}>Product</Typography>
              <Typography sx={{ fontWeight: 600, color: 'grey.600', fontSize: '0.9rem', textAlign: 'center' }}>Price</Typography>
              <Typography sx={{ fontWeight: 600, color: 'grey.600', fontSize: '0.9rem', textAlign: 'center' }}>Quantity</Typography>
              <Typography sx={{ fontWeight: 600, color: 'grey.600', fontSize: '0.9rem', textAlign: 'right' }}>Total</Typography>
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
                  borderBottom: '1px solid #e0e0e0',
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
                      backgroundColor: '#f5f5f5',
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
                        color: 'black',
                        fontSize: '0.95rem',
                        mb: 0.5,
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#dc2626',
                        },
                      }}
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.productName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'grey.600', mb: 0.3 }}>
                      Size: {item.size}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'grey.600', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Color:
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: item.color.toLowerCase(),
                          border: '1px solid #ddd',
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
                          color: '#dc2626',
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
                  <Typography sx={{ fontWeight: 600, color: 'black', fontSize: '0.9rem' }}>
                    £{item.price.toFixed(2)}
                  </Typography>
                </Box>

                {/* Quantity */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleDecreaseQuantity(item.stockId)}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <Typography sx={{ minWidth: '25px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                    {quantities[item.stockId] || item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleIncreaseQuantity(item.stockId, item.maxQuantity)}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>

                {/* Total */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, color: '#dc2626', fontSize: '0.95rem' }}>
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
                  color: 'black',
                  fontSize: '1.1rem',
                  mb: 2,
                }}
              >
                Order Summary
              </Typography>

              {/* Subtotal */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', color: 'grey.600' }}>
                  Subtotal ( {totalItems} {totalItems === 1 ? 'item' : 'items'} )
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'black' }}>
                  £{totalAmount.toFixed(2)}
                </Typography>
              </Box>

              {/* Shipping */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontSize: '0.9rem', color: 'grey.600' }}>
                  Shipping
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'grey.600' }}>
                  Calculated at checkout
                </Typography>
              </Box>

              {/* Divider */}
              <Box sx={{ height: '1px', backgroundColor: '#e0e0e0', mb: 2 }} />

              {/* Total */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography sx={{ fontSize: '1rem', color: 'black', fontWeight: 500 }}>
                  Total
                </Typography>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#dc2626' }}>
                  £{totalAmount.toFixed(2)}
                </Typography>
              </Box>

              {/* VAT Note */}
              <Typography sx={{ fontSize: '0.75rem', color: 'grey.500', mb: 2, textAlign: 'center' }}>
                Including VAT
              </Typography>

              {/* Checkout Button */}
              <MuiButton
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#333',
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
                  color: 'black',
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

import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WishlistCard from '../components/WishlistCard';
import { wishlistService } from '../api/services/wishlistService';
import { cartService } from '../api/services/cartService';
import type { WishlistItem } from '../types/wishlist';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load wishlist items on component mount
    const wishlist = wishlistService.getWishlist();
    setWishlistItems(wishlist.items);
    
    // Initialize quantities from wishlist items
    const quantitiesMap: Record<string, number> = {};
    wishlist.items.forEach(item => {
      quantitiesMap[item.stockId] = item.quantity; // Use the quantity from wishlist item
    });
    setQuantities(quantitiesMap);
  }, []);

  const handleRemove = (stockId: string) => {
    wishlistService.removeItem(stockId);
    const updatedWishlist = wishlistService.getWishlist();
    setWishlistItems(updatedWishlist.items);
    
    // Remove quantity entry
    const newQuantities = { ...quantities };
    delete newQuantities[stockId];
    setQuantities(newQuantities);
  };

  const handleUpdateQuantity = (stockId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [stockId]: quantity
    }));
  };

  const handleAddToCart = (item: WishlistItem) => {
    const cartQuantity = quantities[item.stockId] || item.quantity;
    // Add to cart with the selected quantity
    cartService.addItem({
      ...item,
      quantity: cartQuantity,
    });
    // Redirect to cart page
    navigate('/cart');
  };

  const handleAddAllToCart = () => {
    // Add all wishlist items to cart with their selected quantities
    wishlistItems.forEach(item => {
      const cartQuantity = quantities[item.stockId] || item.quantity;
      cartService.addItem({
        ...item,
        quantity: cartQuantity,
      });
    });
    // Redirect to cart page
    navigate('/cart');
  };

  // Calculate totals - this runs every time quantities change
  const calculateTotal = () => {
    return wishlistItems.reduce((total, item) => {
      const qty = quantities[item.stockId] || 1;
      return total + (item.price * qty);
    }, 0);
  };

  const totalAmount = calculateTotal();
  const totalItems = wishlistItems.length;

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
          Your Wishlist
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'grey.600',
          }}
        >
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Typography>
      </Box>

      {/* Content */}
      {wishlistItems.length === 0 ? (
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
            Your wishlist is empty
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'grey.500',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Add products to your wishlist to save them for later
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
        // Wishlist Items
        <Box sx={{ maxWidth: '100%' }}>
          {/* Items List */}
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item.stockId}
              item={item}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          ))}

          {/* Total and Checkout Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: 3,
              mt: 4,
              pt: 3,
              borderTop: '2px solid #e0e0e0',
            }}
          >
            {/* Summary Box */}
            <Box
              sx={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                p: 2,
                minWidth: '180px',
              }}
            >
              {/* Items Count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.85rem', color: 'grey.600' }}>
                  Total Items:
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'black' }}>
                  {wishlistItems.length}
                </Typography>
              </Box>

              {/* Divider */}
              <Box sx={{ height: '1px', backgroundColor: '#e0e0e0', mb: 1.5 }} />

              {/* Total Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontSize: '0.9rem', color: 'grey.600', fontWeight: 500 }}>
                  Wishlist Total:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#dc2626',
                  }}
                >
                  £ {totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
              <MuiButton
                variant="outlined"
                onClick={() => navigate('/shop')}
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  textTransform: 'none',
                  px: 4,
                  py: 1.2,
                  '&:hover': {
                    borderColor: 'black',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                Continue Shopping
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleAddAllToCart}
                sx={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  py: 1.2,
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  },
                }}
              >
                Proceed to Cart (£{totalAmount.toFixed(2)})
              </MuiButton>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default WishlistPage;

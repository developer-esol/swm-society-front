import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WishlistCard from '../components/WishlistCard';
import { wishlistService } from '../api/services/wishlistService';
import { cartService } from '../api/services/cartService';
import { stockService } from '../api/services/stockService';
import { colors } from '../theme';
import type { WishlistItem } from '../types/wishlist';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh stock status every 30 seconds to detect stock refills (reduced from 3s to prevent flickering)
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update wishlist items with latest stock information
  useEffect(() => {
    const updateWishlistWithLatestStock = async () => {
      const wishlist = await wishlistService.getWishlistAsync();
      const updatedItems: WishlistItem[] = [];

      for (const item of wishlist.items) {
        try {
          // Fetch latest stock info
          const stocks = await stockService.getStocksByProductId(item.productId);
          const matchingStock = stocks.find(
            (s) => s.size === item.size && s.color === item.color
          );

          if (matchingStock && matchingStock.quantity > 0) {
            // Stock is now available - update maxQuantity
            updatedItems.push({
              ...item,
              maxQuantity: matchingStock.quantity,
            });
          } else {
            // Still out of stock
            updatedItems.push(item);
          }
        } catch {
          // Keep original item if fetch fails
          updatedItems.push(item);
        }
      }

      setWishlistItems(updatedItems);
    };

    updateWishlistWithLatestStock();
  }, [refreshTrigger]);

  useEffect(() => {
    // Load wishlist items on component mount
    const loadWishlist = async () => {
      const wishlist = await wishlistService.getWishlistAsync();
      setWishlistItems(wishlist.items);

      // Initialize quantities from wishlist items
      const quantitiesMap: Record<string, number> = {};
      wishlist.items.forEach(item => {
        quantitiesMap[item.stockId] = item.quantity; // Use the quantity from wishlist item
      });
      setQuantities(quantitiesMap);
    };

    void loadWishlist();
  }, []);

  const handleRemove = async (stockId: string) => {
    wishlistService.removeItem(stockId);
    const updatedWishlist = await wishlistService.getWishlistAsync();
    setWishlistItems(updatedWishlist.items);

    // Remove quantity entry
    const newQuantities = { ...quantities };
    delete newQuantities[stockId];
    setQuantities(newQuantities);

    // Also remove from cart
    cartService.removeItem(stockId);

    // Dispatch custom event to notify ProductCards to update their heart icons
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleUpdateQuantity = async (stockId: string, quantity: number) => {
    // Optimistically update UI: update quantities map and wishlistItems locally
    const prevQuantities = { ...quantities };
    const prevItems = wishlistItems.slice();

    setQuantities(prev => ({ ...prev, [stockId]: quantity }));
    setWishlistItems(items => items.map(it => (it.stockId === stockId ? { ...it, quantity } : it)));

    // Find the wishlist item to obtain id if available
    const item = prevItems.find(i => i.stockId === stockId);
    if (!item) return;

    try {
      // Use server id if present; otherwise pass stockId so local update path can work
      const id = item.id || stockId;
      await wishlistService.updateItem(id, { quantity });

      // After successful server update, refresh server-backed cache in background
      // but do not block UI: sync local storage to latest server state
      void wishlistService.getWishlistAsync().then(updated => setWishlistItems(updated.items)).catch(() => {});
    } catch (error) {
      // Revert optimistic changes on error
      setQuantities(prevQuantities);
      setWishlistItems(prevItems);

      console.error('Failed to update wishlist quantity:', error);
      const err = error as unknown as { body?: { message?: string }; message?: string };
      const serverMessage = err?.body?.message || err?.message || 'Failed to update wishlist. Please try again.';
      alert(serverMessage);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    // Prevent adding out-of-stock items to cart
    if (item.maxQuantity === 0) {
      alert('This product is out of stock and cannot be added to cart');
      return;
    }
    const cartQuantity = quantities[item.stockId] || item.quantity;
    // Add to cart with the selected quantity
    cartService.addItem({
      ...item,
      quantity: cartQuantity,
    });
    // Redirect to cart page
    navigate('/cart');
  };

  const handleProceedToCart = () => {
    // Add only in-stock wishlist items to cart with their selected quantities
    wishlistItems.forEach((item) => {
      // Skip out-of-stock items (maxQuantity === 0)
      if (item.maxQuantity === 0) {
        return;
      }
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
      // Exclude out-of-stock items (maxQuantity === 0) from total
      if (item.maxQuantity === 0) {
        return total;
      }
      const qty = quantities[item.stockId] || 1;
      return total + (Number(item.price) * qty);
    }, 0);
  };

  // Count only in-stock items
  const totalItems = wishlistItems.filter(item => item.maxQuantity > 0).length;
  const outOfStockItems = wishlistItems.filter(item => item.maxQuantity === 0).length;
  const totalAmount = calculateTotal();

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
          Your Wishlist
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colors.text.disabled,
          }}
        >
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
          {outOfStockItems > 0 && ` + ${outOfStockItems} out of stock`}
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
              color: colors.text.disabled,
              textAlign: 'center',
            }}
          >
            Your wishlist is empty
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.text.disabled,
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
              borderTop: `2px solid ${colors.border.default}`,
            }}
          >
            {/* Summary Box */}
            <Box
              sx={{
                backgroundColor: colors.background.lighter,
                border: `1px solid ${colors.border.default}`,
                borderRadius: '8px',
                p: 2,
                minWidth: '180px',
              }}
            >
              {/* Items Count */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.85rem', color: colors.text.disabled }}>
                  In-Stock Items:
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.text.primary }}>
                  {totalItems}
                </Typography>
              </Box>
              {outOfStockItems > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: colors.text.disabled }}>
                    Out of Stock:
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: colors.button.primaryDisabled }}>
                    {outOfStockItems}
                  </Typography>
                </Box>
              )}

              {/* Divider */}
              <Box sx={{ height: '1px', backgroundColor: colors.border.default, mb: 1.5 }} />

              {/* Total Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Typography sx={{ fontSize: '0.9rem', color: colors.text.disabled, fontWeight: 500 }}>
                  Wishlist Total:
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: colors.button.primary,
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
                  color: colors.text.primary,
                  borderColor: colors.text.primary,
                  textTransform: 'none',
                  px: 4,
                  py: 1.2,
                  '&:hover': {
                    borderColor: colors.text.primary,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                  },
                }}
              >
                Continue Shopping
              </MuiButton>
              <MuiButton
                variant="contained"
                onClick={handleProceedToCart}
                disabled={totalItems === 0}
                sx={{
                  backgroundColor: totalItems === 0 ? colors.button.primaryDisabled : colors.button.primary,
                  color: colors.text.secondary,
                  textTransform: 'none',
                  px: 4,
                  py: 1.2,
                  '&:hover': {
                    backgroundColor: totalItems === 0 ? colors.button.primaryDisabled : colors.button.primaryHover,
                  },
                  '&:disabled': {
                    backgroundColor: colors.button.primaryDisabled,
                    color: colors.text.secondary,
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
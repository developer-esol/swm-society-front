import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WishlistCard from '../components/WishlistCard';
import { wishlistService } from '../api/services/wishlistService';
import { authService } from '../api/services/authService';
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

  // Load wishlist (used on mount and when external parts of the app dispatch 'wishlist-updated')
  const loadWishlist = async () => {
    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    
    console.log('[WishlistPage] ========================================');
    console.log('[WishlistPage] Loading wishlist for user:', currentUserId);
    console.log('[WishlistPage] Authenticated:', authService.isAuthenticated());
    console.log('[WishlistPage] Token:', token ? '✅ Present' : '❌ Missing');
    console.log('[WishlistPage] ========================================');
    
    try {
      if (authService.isAuthenticated()) {
        console.log('[WishlistPage] → Fetching wishlist from server...');
        const wishlist = await wishlistService.getWishlistAsync();
        console.log('[WishlistPage] ✅ Loaded', wishlist.items.length, 'wishlist items from server');
        setWishlistItems(wishlist.items);
        const quantitiesMap: Record<string, number> = {};
        wishlist.items.forEach(item => { quantitiesMap[item.stockId] = item.quantity || 1; });
        setQuantities(quantitiesMap);
      } else {
        console.log('[WishlistPage] → User not authenticated, using localStorage');
        const wishlist = wishlistService.getWishlist();
        setWishlistItems(wishlist.items);
        const quantitiesMap: Record<string, number> = {};
        wishlist.items.forEach(item => { quantitiesMap[item.stockId] = item.quantity || 1; });
        setQuantities(quantitiesMap);
      }
    } catch (err) {
      console.error('[WishlistPage] ❌ Error loading wishlist:', err);
      const wishlist = wishlistService.getWishlist();
      setWishlistItems(wishlist.items);
      const quantitiesMap: Record<string, number> = {};
      wishlist.items.forEach(item => { quantitiesMap[item.stockId] = item.quantity || 1; });
      setQuantities(quantitiesMap);
    }
    console.log('[WishlistPage] ===========================================');
  };

  // Update wishlist items with latest stock information (uses server-backed wishlist when possible)
  useEffect(() => {
    const updateWishlistWithLatestStock = async () => {
      // get async wishlist (will prefer server for authenticated users)
      const wishlist = await wishlistService.getWishlistAsync();
      const updatedItems: WishlistItem[] = [];

      for (const item of wishlist.items) {
        try {
          // If item lacks variant info, try to enrich from stock by id
          if ((!(item.color && item.size)) && item.stockId) {
            try {
              const stockById = await stockService.getStockById(item.stockId);
              if (stockById) {
                item.color = item.color || stockById.color || item.color;
                item.size = item.size || stockById.size || item.size;
                item.maxQuantity = item.maxQuantity || Number(stockById.quantity) || item.maxQuantity;
                item.isOutOfStock = item.maxQuantity === 0;
              } else if (item.productId) {
                // Best-effort fallback: if stock lookup by id failed, try fetching stocks for the product
                try {
                  const stocks = await stockService.getStocksByProductId(item.productId);
                  if (stocks && stocks.length > 0) {
                    const first = stocks[0];
                    item.color = item.color || first.color || item.color;
                    item.size = item.size || first.size || item.size;
                    item.maxQuantity = item.maxQuantity || Number(first.quantity) || item.maxQuantity;
                    item.isOutOfStock = item.maxQuantity === 0;
                  }
                } catch {}
              }
            } catch {}
          }
          // Fetch latest stock info for the product
          const stocks = await stockService.getStocksByProductId(item.productId);
          const matchingStock = stocks.find(
            (s) => s.size === item.size && s.color === item.color
          );

          if (matchingStock && matchingStock.quantity > 0) {
            updatedItems.push({
              ...item,
              maxQuantity: matchingStock.quantity,
            });
          } else {
            // If we couldn't find an exact matching stock, but stocks exist for this product,
            // try a best-effort enrichment so the wishlist shows a color/size instead of placeholders.
            if ((!item.color || !item.size) && stocks && stocks.length > 0) {
              const first = stocks[0];
              updatedItems.push({
                ...item,
                color: item.color || first.color || item.color,
                size: item.size || first.size || item.size,
                maxQuantity: item.maxQuantity || Number(first.quantity) || item.maxQuantity,
                isOutOfStock: (item.maxQuantity || Number(first.quantity) || 0) === 0,
              });
            } else {
              // keep the item as-is (preserves selected color/size even when out of stock)
              updatedItems.push(item);
            }
          }
        } catch (err) {
          // Keep original item if fetch fails
          updatedItems.push(item);
        }
      }

      setWishlistItems(updatedItems);
    };

    updateWishlistWithLatestStock();
  }, [refreshTrigger]);

  useEffect(() => {
    // Load on mount and listen for external wishlist updates
    loadWishlist();
    const handler = () => { loadWishlist(); };
    window.addEventListener('wishlist-updated', handler);
    return () => window.removeEventListener('wishlist-updated', handler);
  }, []);

  const handleRemove = (stockId: string) => {
    // remove server-side when possible, then refresh wishlist state
    (async () => {
      try {
        await wishlistService.removeItemAsync(stockId);
        if (authService.isAuthenticated()) {
          const wl = await wishlistService.getWishlistAsync();
          setWishlistItems(wl.items);
        } else {
          const updatedWishlist = wishlistService.getWishlist();
          setWishlistItems(updatedWishlist.items);
        }
      } catch (err) {
        // fallback to local removal
        const updatedWishlist = wishlistService.getWishlist();
        setWishlistItems(updatedWishlist.items);
      }
    })();
    
    // Remove quantity entry
    const newQuantities = { ...quantities };
    delete newQuantities[stockId];
    setQuantities(newQuantities);

    // Also remove from cart
    cartService.removeItem(stockId);

    // Dispatch custom event to notify ProductCards to update their heart icons
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleUpdateQuantity = (stockId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [stockId]: quantity
    }));
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
              key={item.id || item.stockId || item.productId}
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
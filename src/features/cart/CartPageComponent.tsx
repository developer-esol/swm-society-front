import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../api/services/cartService';
import { authService } from '../../api/services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { CartItems } from './CartItems';
import { OrderSummary } from './OrderSummary';
import type { CartItem } from '../../types/cart';
import { colors } from '../../theme';

export const CartPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const currentUserId = user?.id || '';

  useEffect(() => {
    // Load cart items on component mount. If user is authenticated, fetch server cart for that user.
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let items: CartItem[] = [];

        if (isAuthenticated && currentUserId) {
          try {
            items = await cartService.getUserCart(currentUserId);
          } catch (e) {
            console.error('Failed to load server cart (getUserCart), falling back to local cart:', e);
            const local = cartService.getCart();
            items = local.items;
          }
        } else {
          const local = cartService.getCart();
          items = local.items;
        }


        // Extra safety: filter items by logged-in userId before rendering
        setPrivacyWarning(null);
        let filteredItems: CartItem[] = items;

        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();

          // If server returned items at all, ensure they include a per-item userId field
          const hasUserIdField = items.some((it: any) => 'userId' in it && it.userId !== undefined);

          if (!hasUserIdField && items.length > 0) {
            // Backend returned unscoped items (no userId); refuse to display for privacy
            console.error('Server returned cart items without userId; refusing to display for privacy reasons');
            setError('Server returned unscoped cart data. Cart items are not displayed for privacy. Open browser console or check localStorage key "lastServerCartRaw" for the raw response.');
            filteredItems = [];
          } else if (hasUserIdField) {
            const before = items.length;
            filteredItems = items.filter((it: any) => String(it.userId) === String(currentUser.id));
            const after = filteredItems.length;
            if (before !== after) {
              const removed = before - after;
              console.warn(`Filtered out ${removed} cart items not belonging to user ${currentUser.id}`);
              setPrivacyWarning(`${removed} cart item(s) were omitted because they do not belong to you.`);
            }
          }
        }

        setCartItems(filteredItems);

        // Initialize quantities from displayed cart items
        const quantitiesMap: Record<string, number> = {};
        filteredItems.forEach((item: CartItem) => {
          quantitiesMap[item.stockId] = item.quantity;
        });
        setQuantities(quantitiesMap);
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isAuthenticated, currentUserId]);

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
    // Update local cache immediately for snappy UI
    // Clamp quantity locally to item's maxQuantity if available
    const localCart = cartService.getCart();
    const localItem = localCart.items.find((i) => i.stockId === stockId);
    const clampedQuantity = localItem ? Math.max(1, Math.min(quantity, localItem.maxQuantity || quantity)) : Math.max(1, quantity);

    cartService.updateItemQuantity(stockId, clampedQuantity);
    setQuantities((prev) => ({ ...prev, [stockId]: clampedQuantity }));

    // If user is authenticated, propagate change to server
    if (isAuthenticated && currentUserId) {
      const item = cartItems.find((i) => i.stockId === stockId);
      if (!item) return;

      // Ensure payload quantity does not exceed server-expected max
      const payloadQuantity = Math.max(1, Math.min(quantity, item.maxQuantity || quantity));
      const payload = {
        quantity: payloadQuantity,
        price: Number(item.price),
        size: item.size,
        color: item.color,
        imageUrl: item.productImage,
        isActive: true,
      } as Record<string, unknown>;

      // Fire-and-forget with error handling; sync local state on failure
      (async () => {
        try {
          await cartService.updateServerCartItemByUserProduct(currentUserId, item.productId, payload);
        } catch (err) {
          console.error('Failed to update server cart item:', err);
          setError('Failed to update cart on server. Changes may be out of sync.');
          // Try to re-sync local cart from server to correct any divergence
          try {
            const synced = await cartService.syncServerCartToLocal();
            setCartItems(synced.items);
            const quantitiesMap: Record<string, number> = {};
            synced.items.forEach((it: CartItem) => { quantitiesMap[it.stockId] = it.quantity; });
            setQuantities(quantitiesMap);
          } catch (syncErr) {
            console.warn('Failed to sync after failed update:', syncErr);
          }
        }
      })();
    }
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

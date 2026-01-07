import React, { useState } from 'react';
import {
  Box,
  CardMedia,
  Typography,
  Button as MuiButton,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Trash2 as DeleteIcon } from 'lucide-react';
import { authService } from '../api/services/authService';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme';
import { productsService } from '../api/services/products';
import type { WishlistItem } from '../types/wishlist';

interface WishlistCardProps {
  item: WishlistItem;
  onRemove?: (stockId: string) => void;
  onAddToCart?: (item: WishlistItem) => void;
  onUpdateQuantity?: (stockId: string, quantity: number) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onRemove,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if item is out of stock
  const isOutOfStock = item.maxQuantity === 0;
  
  // Use maxQuantity if available, otherwise default to 99 (reasonable max)
  const effectiveMaxQuantity = item.maxQuantity > 0 ? item.maxQuantity : 99;
  
  // Initialize localQuantity - ensure it doesn't exceed max
  const initialQuantity = Math.min(item.quantity, effectiveMaxQuantity);
  const [localQuantity, setLocalQuantity] = useState(initialQuantity);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = () => {
    // open confirmation dialog
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    if (onRemove) {
      const idToRemove = (authService && authService.isAuthenticated && authService.isAuthenticated() && item.productId)
        ? item.productId
        : (item.stockId || item.id || item.productId || '');
      try {
        onRemove(idToRemove);
      } catch {}
    }
    setConfirmOpen(false);
    // isDeleting will be reset if parent re-renders item removed; keep until unmount
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  // Handle product click - fetch and navigate with product data
  const handleProductClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const product = await productsService.getProductById(item.productId);
      if (product) {
        navigate('/product', { state: { product } });
      }
    } catch (error) {
      console.error('[WishlistCard] Error fetching product:', error);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= effectiveMaxQuantity) {
      setLocalQuantity(newQuantity);
      if (onUpdateQuantity) {
        onUpdateQuantity(item.stockId, newQuantity);
      }
    }
  };

  const decreaseQuantity = () => {
    if (localQuantity > 1) {
      handleQuantityChange(localQuantity - 1);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = localQuantity + 1;
    if (newQuantity <= effectiveMaxQuantity) {
      handleQuantityChange(newQuantity);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr auto',
        gap: 2,
        py: 3,
        px: 2,
        borderBottom: `1px solid ${colors.border.light}`,
        alignItems: 'flex-start',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      {/* Product Image - Clickable */}
      <CardMedia
        component="img"
        image={item.productImage}
        alt={item.productName}
        onClick={handleProductClick}
        sx={{
          width: 120,
          height: 120,
          objectFit: 'cover',
          borderRadius: '4px',
          backgroundColor: colors.background.light,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
            transition: 'opacity 0.2s',
          },
        }}
      />

      {/* Product Info */}
      <Box>
        {/* Product Name - Clickable */}
        <Typography
          onClick={handleProductClick}
          sx={{
            fontWeight: 600,
            color: 'black',
            mb: 1,
            fontSize: '0.95rem',
            cursor: 'pointer',
            '&:hover': {
              color: '#dc2626',
              transition: 'color 0.2s',
            },
          }}
        >
          {item.productName}
        </Typography>

        {/* Price Per Item - Only show when in stock */}
        {!isOutOfStock && (
          <Typography
            sx={{
              fontWeight: 600,
              color: 'black',
              mb: 1.5,
              fontSize: '0.9rem',
            }}
          >
            £{Number(item.price).toFixed(2)}
          </Typography>
        )}

        {/* Color and Size in one row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {/* Color */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {/* color swatch - be resilient to missing/invalid color values */}
                  {(() => {
                    const raw = item.color || '';
                    let swatchColor = '#ddd';
                    try {
                      if (typeof (CSS as any) !== 'undefined' && (CSS as any).supports && raw.trim() !== '') {
                        // CSS.supports('color', raw) returns true for valid color keywords and values
                        if ((CSS as any).supports('color', raw)) swatchColor = raw;
                      } else if (raw.trim() !== '') {
                        swatchColor = raw;
                      }
                    } catch {
                      // ignore - keep fallback
                    }

                    return (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: swatchColor,
                          border: `2px solid ${colors.border.default}`,
                        }}
                      />
                    );
                  })()}

                  <Typography sx={{ color: 'black', fontSize: '0.85rem', fontWeight: 500 }}>
                    {item.color || '—'}
                  </Typography>
          </Box>

          {/* Size */}
          <Typography sx={{ color: 'black', fontSize: '0.85rem', fontWeight: 500 }}>
            Size: {item.size || '—'}
          </Typography>
        </Box>

        {/* Quantity Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Typography sx={{ fontSize: '0.85rem', color: 'grey.600', mr: 0.5 }}>
            Qty:
          </Typography>
          <IconButton
            size="small"
            onClick={decreaseQuantity}
            disabled={isOutOfStock || localQuantity <= 1}
            sx={{
              border: isOutOfStock ? '1px solid #f0f0f0' : '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '4px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              '&:disabled': {
                backgroundColor: '#f0f0f0',
                color: '#ccc',
              },
            }}
          >
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Typography sx={{ minWidth: '30px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
            {localQuantity}
          </Typography>
          <IconButton
            size="small"
            onClick={increaseQuantity}
            disabled={isOutOfStock || localQuantity >= effectiveMaxQuantity}
            sx={{
              border: isOutOfStock ? '1px solid #f0f0f0' : '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '4px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
              '&:disabled': {
                backgroundColor: '#f0f0f0',
                color: '#ccc',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Subtotal */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
          {!isOutOfStock && (
            <Typography sx={{ fontSize: '0.85rem', color: 'grey.600', fontWeight: 500 }}>
              Item Total:
            </Typography>
          )}
          <Typography sx={{ fontWeight: 700, color: isOutOfStock ? '#ccc' : colors.button.primary, fontSize: '1.1rem' }}>
            £{(Number(item.price) * localQuantity).toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Actions - Right Side */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        {/* Delete Button - Aligned at Top */}
        <IconButton
          size="small"
          onClick={handleDelete}
          disabled={isDeleting}
          sx={{
            minWidth: '40px',
            width: '40px',
            height: '40px',
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${colors.border.default}`,
            borderRadius: '6px',
            color: '#dc2626',
            bgcolor: 'transparent',
            alignSelf: 'flex-end',
            '&:hover': {
              bgcolor: '#fee2e2',
            },
          }}
          aria-label="remove wishlist item"
        >
          <DeleteIcon size={18} />
        </IconButton>
        <ConfirmDeleteDialog
          open={confirmOpen}
          title="Remove from Wishlist"
          message={`Are you sure you want to remove "${item.productName || 'this item'}" from your wishlist?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {/* Add to Cart Button - Aligned with Item Total */}
        <MuiButton
          variant="contained"
          size="small"
          disabled={isDeleting || isOutOfStock}
          onClick={handleAddToCart}
          sx={{
            backgroundColor: isOutOfStock ? '#f0f0f0' : 'black',
            color: isOutOfStock ? '#ccc' : 'white',
            textTransform: 'none',
            fontSize: '0.8rem',
            px: 2.5,
            py: 0.75,
            minWidth: '120px',
            alignSelf: 'flex-end',
            mt: 4.2,
            '&:hover': {
              backgroundColor: isOutOfStock ? '#f0f0f0' : '#333',
            },
            '&:disabled': {
              backgroundColor: '#f0f0f0',
              color: '#ccc',
            },
          }}
          title={isOutOfStock ? 'Out of stock - cannot add to cart' : ''}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </MuiButton>
      </Box>
    </Box>
  );
};

export default WishlistCard;

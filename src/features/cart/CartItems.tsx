import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Delete as TrashIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../theme';
import type { CartItem } from '../../types/cart';

interface CartItemsProps {
  cartItems: CartItem[];
  onRemove: (stockId: string) => void;
  onDecreaseQuantity: (stockId: string) => void;
  onIncreaseQuantity: (stockId: string, maxQuantity?: number) => void;
}

export const CartItems: React.FC<CartItemsProps> = ({
  cartItems,
  onRemove,
  onDecreaseQuantity,
  onIncreaseQuantity,
}) => {
  const navigate = useNavigate();

  return (
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
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                onClick={() => navigate(`/product/${item.productId}`)}
                title={item.productName}
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
                  onClick={() => onRemove(item.stockId)}
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
              £{Number(item.price).toFixed(2)}
            </Typography>
          </Box>

          {/* Quantity */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => onDecreaseQuantity(item.stockId)}
              disabled={Number(item.quantity) <= 1}
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
              {Number(item.quantity)}
            </Typography>
            <IconButton
              size="small"
              onClick={() => onIncreaseQuantity(item.stockId, item.maxQuantity)}
              disabled={
                // Only disable when maxQuantity is a positive number and current >= max
                typeof item.maxQuantity === 'number' && Number(item.maxQuantity) > 0
                  ? Number(item.quantity) >= Number(item.maxQuantity)
                  : false
              }
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
              £{(Number(item.price) * Number(item.quantity)).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

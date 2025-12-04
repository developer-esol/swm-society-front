import React from 'react';
import { Box, Button, IconButton, Typography, TextField } from '@mui/material';
import { Add, Remove, Favorite, FavoriteBorder } from '@mui/icons-material';
import { colors } from '../../theme';
import type { Product } from '../../types/product';
import type { Stock } from '../../types/product';

interface ProductOptionsProps {
  product: Product | null;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  availableSizes: string[];
  availableColors: string[];
  availableColorsForSize: string[];
  availableSizesForColor: string[];
  currentStock: Stock | undefined;
  inWishlist: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
}

export const ProductOptions: React.FC<ProductOptionsProps> = ({
  product,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  availableSizes,
  availableColors,
  currentStock,
  inWishlist,
  onAddToCart,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const maxQuantity = currentStock?.quantity || 0;

  return (
    <Box sx={{ mb: 4, borderTop: `1px solid ${colors.border.default}`, pt: 3 }}>
      {/* Size Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Size
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {availableSizes.map((size) => (
            <Box
              key={size}
              onClick={() => setSelectedSize(size)}
              sx={{
                px: 3,
                py: 2,
                border: `2px solid ${selectedSize === size ? '#000000' : colors.border.default}`,
                borderRadius: 1,
                cursor: 'pointer',
                fontWeight: selectedSize === size ? 600 : 500,
                bgcolor: selectedSize === size ? '#000000' : 'transparent',
                color: selectedSize === size ? '#ffffff' : colors.text.primary,
                transition: 'all 0.2s',
              }}
            >
              {size}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Color Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Color
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {availableColors.map((color) => (
            <Box
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                px: 3,
                py: 2,
                border: `2px solid ${selectedColor === color ? '#000000' : colors.border.default}`,
                borderRadius: 1,
                cursor: 'pointer',
                fontWeight: selectedColor === color ? 600 : 500,
                bgcolor: selectedColor === color ? '#000000' : 'transparent',
                color: selectedColor === color ? '#ffffff' : colors.text.primary,
                transition: 'all 0.2s',
              }}
            >
              {color}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Quantity Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Quantity
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            sx={{ border: `1px solid ${colors.border.default}` }}
          >
            <Remove />
          </IconButton>
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
            inputProps={{ min: 1, max: maxQuantity }}
            sx={{ width: 80, '& input': { textAlign: 'center' } }}
          />
          <IconButton
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            sx={{ border: `1px solid ${colors.border.default}` }}
          >
            <Add />
          </IconButton>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Max {maxQuantity}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onAddToCart}
          disabled={!currentStock}
          sx={{
            bgcolor: !currentStock ? colors.background.light : colors.button.primary,
            color: !currentStock ? colors.button.primaryDisabled : 'white',
            py: 1.5,
            fontWeight: 600,
            '&:hover': { bgcolor: !currentStock ? colors.background.light : colors.button.primaryHover },
          }}
        >
          {currentStock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={onToggleWishlist}
          startIcon={inWishlist ? <Favorite /> : <FavoriteBorder />}
          sx={{
            borderColor: colors.button.primary,
            color: colors.button.primary,
            py: 1.5,
            fontWeight: 600,
            '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.05)' },
          }}
        >
          {inWishlist ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
        </Button>
      </Box>
    </Box>
  );
};

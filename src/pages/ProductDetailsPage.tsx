import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button as MuiButton,
  Link as MuiLink,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { Add, Remove, Info } from '@mui/icons-material';

// Import hooks
import { useStocks, useProduct } from '../hooks/useStock';
import type { Stock } from '../types/product';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  // State for product selection
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Get product data using custom hook
  const { data: product, isLoading: productLoading } = useProduct(productId);

  // Get stock data using custom hook
  const { data: stocks = [], isLoading: stocksLoading } = useStocks(productId);

  // Set initial selections when stocks are loaded
  useEffect(() => {
    if (stocks.length > 0 && !selectedSize && !selectedColor) {
      // Get available sizes and colors from stock
      const availableSizes = [...new Set(stocks.filter((s: Stock) => s.isActive && s.quantity > 0).map((s: Stock) => s.size))];
      const availableColors = [...new Set(stocks.filter((s: Stock) => s.isActive && s.quantity > 0).map((s: Stock) => s.color))];
      
      if (availableSizes.length > 0) setSelectedSize(availableSizes[0]);
      if (availableColors.length > 0) setSelectedColor(availableColors[0]);
    }
  }, [stocks, selectedSize, selectedColor]);

  // Get available options from stock
  const availableSizes: string[] = [...new Set(stocks.filter((s: Stock) => s.isActive && s.quantity > 0).map((s: Stock) => s.size))];
  const availableColors: string[] = [...new Set(stocks.filter((s: Stock) => s.isActive && s.quantity > 0).map((s: Stock) => s.color))];
  
  // Get available colors for selected size
  const availableColorsForSize: string[] = selectedSize ? 
    [...new Set(stocks.filter((s: Stock) => s.isActive && s.quantity > 0 && s.size === selectedSize).map((s: Stock) => s.color))] :
    availableColors;
  
  // Get available sizes for selected color
  const availableSizesForColor: string[] = selectedColor ?
    [...new Set(stocks.filter((s: Stock) => s.isActive && s.quantity > 0 && s.color === selectedColor).map((s: Stock) => s.size))] :
    availableSizes;

  // Get current stock for selected size/color
  const currentStock = stocks.find((s: Stock) => 
    s.size === selectedSize && 
    s.color === selectedColor && 
    s.isActive
  );

  // Mock cart and wishlist functions (replace with real implementations)
  const addToCart = (product: any, quantity: number, size: string, color: string) => {
    console.log('Adding to cart:', { product, quantity, size, color });
    // Implement cart logic
  };

  const isInWishlist = (_productId: string) => false; // Replace with real implementation
  const addToWishlist = (product: any) => console.log('Adding to wishlist:', product);
  const removeFromWishlist = (productId: string) => console.log('Removing from wishlist:', productId);

  if (productLoading || stocksLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Product not found
        </Typography>
        <MuiButton 
          component={Link} 
          to="/shop" 
          variant="contained"
          sx={{
            bgcolor: '#dc2626',
            '&:hover': { bgcolor: '#b91c1c' }
          }}
        >
          Return to Shop
        </MuiButton>
      </Container>
    );
  }

  const handleAddToCart = () => {
    if (!currentStock) {
      alert('Please select a size and color');
      return;
    }
    
    if (quantity > currentStock.quantity) {
      alert(`Only ${currentStock.quantity} items available in stock`);
      return;
    }

    addToCart(
      {
        ...product,
        color: selectedColor,
        size: selectedSize,
        image: product.image,
        stockId: currentStock.id,
        stockPrice: currentStock.price
      },
      quantity,
      selectedSize,
      selectedColor
    );
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        ...product,
        image: product.image
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const maxQuantity = currentStock?.quantity || 0;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const getCollectionStoryLink = () => {
    switch (product.brandName) {
      case 'Hear My Voice': return '/story/hear-my-voice';
      case 'Project ZerO': return '/story/project-zero';  
      case 'Thomas Mushet': return '/story/thomas-mushet';
      default: return '/shop';
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', width: '100%', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 8 },
          }}
        >
          {/* Product Images */}
          <Box
            sx={{
              width: '100%',
              height: { xs: 400, md: 600 },
              bgcolor: 'grey.100',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}
          >
            <IconButton
              onClick={handleWishlistToggle}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'white',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              {isInWishlist(product.id) ? '❤️' : '🤍'}
            </IconButton>
          </Box>

          {/* Product Details */}
          <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', flex: 1, mr: 2 }}>
                {product.name}
              </Typography>
              <MuiLink
                component={Link}
                to={getCollectionStoryLink()}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#dc2626',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#b91c1c',
                  },
                }}
              >
                <Info sx={{ fontSize: 20, mr: 0.5 }} />
                <Typography variant="body2">
                  About {product.brandName}
                </Typography>
              </MuiLink>
            </Box>

            {/* Stock Status */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color={stocks.length > 0 ? 'success.main' : 'error.main'}>
                {stocks.length > 0 ? 'In Stock' : 'Out of Stock'}
                {currentStock && ` (${currentStock.quantity} available)`}
              </Typography>
            </Box>

            {/* Price */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              £{currentStock?.price?.toFixed(2) || product.price.toFixed(2)}
            </Typography>

            {/* Description */}
            <Typography variant="body1" sx={{ color: 'text.primary', mb: 4, lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                  Size
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {availableSizesForColor.map(size => (
                    <Chip
                      key={size}
                      label={size}
                      clickable
                      onClick={() => setSelectedSize(size)}
                      variant={selectedSize === size ? 'filled' : 'outlined'}
                      sx={{
                        bgcolor: selectedSize === size ? 'black' : 'transparent',
                        color: selectedSize === size ? 'white' : 'black',
                        borderColor: selectedSize === size ? 'black' : 'grey.400',
                        '&:hover': {
                          bgcolor: selectedSize === size ? 'grey.800' : 'grey.100',
                          borderColor: 'grey.600',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                  Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {availableColorsForSize.map(color => (
                    <Chip
                      key={color}
                      label={color}
                      clickable
                      onClick={() => setSelectedColor(color)}
                      variant={selectedColor === color ? 'filled' : 'outlined'}
                      sx={{
                        bgcolor: selectedColor === color ? 'black' : 'transparent',
                        color: selectedColor === color ? 'white' : 'black',
                        borderColor: selectedColor === color ? 'black' : 'grey.400',
                        '&:hover': {
                          bgcolor: selectedColor === color ? 'grey.800' : 'grey.100',
                          borderColor: 'grey.600',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Quantity */}
            {currentStock && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                  <IconButton
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.400',
                      borderRadius: 0,
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      '&:hover': {
                        borderColor: 'grey.600',
                        bgcolor: 'grey.50',
                      }
                    }}
                  >
                    <Remove />
                  </IconButton>
                  <Box
                    sx={{
                      px: 3,
                      py: 1,
                      border: '1px solid',
                      borderColor: 'grey.400',
                      borderLeft: 0,
                      borderRight: 0,
                      minWidth: 60,
                      textAlign: 'center',
                    }}
                  >
                    {quantity}
                  </Box>
                  <IconButton
                    onClick={increaseQuantity}
                    disabled={!currentStock || quantity >= currentStock.quantity}
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.400',
                      borderRadius: 0,
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                      '&:hover': {
                        borderColor: 'grey.600',
                        bgcolor: 'grey.50',
                      }
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Max: {currentStock.quantity}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <MuiButton
                variant="contained"
                size="large"
                onClick={handleAddToCart}
                disabled={!currentStock || currentStock.quantity === 0}
                sx={{
                  flex: 1,
                  bgcolor: '#dc2626',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#b91c1c',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500',
                  }
                }}
              >
                {currentStock ? 'Add to Cart' : 'Out of Stock'}
              </MuiButton>
              <MuiButton
                variant="outlined"
                size="large"
                onClick={handleWishlistToggle}
                sx={{
                  borderColor: 'grey.400',
                  color: 'black',
                  '&:hover': {
                    borderColor: 'black',
                    bgcolor: 'grey.50',
                  }
                }}
              >
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </MuiButton>
            </Box>

            {/* Stock Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Available Stock Information:
              </Typography>
              {stocks.filter((s: Stock) => s.isActive && s.quantity > 0).map((stock: Stock) => (
                <Typography key={stock.id} variant="body2" color="text.secondary">
                  {stock.size} - {stock.color}: {stock.quantity} available (£{stock.price.toFixed(2)})
                </Typography>
              ))}
            </Box>

            {/* Shipping & Returns */}
            <Box sx={{ pt: 3 }}>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: '30%', minWidth: 100 }}>
                    Shipping:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Free shipping on orders over £100. Standard delivery 3-5 working days.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: '30%', minWidth: 100 }}>
                    Returns:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Free 30-day returns for unworn items.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 3, pt: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  Part of the {product.brandName} collection.
                  {product.brandName === "Project ZerO" && 
                    ' 80% of the revenue generated from this capsule collection will go directly to A-Star Foundation and Project Zero, helping fund programs that provide young students with the mentorship, resources, and guidance they need.'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
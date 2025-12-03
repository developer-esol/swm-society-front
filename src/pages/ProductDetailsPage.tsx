import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button as MuiButton,
  Link as MuiLink,
  IconButton,
  TextField,
  Rating,
} from '@mui/material';
import { Add, Remove, Info, Favorite, FavoriteBorder } from '@mui/icons-material';

// Import hooks, components and services
import { useStocks, useProduct } from '../hooks/useStock';
import { useWishlist } from '../hooks/useWishlist';
import { cartService } from '../api/services/cartService';
import { projectZeroProductService } from '../api/services/projectZeroProductService';
import ReviewCard from '../components/ReviewCard';
import { reviewService } from '../api/services/reviewService';
import { colors } from '../theme';
import type { Stock, Product } from '../types/product';
import type { Review } from '../types/review';
import type { WishlistItem } from '../types/wishlist';
import type { CartItem } from '../types/cart';


const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  
  // State for product selection
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [productData, setProductData] = useState<Product | null>(null);
  const [displayImage, setDisplayImage] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const currentUserId = 'user1'; // Replace with actual logged-in user ID

  // Auto-refresh stock status every 30 seconds to detect refills (reduced from 3s to prevent flickering)
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load reviews from service on component mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const loadedReviews = await reviewService.getReviewsByProduct(productId!);
        setReviews(loadedReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId]);

  // Load product data with color images from service
  useEffect(() => {
    const loadProductData = async () => {
      try {
        const products = await projectZeroProductService.getProducts();
        const currentProduct = products.find(p => p.id === productId);
        if (currentProduct) {
          console.log('Product loaded:', currentProduct);
          setProductData(currentProduct);
          setDisplayImage(currentProduct.image || '');
        }
      } catch (error) {
        console.error('Failed to load product data:', error);
      }
    };

    loadProductData();
  }, [productId]);

  // Update display image when color is selected
  useEffect(() => {
    if (!selectedColor || !productData) return;
    
    console.log('Color selected:', selectedColor);
    console.log('Product data:', productData);
    
    if (productData?.colorImages) {
      // Try exact match first
      let colorImage: string | undefined = productData.colorImages[selectedColor];
      
      // If not found, try case-insensitive match
      if (!colorImage) {
        const normalizedColor = selectedColor.toLowerCase();
        const matchingKey = Object.keys(productData.colorImages).find(
          key => key.toLowerCase() === normalizedColor
        );
        colorImage = matchingKey ? productData.colorImages[matchingKey] : undefined;
      }
      
      if (colorImage) {
        console.log('Setting display image to:', colorImage);
        setDisplayImage(colorImage);
      } else {
        console.log('No color image found. Available keys:', Object.keys(productData.colorImages));
      }
    }
  }, [selectedColor, productData]);

  // Get product data using custom hook
  const { data: product, isLoading: productLoading } = useProduct(productId);

  // Get stock data using custom hook - includes refresh trigger for auto-refresh
  const { data: stocks = [], isLoading: stocksLoading } = useStocks(productId, refreshTrigger);

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

  // Mock cart function (replace with real implementation)
  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    if (!currentStock) {
      alert('Please select a size and color');
      return;
    }

    if (quantity > currentStock.quantity) {
      alert(`Only ${currentStock.quantity} items available in stock`);
      return;
    }

    // Add to cart using cartService
    const cartItem: CartItem = {
      stockId: currentStock.id,
      productId: product.id,
      productName: product.name,
      productImage: product.image || '',
      price: currentStock.price,
      color: color,
      size: size,
      quantity: quantity,
      maxQuantity: currentStock.quantity, // Available stock for this size/color
      addedAt: new Date().toISOString(),
    };

    cartService.addItem(cartItem);
    navigate('/cart');
  };

  // Check if product is in wishlist when stock changes or product loads
  useEffect(() => {
    if (currentStock) {
      // Product is in stock - check by stockId
      setInWishlist(isInWishlist(currentStock.id));
    } else if (product) {
      // Product is out of stock - check by productId
      setInWishlist(isInWishlist(product.id));
    }
  }, [currentStock, product, isInWishlist]);

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
            bgcolor: colors.button.primary,
            '&:hover': { bgcolor: colors.button.primaryHover }
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

    // Add to wishlist first
    if (!inWishlist) {
      const wishlistItem: WishlistItem = {
        stockId: currentStock.id,
        productId: product.id,
        productName: product.name,
        productImage: product.image || '',
        price: currentStock.price,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
        maxQuantity: currentStock.quantity,
        addedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      addItem(wishlistItem);
      setInWishlist(true);
    }

    addToCart(
      {
        ...product,
        color: selectedColor,
        size: selectedSize,
        image: (product as unknown as { imageurl?: string; image?: string }).imageurl || product.image,
        stockId: currentStock.id,
        stockPrice: currentStock.price
      } as unknown as Product,
      quantity,
      selectedSize,
      selectedColor
    );
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      // Remove from wishlist AND cart
      if (currentStock) {
        removeItem(currentStock.id);
        // Also remove from cart
        cartService.removeItem(currentStock.id);
      } else {
        removeItem(product.id); // Use product ID if out of stock
        cartService.removeItem(product.id);
      }
      setInWishlist(false);
    } else {
      // Add to wishlist
      if (currentStock) {
        // Product is in stock - add with size/color
        const wishlistItem: WishlistItem = {
          stockId: currentStock.id,
          productId: product.id,
          productName: product.name,
          productImage: product.image || '',
          price: currentStock.price,
          color: selectedColor,
          size: selectedSize,
          quantity: quantity,
          maxQuantity: currentStock.quantity,
          addedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        addItem(wishlistItem);
      } else {
        // Product is out of stock - add without size/color requirement and disable cart button
        const wishlistItem: WishlistItem = {
          stockId: product.id,
          productId: product.id,
          productName: product.name,
          productImage: product.image || '',
          price: product.price,
          color: '',
          size: '',
          quantity: 1,
          maxQuantity: 0,
          isOutOfStock: true, // Mark as out of stock
          addedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        addItem(wishlistItem);
      }
      setInWishlist(true);
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

  const handleSubmitReview = async () => {
    if (!reviewTitle.trim() || !reviewComment.trim() || reviewRating === 0) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const newReview = await reviewService.createReview({
        productId: productId!,
        userId: currentUserId,
        userName: 'Current User',
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        verified: true,
      });

      setReviews([newReview, ...reviews]);
      setReviewRating(0);
      setReviewTitle('');
      setReviewComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
      throw error;
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
    <Box sx={{ bgcolor: colors.text.secondary, width: '100%', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 4, md: 8 },
          }}
        >
          {/* Left Column - Product Images and Recommendations */}
          <Box>
            {/* Product Images */}
            <Box
              sx={{
                width: '100%',
                height: { xs: 400, md: 500 },
                bgcolor: colors.background.light,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${displayImage || product.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                mb: 3,
              }}
            >
            </Box>

            {/* Color Variants Below Main Image */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {availableColors.map((color) => {
                // Try exact match first, then case-insensitive match
                let colorImage = productData?.colorImages?.[color];
                if (!colorImage && productData?.colorImages) {
                  const normalizedColor = color.toLowerCase();
                  const matchingKey = Object.keys(productData.colorImages).find(
                    key => key.toLowerCase() === normalizedColor
                  );
                  colorImage = matchingKey ? productData.colorImages[matchingKey] : undefined;
                }
                
                return (
                  <Box
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: selectedColor === color ? `3px solid ${colors.button.primary}` : `1px solid ${colors.border.light}`,
                      backgroundImage: colorImage ? `url(${colorImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      '&:hover': {
                        borderColor: colors.button.primary,
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                  </Box>
                );
              })}
            </Box>

          </Box>

          {/* Right Column - Product Details */}
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
                  color: colors.button.primary,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.button.primaryHover,
                  },
                }}
              >
                <Info sx={{ fontSize: 20, mr: 0.5 }} />
                <Typography variant="body2">
                  About {product.brandName}
                </Typography>
              </MuiLink>
            </Box>

            {/* Rating Display */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating
                value={reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0}
                readOnly
                precision={0.1}
              />
              <Typography variant="body2" sx={{ color: colors.text.disabled }}>
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </Typography>
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
            <Typography variant="body1" sx={{ color: colors.text.primary, mb: 4, lineHeight: 1.6 }}>
              {product.description}
            </Typography>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                  Size
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {availableSizesForColor.map((size) => (
                    <MuiButton
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      variant={selectedSize === size ? 'contained' : 'outlined'}
                      sx={{
                        minWidth: '60px',
                        height: '45px',
                        bgcolor: selectedSize === size ? colors.text.primary : colors.text.secondary,
                        color: selectedSize === size ? colors.text.secondary : colors.text.primary,
                        borderColor: 'transparent',
                        border: 'none',
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        borderRadius: '4px',
                        '&:hover': {
                          bgcolor: selectedSize === size ? colors.overlay.darkHover : colors.background.light,
                        }
                      }}
                    >
                      {size}
                    </MuiButton>
                  ))}
                </Box>
              </Box>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                  Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {availableColorsForSize.map((color) => (
                    <MuiButton
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      variant={selectedColor === color ? 'contained' : 'outlined'}
                      sx={{
                        minWidth: '80px',
                        height: '45px',
                        bgcolor: selectedColor === color ? colors.text.primary : colors.text.secondary,
                        color: selectedColor === color ? colors.text.secondary : colors.text.primary,
                        borderColor: 'transparent',
                        border: 'none',
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        borderRadius: '4px',
                        '&:hover': {
                          bgcolor: selectedColor === color ? colors.overlay.darkHover : colors.background.light,
                        }
                      }}
                    >
                      {color}
                    </MuiButton>
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
                      borderColor: colors.border.light,
                      borderRadius: 0,
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      '&:hover': {
                        borderColor: colors.text.disabled,
                        bgcolor: colors.background.light,
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
                      borderColor: colors.border.light,
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
                      borderColor: colors.border.light,
                      borderRadius: 0,
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                      '&:hover': {
                        borderColor: colors.text.disabled,
                        bgcolor: colors.background.light,
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
                disabled={!currentStock || currentStock.quantity === 0 || (inWishlist && !currentStock)}
                sx={{
                  flex: 1,
                  bgcolor: (!currentStock || currentStock.quantity === 0 || (inWishlist && !currentStock)) ? colors.background.lighter : colors.button.primary,
                  color: (!currentStock || currentStock.quantity === 0 || (inWishlist && !currentStock)) ? colors.button.primaryDisabled : colors.text.secondary,
                  '&:hover': {
                    bgcolor: (!currentStock || currentStock.quantity === 0 || (inWishlist && !currentStock)) ? colors.background.lighter : colors.button.primaryHover,
                  },
                  '&:disabled': {
                    bgcolor: colors.background.lighter,
                    color: colors.button.primaryDisabled,
                  }
                }}
              >
                {currentStock ? 'Add to Cart' : 'Out of Stock'}
              </MuiButton>
              <MuiButton
                variant="outlined"
                size="large"
                onClick={handleWishlistToggle}
                startIcon={inWishlist ? <Favorite /> : <FavoriteBorder />}
                sx={{
                  borderColor: inWishlist ? colors.button.primary : colors.border.light,
                  color: inWishlist ? colors.button.primary : colors.text.primary,
                  '&:hover': {
                    borderColor: colors.button.primary,
                    bgcolor: `rgba(${parseInt(colors.button.primary.slice(1,3), 16)}, ${parseInt(colors.button.primary.slice(3,5), 16)}, ${parseInt(colors.button.primary.slice(5,7), 16)}, 0.05)`,
                  }
                }}
              >
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </MuiButton>
            </Box>

            {/* Shipping & Returns Info with Links */}
            <Box sx={{ mb: 4, py: 3, borderTop: `1px solid ${colors.border.default}`, borderBottom: `1px solid ${colors.border.default}` }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, mb: 0.5 }}>
                    Shipping:
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.lightGray, mb: 1 }}>
                    Free shipping on orders over £100. Standard delivery 3-5 working days.
                  </Typography>
                  <MuiLink
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/shipping-info')}
                    sx={{ color: colors.icon.primary, textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    View shipping details
                  </MuiLink>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text.primary, mb: 0.5 }}>
                    Returns:
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.lightGray, mb: 1 }}>
                    Free 30-day returns for unworn items.
                  </Typography>
                  <MuiLink
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/shipping-info')}
                    sx={{ color: colors.icon.primary, textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    View return policy
                  </MuiLink>
                </Box>
              </Box>
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
              <Box sx={{ mt: 0, pt: 0 }}>
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

      {/* Customer Reviews Section */}
      <Container maxWidth="lg" sx={{ py: 6, borderTop: `1px solid ${colors.border.light}` }}>
        <Box sx={{ mb: 6 }}>
          {/* Review Summary */}
          <Box sx={{ mb: 4, pb: 4, borderBottom: `1px solid ${colors.border.light}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Customer Reviews
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating
                    value={reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0}
                    readOnly
                    precision={0.1}
                  />
                  <Typography variant="body2" sx={{ color: colors.text.disabled }}>
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Latest Reviews
            </Typography>
          </Box>

          {/* Review List */}
          <Box sx={{ mb: 6 }}>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={currentUserId}
                  onDelete={handleDeleteReview}
                />
              ))
            ) : (
              <Typography sx={{ color: colors.text.disabled, textAlign: 'center', py: 4 }}>
                No reviews yet. Be the first to review!
              </Typography>
            )}
          </Box>

          {/* Write a Review Section */}
          <Box sx={{ borderTop: `1px solid ${colors.border.light}`, pt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Write a Review
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Rating */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Rating
                </Typography>
                <Rating
                  value={reviewRating}
                  onChange={(_, newValue) => {
                    setReviewRating(newValue || 0);
                  }}
                  size="large"
                />
              </Box>

              {/* Title */}
              <TextField
                label="Review Title"
                placeholder="Summarize your experience"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />

              {/* Comment */}
              <TextField
                label="Your Review"
                placeholder="Share your experience with this product"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />

              {/* Submit Button */}
              <MuiButton
                variant="contained"
                onClick={handleSubmitReview}
                sx={{
                  textTransform: 'none',
                  padding: '10px 24px',
                  fontWeight: 600,
                  alignSelf: 'flex-start',
                  bgcolor: colors.button.primary,
                  '&:hover': {
                    bgcolor: colors.button.primaryHover,
                  }
                }}
              >
                Submit Review
              </MuiButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
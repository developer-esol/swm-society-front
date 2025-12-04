import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { colors } from '../../theme';

// Import feature components
import {
  ProductOptions,
  ProductDetailsImage,
  ProductDetailsHeader,
  ProductDetailsInfo,
  CustomerReviews,
  WriteReview,
} from './index';

// Import hooks and services
import { useStocks, useProduct } from '../../hooks/useStock';
import { useWishlist } from '../../hooks/useWishlist';
import { cartService } from '../../api/services/cartService';
import { projectZeroProductService } from '../../api/services/projectZeroProductService';
import { reviewService } from '../../api/services/reviewService';

import type { Stock, Product } from '../../types/product';
import type { Review } from '../../types/review';
import type { WishlistItem } from '../../types/wishlist';
import type { CartItem } from '../../types/cart';

interface ProductDetailsPageComponentProps {
  productId: string;
}

export const ProductDetailsPageComponent: React.FC<ProductDetailsPageComponentProps> = ({ productId }) => {
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
  const currentUserId = 'user1';

  // Auto-refresh stock status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load reviews from service
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const loadedReviews = await reviewService.getReviewsByProduct(productId);
        setReviews(loadedReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId]);

  // Load product data with color images
  useEffect(() => {
    const loadProductData = async () => {
      try {
        const products = await projectZeroProductService.getProducts();
        const currentProduct = products.find((p) => p.id === productId);
        if (currentProduct) {
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

    if (productData?.colorImages) {
      let colorImage: string | undefined = productData.colorImages[selectedColor];

      if (!colorImage) {
        const normalizedColor = selectedColor.toLowerCase();
        const matchingKey = Object.keys(productData.colorImages).find(
          (key) => key.toLowerCase() === normalizedColor
        );
        colorImage = matchingKey ? productData.colorImages[matchingKey] : undefined;
      }

      if (colorImage) {
        setDisplayImage(colorImage);
      }
    }
  }, [selectedColor, productData]);

  // Get product data using custom hook
  const { data: product, isLoading: productLoading } = useProduct(productId);

  // Get stock data using custom hook
  const { data: stocks = [], isLoading: stocksLoading } = useStocks(productId, refreshTrigger);

  // Set initial selections when stocks are loaded
  useEffect(() => {
    if (stocks.length > 0 && !selectedSize && !selectedColor) {
      const availableSizes = [
        ...new Set(
          stocks
            .filter((s: Stock) => s.isActive && s.quantity > 0)
            .map((s: Stock) => s.size)
        ),
      ];
      const availableColors = [
        ...new Set(
          stocks
            .filter((s: Stock) => s.isActive && s.quantity > 0)
            .map((s: Stock) => s.color)
        ),
      ];

      if (availableSizes.length > 0) setSelectedSize(availableSizes[0]);
      if (availableColors.length > 0) setSelectedColor(availableColors[0]);
    }
  }, [stocks, selectedSize, selectedColor]);

  // Get available options from stock
  const availableSizes: string[] = [
    ...new Set(
      stocks
        .filter((s: Stock) => s.isActive && s.quantity > 0)
        .map((s: Stock) => s.size)
    ),
  ];
  const availableColors: string[] = [
    ...new Set(
      stocks
        .filter((s: Stock) => s.isActive && s.quantity > 0)
        .map((s: Stock) => s.color)
    ),
  ];

  const availableColorsForSize: string[] = selectedSize
    ? [
        ...new Set(
          stocks
            .filter((s: Stock) => s.isActive && s.quantity > 0 && s.size === selectedSize)
            .map((s: Stock) => s.color)
        ),
      ]
    : availableColors;

  const availableSizesForColor: string[] = selectedColor
    ? [
        ...new Set(
          stocks
            .filter((s: Stock) => s.isActive && s.quantity > 0 && s.color === selectedColor)
            .map((s: Stock) => s.size)
        ),
      ]
    : availableSizes;

  // Get current stock
  const currentStock = stocks.find(
    (s: Stock) => s.size === selectedSize && s.color === selectedColor && s.isActive
  );

  // Check if product is in wishlist
  useEffect(() => {
    if (currentStock) {
      setInWishlist(isInWishlist(currentStock.id));
    } else if (product) {
      setInWishlist(isInWishlist(product.id));
    }
  }, [currentStock, product, isInWishlist]);

  const handleAddToCart = () => {
    if (!currentStock) {
      alert('Please select a size and color');
      return;
    }

    if (quantity > currentStock.quantity) {
      alert(`Only ${currentStock.quantity} items available in stock`);
      return;
    }

    const cartItem: CartItem = {
      stockId: currentStock.id,
      productId: product!.id,
      productName: product!.name,
      productImage: product!.image || '',
      price: currentStock.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      maxQuantity: currentStock.quantity,
      addedAt: new Date().toISOString(),
    };

    cartService.addItem(cartItem);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      if (currentStock) {
        removeItem(currentStock.id);
        cartService.removeItem(currentStock.id);
      } else {
        removeItem(product!.id);
        cartService.removeItem(product!.id);
      }
      setInWishlist(false);
    } else {
      if (currentStock) {
        const wishlistItem: WishlistItem = {
          stockId: currentStock.id,
          productId: product!.id,
          productName: product!.name,
          productImage: product!.image || '',
          price: currentStock.price,
          color: selectedColor,
          size: selectedSize,
          quantity: quantity,
          maxQuantity: currentStock.quantity,
          addedAt: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
        addItem(wishlistItem);
      } else {
        const wishlistItem: WishlistItem = {
          stockId: product!.id,
          productId: product!.id,
          productName: product!.name,
          productImage: product!.image || '',
          price: product!.price,
          color: '',
          size: '',
          quantity: 1,
          maxQuantity: 0,
          isOutOfStock: true,
          addedAt: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };
        addItem(wishlistItem);
      }
      setInWishlist(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewTitle.trim() || !reviewComment.trim() || reviewRating === 0) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const newReview = await reviewService.createReview({
        productId: productId,
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
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.background.default, width: '100%', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Main Product Section - 2 Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 6 }, mb: 6 }}>
          {/* Left Column - Product Image and Color Variants */}
          <ProductDetailsImage
            displayImage={displayImage}
            productImage={product?.image || ''}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            availableColors={availableColors}
            productData={productData}
          />

          {/* Right Column - Product Details and Options */}
          <Box>
            {/* Product Header Info */}
            <ProductDetailsHeader
              product={product}
              reviews={reviews}
            />

            {/* Product Options Section */}
            <ProductOptions
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              quantity={quantity}
              setQuantity={setQuantity}
              availableSizes={availableSizesForColor}
              availableColors={availableColorsForSize}
              availableColorsForSize={availableColorsForSize}
              availableSizesForColor={availableSizesForColor}
              currentStock={currentStock}
              inWishlist={inWishlist}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleWishlistToggle}
            />

            {/* Stock Information - After Add to Cart */}
            {currentStock && (
              <Box sx={{ mb: 3, pb: 3, borderBottom: `1px solid ${colors.border.default}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Available Stock Information:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {stocks
                    .filter((s: Stock) => s.isActive && s.quantity > 0)
                    .map((stock: Stock) => (
                      <Typography key={stock.id} variant="caption" sx={{ color: colors.text.gray }}>
                        {stock.size} - {stock.color}: {stock.quantity} available (£{stock.price.toFixed(2)})
                      </Typography>
                    ))}
                </Box>
              </Box>
            )}

            {/* Product Details Info - Shipping and Returns */}
            <ProductDetailsInfo
              onViewReturnPolicy={() => navigate('/return-policy')}
            />

            {/* Collection Info */}
            <Typography variant="caption" sx={{ color: colors.text.gray, mb: 3, display: 'block' }}>
              Part of the {product?.brandName} collection.
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Customer Reviews Section */}
      <Container maxWidth="lg" sx={{ py: 6, borderTop: `1px solid ${colors.border.default}` }}>
        <CustomerReviews reviews={reviews} />

        {/* Write a Review Section */}
        <WriteReview
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewTitle={reviewTitle}
          setReviewTitle={setReviewTitle}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          onSubmitReview={handleSubmitReview}
        />
      </Container>
    </Box>
  );
};

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
import { authService } from '../../api/services/authService';
import { productsService } from '../../api/services/products';
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
  const [reviewComment, setReviewComment] = useState('');
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id || '';
  const [reviewImageUrl, setReviewImageUrl] = useState('https://example.com/review-image.jpg');

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
        console.log('Loading product details for ID:', productId);
        const currentProduct = await productsService.getProductById(productId);
        if (currentProduct) {
          setProductData(currentProduct);
          setDisplayImage(String(currentProduct.image || currentProduct.imageUrl || ''));
          console.log('Product loaded successfully:', currentProduct.name);
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

  // Aggregate stocks by size+color so multiple rows for same variant are summed
  type AggStock = {
    size: string;
    color: string;
    totalQuantity: number;
    minPrice: number;
    stockIds: string[];
  };

  const aggregatedMap = stocks.reduce<Record<string, AggStock>>((map, s: Stock) => {
    if (!s || !s.isActive) return map;
    const key = `${s.size}||${s.color}`;
    if (!map[key]) {
      map[key] = {
        size: s.size,
        color: s.color,
        totalQuantity: 0,
        minPrice: Number(s.price) || 0,
        stockIds: [],
      };
    }
    map[key].totalQuantity += Number(s.quantity) || 0;
    map[key].minPrice = Math.min(map[key].minPrice, Number(s.price) || map[key].minPrice);
    map[key].stockIds.push(s.id);
    return map;
  }, {});

  const aggregatedStocks: AggStock[] = Object.values(aggregatedMap);

  // Set initial selections when stocks are loaded
  useEffect(() => {
    if (stocks.length > 0 && !selectedSize && !selectedColor) {
      // Use aggregated stocks to pick initial size/color when multiple rows exist
      const aggAvailableSizes = [
        ...new Set(aggregatedStocks.filter((a) => a.totalQuantity > 0).map((a) => a.size)),
      ];
      const aggAvailableColors = [
        ...new Set(aggregatedStocks.filter((a) => a.totalQuantity > 0).map((a) => a.color)),
      ];

      if (aggAvailableSizes.length > 0) setSelectedSize(aggAvailableSizes[0]);
      if (aggAvailableColors.length > 0) setSelectedColor(aggAvailableColors[0]);
    }
  }, [stocks, selectedSize, selectedColor]);

  // Get available options from stock

  const availableSizes: string[] = [
    ...new Set(aggregatedStocks.filter((a) => a.totalQuantity > 0).map((a) => a.size)),
  ];
  const availableColors: string[] = [
    ...new Set(aggregatedStocks.filter((a) => a.totalQuantity > 0).map((a) => a.color)),
  ];

  const availableColorsForSize: string[] = selectedSize
    ? [
        ...new Set(
          aggregatedStocks
            .filter((a) => a.totalQuantity > 0 && a.size === selectedSize)
            .map((a) => a.color)
        ),
      ]
    : availableColors;

  const availableSizesForColor: string[] = selectedColor
    ? [
        ...new Set(
          aggregatedStocks
            .filter((a) => a.totalQuantity > 0 && a.color === selectedColor)
            .map((a) => a.size)
        ),
      ]
    : availableSizes;

  // Representative stock (first matching row) and aggregated quantity for the selected variant
  const representativeStock = stocks.find(
    (s: Stock) => s.size === selectedSize && s.color === selectedColor && s.isActive
  );

  const aggregatedForSelected = aggregatedStocks.find(
    (a) => a.size === selectedSize && a.color === selectedColor
  );

  // Build a display stock object that keeps the representative's id/price but uses the aggregated totalQuantity
  const currentStock: Stock | undefined = (() => {
    if (representativeStock && aggregatedForSelected) {
      return { ...representativeStock, quantity: aggregatedForSelected.totalQuantity } as Stock;
    }
    if (representativeStock) return representativeStock;
    if (aggregatedForSelected) {
      // create a minimal stock-like object when no single representative row exists
      return {
        id: aggregatedForSelected.stockIds[0] || '',
        productId: productId,
        size: aggregatedForSelected.size,
        color: aggregatedForSelected.color,
        quantity: aggregatedForSelected.totalQuantity,
        price: aggregatedForSelected.minPrice,
        imageUrl: displayImage,
        isActive: true,
      } as unknown as Stock;
    }
    return undefined;
  })();

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

    const resolvedImage =
      currentStock?.imageUrl ||
      (product as any)?.imageUrl ||
      (product as any)?.image ||
      (product as any)?.imageurl ||
      displayImage ||
      '';

    const cartItem: CartItem = {
      stockId: currentStock.id,
      productId: product!.id,
      productName: product!.name,
      productImage: resolvedImage,
      price: currentStock.price,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      maxQuantity: currentStock.quantity,
      addedAt: new Date().toISOString(),
    };

    const doAdd = async () => {
      try {
        if (authService.isAuthenticated()) {
          await cartService.addToServerCart(cartItem);
        } else {
          cartService.addItem(cartItem);
        }
        navigate('/cart');
      } catch (error) {
        console.error('Failed to add to cart:', error);

        // Prefer the server-provided message when available
        const serverMessage = (error as any)?.message || (error as any)?.body?.message;
        const alertMessage = serverMessage || 'Failed to add to cart. Please try again.';

        // Show a more specific message to the user
        alert(alertMessage);
      }
    };

    void doAdd();
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
        const wishlistResolvedImage =
          currentStock?.imageUrl ||
          (product as any)?.imageUrl ||
          (product as any)?.image ||
          (product as any)?.imageurl ||
          displayImage ||
          '';

        const wishlistItem: WishlistItem = {
          stockId: currentStock.id,
          productId: product!.id,
          productName: product!.name,
          productImage: wishlistResolvedImage,
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
        const wishlistResolvedImage =
          (product as any)?.imageUrl || (product as any)?.image || (product as any)?.imageurl || displayImage || '';

        const wishlistItem: WishlistItem = {
          stockId: product!.id,
          productId: product!.id,
          productName: product!.name,
          productImage: wishlistResolvedImage,
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
    if (!reviewComment.trim() || reviewRating === 0) {
      alert('Please fill in all fields');
      return;
    }

    if (!authService.isAuthenticated() || !currentUserId) {
      alert('Please log in to submit a review');
      return;
    }

    try {
      const newReview = await reviewService.createReview({
        productId: productId,
        userId: currentUserId,
        rating: reviewRating,
        comment: reviewComment,
        imageUrl: reviewImageUrl || undefined,
      });

      setReviews([newReview, ...reviews]);
      setReviewRating(0);
      setReviewComment('');
      setReviewImageUrl('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      const err = error as unknown as { body?: { message?: string }; message?: string };
      const serverMessage = err?.body?.message || err?.message || 'Failed to submit review. Please try again.';
      alert(serverMessage);
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
                currentStock={currentStock}
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
                  {aggregatedStocks
                    .filter((a) => a.totalQuantity > 0)
                    .map((a) => (
                      <Typography key={a.stockIds.join('-')} variant="caption" sx={{ color: colors.text.gray }}>
                        {a.size} - {a.color}: {a.totalQuantity} available (£{Number(a.minPrice).toFixed(2)})
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
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          reviewImageUrl={reviewImageUrl}
          setReviewImageUrl={setReviewImageUrl}
          onSubmitReview={handleSubmitReview}
        />
      </Container>
    </Box>
  );
};

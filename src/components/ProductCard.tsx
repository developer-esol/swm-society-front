import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, removeItem, getWishlist } = useWishlist();
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    // Check if any stock of this product is in wishlist
    const wishlist = getWishlist();
    const isProductInWishlist = wishlist.items.some(item => item.productId === product.id);
    setInWishlist(isProductInWishlist);
  }, [product.id, getWishlist]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wishlist = getWishlist();
    const productInWishlist = wishlist.items.find(item => item.productId === product.id);
    
    if (productInWishlist) {
      removeItem(productInWishlist.stockId);
      setInWishlist(false);
    } else {
      // Try to add first available stock variant
      if (product.stocks && product.stocks.length > 0) {
        const stock = product.stocks[0];
        addItem({
          stockId: stock.id,
          productId: product.id,
          productName: product.name,
          productImage: product.image || '',
          price: stock.price,
          color: stock.color,
          size: stock.size,
          quantity: 1, // Default quantity
          maxQuantity: stock.quantity, // Available stock for this size/color
          addedAt: new Date().toISOString(),
        });
        setInWishlist(true);
      } else {
        // Fallback if no stocks available
        addItem({
          stockId: `${product.id}-default`,
          productId: product.id,
          productName: product.name,
          productImage: product.image || '',
          price: product.price,
          color: 'Default',
          size: 'One Size',
          quantity: 1,
          maxQuantity: 99, // Default max when stock info unavailable
          addedAt: new Date().toISOString(),
        });
        setInWishlist(true);
      }
    }
  };
  return (
    <Card
      component={Link}
      to={`/product/${product.id}`}
      sx={{
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="300"
          image={product.image}
          alt={product.name}
          sx={{
            objectFit: 'cover',
          }}
        />
        <IconButton
          onClick={handleWishlistClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: inWishlist ? '#dc2626' : 'grey.400',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: '#dc2626',
            }
          }}
        >
          {inWishlist ? <Favorite sx={{ fontSize: 24 }} /> : <FavoriteBorder sx={{ fontSize: 24 }} />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            mb: 1,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>
        
        <Box sx={{ mb: 1 }}>
          <Chip
            label={product.brandName}
            size="small"
            sx={{
              fontSize: '0.75rem',
              height: 20,
              bgcolor: 'grey.100',
              color: 'grey.700',
            }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'black',
            mt: 'auto',
          }}
        >
          £{product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};
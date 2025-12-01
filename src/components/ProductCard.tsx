import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
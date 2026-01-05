import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { ProductDetailsPageComponent } from '../features/productdetails';
import type { Product } from '../types';

const ProductDetails: React.FC = () => {
  const location = useLocation();
  const product = location.state?.product as Product | undefined;

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  return <ProductDetailsPageComponent productId={product.id} />;
};

export default ProductDetails;

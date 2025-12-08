import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetailsPageComponent } from '../features/productdetails';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  if (!productId) {
    return <div>No product ID provided</div>;
  }

  return <ProductDetailsPageComponent productId={productId} />;
};

export default ProductDetails;

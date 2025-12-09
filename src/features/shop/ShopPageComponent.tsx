import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useProductsByCollection } from '../../hooks/useProducts';
import type { Product } from '../../types';
import { ShopFilter } from './ShopFilter';
import { ProductsGrid } from './ProductsGrid';

export const ShopPageComponent: React.FC = () => {
  const location = useLocation();
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Parse the collection from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const collection = params.get('collection');
    console.log('ShopPage: URL params:', params.toString());
    console.log('ShopPage: Collection from URL:', collection);
    setActiveCollection(collection);
  }, [location.search]);

  // Use the new hook to fetch products by collection from the real API
  const productsQuery = useProductsByCollection(activeCollection);
  
  const allProducts: Product[] = productsQuery.data || [];
  const isLoading = productsQuery.isLoading;
  const error = productsQuery.error;

  console.log('ShopPage: Active collection:', activeCollection);
  console.log('ShopPage: Products query state:', {
    isLoading,
    error: error?.message,
    dataLength: allProducts.length
  });
  console.log('ShopPage: All products:', allProducts);

  // Filter products
  let filteredProducts = allProducts;

  // Filter by price range
  filteredProducts = filteredProducts.filter(
    (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  // Filter by sizes (if product has tags that include sizes)
  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedSizes.some((size) => product.tags.includes(size.toLowerCase()))
    );
  }

  // Filter by colors (if product has tags that include colors)
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedColors.some(
        (color) =>
          product.tags.includes(color.toLowerCase()) ||
          product.name.toLowerCase().includes(color.toLowerCase())
      )
    );
  }

  // Sort products
  switch (sortBy) {
    case 'price-low-high':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high-low':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      // 'featured' - keep default order
      break;
  }

  // Collection titles and descriptions - fallback for unknown collections
  const collectionInfo: Record<string, { title: string; description: string }> = {
    "Project ZerO's": {
      title: "Project ZerO's Collection",
      description: 'Discover our latest collection designed to support young students in their transition from primary to secondary school.',
    },
    'Thomas Mushet': {
      title: 'Thomas Mushet Collection',
      description: 'Urban style meets athletic inspiration in this contemporary collection.',
    },
    'Hear My Voice': {
      title: 'Hear My Voice Collection',
      description: 'A collection that celebrates authenticity and self-expression.',
    },
  };

  // Get the title and description based on active collection
  const title = activeCollection && collectionInfo[activeCollection]
    ? collectionInfo[activeCollection].title
    : activeCollection 
    ? `${activeCollection} Collection`
    : 'All Collections';
    
  const description = activeCollection && collectionInfo[activeCollection]
    ? collectionInfo[activeCollection].description
    : activeCollection 
    ? `Discover our exclusive ${activeCollection} collection.`
    : 'Browse our complete range of collections.';

  // Get unique sizes and colors for filter options (from product tags and names)
  const allSizes = Array.from(new Set(['S', 'M', 'L', 'XL', 'XXL']));
  const allColors = Array.from(new Set(['Red', 'Blue', 'Black', 'White', 'Orange']));

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 200]);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error('Shop page error:', error);
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography color="error">
          {activeCollection 
            ? `Unable to load ${activeCollection} products. Please check your connection and try again.`
            : 'Unable to load products. Please check your connection and try again.'
          }
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white', width: '100%', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Box>

        {/* Filter Component */}
        <ShopFilter
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allSizes={allSizes}
          allColors={allColors}
          clearAllFilters={clearAllFilters}
        />

        {/* Products Grid Component */}
        {filteredProducts.length === 0 && !isLoading && !error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {activeCollection 
                ? `No products found for ${activeCollection}`
                : 'No products found'
              }
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {activeCollection 
                ? `There are currently no products available in the ${activeCollection} collection.`
                : 'Try adjusting your filters or check back later.'
              }
            </Typography>
          </Box>
        ) : (
          <ProductsGrid products={filteredProducts} clearAllFilters={clearAllFilters} />
        )}
      </Container>
    </Box>
  );
};

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useHMVProduct, useProjectZeroProduct, useProjectThomasMushetProduct } from '../../hooks/useProducts';
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
    setActiveCollection(collection);
  }, [location.search]);

  // Conditionally enable hooks based on the collection
  const shouldLoadHMV = activeCollection === 'Hear My Voice' || !activeCollection;
  const shouldLoadProjectZero = activeCollection === "Project ZerO's" || !activeCollection;
  const shouldLoadThomasMushet = activeCollection === 'Thomas Mushet' || !activeCollection;

  const hmvQuery = useHMVProduct(shouldLoadHMV);
  const projectZeroQuery = useProjectZeroProduct(shouldLoadProjectZero);
  const thomasMushetQuery = useProjectThomasMushetProduct(shouldLoadThomasMushet);

  // Determine which products to use based on active collection
  let allProducts: Product[] = [];
  let isLoading = false;
  let error: Error | null = null;

  if (activeCollection === 'Hear My Voice') {
    allProducts = hmvQuery.data || [];
    isLoading = hmvQuery.isLoading;
    error = hmvQuery.error;
  } else if (activeCollection === "Project ZerO's") {
    allProducts = projectZeroQuery.data || [];
    isLoading = projectZeroQuery.isLoading;
    error = projectZeroQuery.error;
  } else if (activeCollection === 'Thomas Mushet') {
    allProducts = thomasMushetQuery.data || [];
    isLoading = thomasMushetQuery.isLoading;
    error = thomasMushetQuery.error;
  } else {
    // Show all products when no specific collection is selected
    allProducts = [
      ...(hmvQuery.data || []),
      ...(projectZeroQuery.data || []),
      ...(thomasMushetQuery.data || []),
    ];
    isLoading = hmvQuery.isLoading || projectZeroQuery.isLoading || thomasMushetQuery.isLoading;
    error = hmvQuery.error || projectZeroQuery.error || thomasMushetQuery.error;
  }

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

  // Collection titles and descriptions
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
  const title =
    activeCollection && collectionInfo[activeCollection]
      ? collectionInfo[activeCollection].title
      : 'All Collections';
  const description =
    activeCollection && collectionInfo[activeCollection]
      ? collectionInfo[activeCollection].description
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography color="error">Error loading products. Please try again.</Typography>
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
        <ProductsGrid products={filteredProducts} clearAllFilters={clearAllFilters} />
      </Container>
    </Box>
  );
};

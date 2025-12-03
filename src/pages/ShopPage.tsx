import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  Collapse,
  Slider,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import { ExpandMore, FilterList } from '@mui/icons-material';
import { ProductCard } from '../components';
import { useLocation } from 'react-router-dom';
import { useHMVProduct, useProjectZeroProduct, useProjectThomasMushetProduct } from '../hooks/useProducts';
import { colors } from '../theme';
import type { Product } from '../types';

const Shop: React.FC = () => {
  const location = useLocation();
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      ...(thomasMushetQuery.data || [])
    ];
    isLoading = hmvQuery.isLoading || projectZeroQuery.isLoading || thomasMushetQuery.isLoading;
    error = hmvQuery.error || projectZeroQuery.error || thomasMushetQuery.error;
  }

  // Filter products
  let filteredProducts = allProducts;

  // Filter by price range
  filteredProducts = filteredProducts.filter(product => 
    product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  // Filter by sizes (if product has tags that include sizes)
  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      selectedSizes.some(size => product.tags.includes(size.toLowerCase()))
    );
  }

  // Filter by colors (if product has tags that include colors)
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      selectedColors.some(color => product.tags.includes(color.toLowerCase()) || product.name.toLowerCase().includes(color.toLowerCase()))
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
      description: 'Discover our latest collection designed to support young students in their transition from primary to secondary school.'
    },
    'Thomas Mushet': {
      title: 'Thomas Mushet Collection',
      description: 'Urban style meets athletic inspiration in this contemporary collection.'
    },
    'Hear My Voice': {
      title: 'Hear My Voice Collection',
      description: 'A collection that celebrates authenticity and self-expression.'
    }
  };

  // Get the title and description based on active collection
  const title = activeCollection && collectionInfo[activeCollection] 
    ? collectionInfo[activeCollection].title 
    : 'All Collections';
  const description = activeCollection && collectionInfo[activeCollection] 
    ? collectionInfo[activeCollection].description 
    : 'Browse our complete range of collections.';

  // Get unique sizes and colors for filter options (from product tags and names)
  const allSizes = Array.from(new Set(['S', 'M', 'L', 'XL', 'XXL']));
  const allColors = Array.from(new Set(['Red', 'Blue', 'Black', 'White', 'Orange']));

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

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

        {/* Filter and Sort Controls */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 4,
          gap: 2
        }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            endIcon={<ExpandMore sx={{ 
              transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} />}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            sx={{
              bgcolor: colors.background.lighter,
              borderColor: colors.border.light,
              color: colors.text.primary,
              '&:hover': {
                bgcolor: colors.background.light,
                borderColor: colors.border.default,
              }
            }}
          >
            Filter
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sort by:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border.light,
                  }
                }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low-high">Price: Low to High</MenuItem>
                <MenuItem value="price-high-low">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Filters Panel */}
        <Collapse in={isFilterOpen}>
          <Paper sx={{ p: 3, mb: 4, bgcolor: colors.background.lighter }}>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4
            }}>
              {/* Price Range Filter */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                  Price Range
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `£${value}`}
                    min={0}
                    max={200}
                    sx={{
                      color: colors.text.primary,
                      '& .MuiSlider-thumb': {
                        bgcolor: colors.text.primary,
                      },
                      '& .MuiSlider-track': {
                        bgcolor: colors.text.primary,
                      },
                      '& .MuiSlider-rail': {
                        bgcolor: colors.border.light,
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">£{priceRange[0]}</Typography>
                    <Typography variant="body2">£{priceRange[1]}</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Size Filter */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                  Size
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allSizes.map(size => (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => toggleSize(size)}
                      sx={{
                        bgcolor: selectedSizes.includes(size) ? colors.button.primary : colors.background.lighter,
                        color: selectedSizes.includes(size) ? colors.text.secondary : colors.text.gray,
                        border: selectedSizes.includes(size) ? `2px solid ${colors.button.primary}` : `1px solid ${colors.border.default}`,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: selectedSizes.includes(size) ? colors.button.primaryHover : colors.border.default,
                          borderColor: colors.button.primary,
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Color Filter */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
                  Color
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allColors.map(color => (
                    <Chip
                      key={color}
                      label={color}
                      onClick={() => toggleColor(color)}
                      sx={{
                        bgcolor: selectedColors.includes(color) ? colors.button.primary : colors.background.lighter,
                        color: selectedColors.includes(color) ? colors.text.secondary : colors.text.gray,
                        border: selectedColors.includes(color) ? `2px solid ${colors.button.primary}` : `1px solid ${colors.border.default}`,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: selectedColors.includes(color) ? colors.button.primaryHover : colors.border.default,
                          borderColor: colors.button.primary,
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Collapse>

        {/* Product Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3
        }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              No products match your filters.
            </Typography>
            <Button
              onClick={clearAllFilters}
              sx={{
                color: colors.button.primary,
                '&:hover': {
                  color: colors.button.primaryHover,
                  bgcolor: 'rgba(220, 38, 38, 0.04)', // Red background tint
                }
              }}
            >
              Clear all filters
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Shop;
import React from 'react';
import { Box, Button, Collapse, Paper, Slider, Typography, Chip, FormControl, Select, MenuItem } from '@mui/material';
import { ExpandMore, FilterList } from '@mui/icons-material';
import { colors } from '../../theme';

interface FilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  allSizes: string[];
  allColors: string[];
}

export const ShopFilter: React.FC<FilterProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  priceRange,
  setPriceRange,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  sortBy,
  setSortBy,
  allSizes,
  allColors,
}) => {
  const toggleSize = (size: string) => {
    setSelectedSizes(
      selectedSizes.includes(size)
        ? selectedSizes.filter(s => s !== size)
        : [...selectedSizes, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color)
        ? selectedColors.filter(c => c !== color)
        : [...selectedColors, color]
    );
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  return (
    <Box>
      {/* Filter and Sort Controls */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 4,
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          endIcon={
            <ExpandMore
              sx={{
                transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          }
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          sx={{
            bgcolor: colors.background.lighter,
            borderColor: colors.border.light,
            color: colors.text.primary,
            '&:hover': {
              bgcolor: colors.background.light,
              borderColor: colors.border.default,
            },
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
                },
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
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
                    },
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
                {allSizes.map((size) => (
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
                      },
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
                {allColors.map((color) => (
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
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

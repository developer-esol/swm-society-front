import { Box, TextField, Button } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { colors } from '../../../theme'

interface ProductTableHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
  onAddProduct: () => void
}

const ProductTableHeader = ({ searchQuery, onSearch, onAddProduct }: ProductTableHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <TextField
        placeholder="Search Products..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        variant="outlined"
        size="small"
        sx={{
          flex: 1,
          maxWidth: '350px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            bgcolor: colors.background.default,
          },
        }}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ fontSize: '1.2rem', color: colors.button.primary }} />
            </Box>
          ),
        }}
      />

      <Button
        variant="contained"
        onClick={onAddProduct}
        sx={{
          bgcolor: colors.button.primary,
          color: colors.text.secondary,
          px: 3,
          borderRadius: '4px',
          '&:hover': {
            bgcolor: colors.button.primaryHover,
          },
        }}
      >
        Add Product
      </Button>
    </Box>
  )
}

export default ProductTableHeader

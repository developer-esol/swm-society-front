import { Box, TextField, Button } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { colors } from '../../../theme'

interface StockTableHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
  onAddStock: () => void
}

const StockTableHeader = ({ searchQuery, onSearch, onAddStock }: StockTableHeaderProps) => {
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

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={onAddStock}
          sx={{
            borderColor: colors.button.primary,
            color: colors.button.primary,
            px: 3,
            borderRadius: '4px',
            '&:hover': {
              borderColor: colors.button.primaryHover,
              bgcolor: `${colors.button.primary}10`,
            },
          }}
        >
          Add Bulk
        </Button>
        <Button
          variant="contained"
          onClick={onAddStock}
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
          Add Stock
        </Button>
      </Box>
    </Box>
  )
}

export default StockTableHeader

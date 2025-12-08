import { Box, TextField, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from 'lucide-react'
import { colors } from '../../../theme'

interface SalesTableHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
}

const SalesTableHeader = ({ searchQuery, onSearch }: SalesTableHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <TextField
        placeholder="Search Sales..."
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
            '& fieldset': {
              borderColor: colors.border.default,
            },
            '&:hover fieldset': {
              borderColor: colors.border.default,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.border.default,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon size={18} color={colors.button.primary} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}

export default SalesTableHeader

import React from 'react'
import { Box, TextField } from '@mui/material'
import { Search as SearchIcon } from 'lucide-react'
import { colors } from '../../../theme'

interface RolesHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
}

const RolesHeader: React.FC<RolesHeaderProps> = ({ searchQuery, onSearch }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
      <TextField
        placeholder="Search roles..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        variant="outlined"
        color='#000000'
        size="small"
        sx={{
          width: { xs: '100%', sm: '350px' },
          '& .MuiOutlinedInput-root': {
            borderRadius: '24px',
            bgcolor: colors.background.default,
            '& fieldset': {
              borderColor: colors.border.default,
            },
            '&:hover fieldset': {
              borderColor: colors.border.default,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.border.default,
              borderWidth: '1px',
            },
          },
          '& .MuiOutlinedInput-input': {
            fontSize: '0.95rem',
            color: colors.text.primary,
            paddingLeft: '12px',
            '&::placeholder': {
              color: colors.text.secondary,
              opacity: 0.7,
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={18} color={colors.button.primary} strokeWidth={2.5} />
            </Box>
          ),
        }}
      />
    </Box>
  )
}

export default RolesHeader

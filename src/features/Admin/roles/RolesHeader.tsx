import React from 'react'
import { Box, TextField, IconButton, Button } from '@mui/material'
import { Search as SearchIcon } from 'lucide-react'
import { colors } from '../../../theme'

interface RolesHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
  onCreateRole?: () => void
}

const RolesHeader: React.FC<RolesHeaderProps> = ({ searchQuery, onSearch, onCreateRole }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          size="small"
          sx={{
            width: 250,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              bgcolor: colors.background.default,
            },
          }}
        />
        <IconButton
          sx={{
            bgcolor: '#C62C2B',
            color: 'white',
            borderRadius: 1,
            width: 40,
            height: 40,
            ml: 1,
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              bgcolor: '#A82421',
            },
          }}
        >
          <SearchIcon size={18} />
        </IconButton>
      </Box>
    </Box>
  )
}

export default RolesHeader

import { Box, TextField} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { colors } from '../../../theme'

interface CommunityPostTableHeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
}

const CommunityPostTableHeader = ({ searchQuery, onSearch }: CommunityPostTableHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <TextField
        placeholder="Search Community Posts..."
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
    </Box>
  )
}

export default CommunityPostTableHeader

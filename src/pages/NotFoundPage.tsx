import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { colors } from '../theme'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: colors.background.default,
      }}
    >
      <Typography variant="h1" sx={{ color: colors.text.primary, fontWeight: 700, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: colors.text.secondary, mb: 4 }}>
        Page Not Found
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ bgcolor: colors.button.primary, '&:hover': { bgcolor: colors.button.primaryHover } }}
      >
        Go Back Home
      </Button>
    </Box>
  )
}

export default NotFoundPage

import { Box, Paper, Typography } from '@mui/material'
import { ShoppingBag, ShoppingCart, TrendingUp } from '@mui/icons-material'
import { colors } from '../../../theme'
import type { StatBox } from '../../../types/Admin'

interface StatBoxesProps {
  items: StatBox[]
}

const StatBoxes = ({ items }: StatBoxesProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
      {items.map((item, index) => (
        <Paper
          key={index}
          sx={{
            p: 3,
            bgcolor: colors.background.default,
            border: `1px solid ${colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: '#E53935',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text.secondary }}>
              {item.icon === 'shopping_bag' && <ShoppingBag sx={{ fontSize: '1.8rem' }} />}
              {item.icon === 'shopping_cart' && <ShoppingCart sx={{ fontSize: '1.8rem' }} />}
              {item.icon === 'trending_up' && <TrendingUp sx={{ fontSize: '1.8rem' }} />}
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: colors.text.disabled, fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              {item.label}
            </Typography>
            <Typography variant="h6" sx={{ color: colors.text.primary, fontWeight: 700, mt: 0.5 }}>
              {item.value}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  )
}

export default StatBoxes

import { Box, Paper, Typography } from '@mui/material'
import { colors } from '../../../theme'
import type { LocationData } from '../../../types/Admin'

interface RevenueByLocationProps {
  data: LocationData[]
}

const RevenueByLocation = ({ data }: RevenueByLocationProps) => {
  const maxSales = Math.max(...data.map((d) => d.sales));

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: colors.background.default,
        border: `2px solid ${colors.button.primary}`,
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary, mb: 3 }}>
        Revenue by Location
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, justifyContent: 'center', width: '100%' }}>
          {data.map((location, idx) => (
            <Box key={idx} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Box sx={{ width: '100%', height: `${(location.sales / maxSales) * 150}px`, bgcolor: colors.button.primary, borderRadius: '4px', opacity: 0.6 + (idx * 0.12) }} />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 2, width: '100%', textAlign: 'center' }}>
          {data.map((location, idx) => (
            <Box key={idx}>
              <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'block', fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
                {location.city}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700, fontSize: '0.85rem' }}>
                {location.sales}K
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default RevenueByLocation;

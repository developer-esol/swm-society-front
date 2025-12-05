import { Box, Paper, Typography } from '@mui/material'
import { colors } from '../../../theme'

const SalesRevenue = () => {
  const dailyData = [24000, 22100, 22900, 20000, 21810, 25000, 21000]

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: colors.background.default,
        border: `2px solid ${colors.button.primary}`,
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary, mb: 2 }}>
        Sales Revenue
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
          <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 700 }}>
            Current Week
          </Typography>
          <Typography sx={{  color: colors.text.primary, fontWeight: 700 }}>
            ${(dailyData.reduce((a, b) => a + b, 0) / 100).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: colors.text.disabled }}>
          Previous Week $15,680
        </Typography>
      </Box>

      <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 1.5, justifyContent: 'space-between', pt: 2, borderTop: `1px solid ${colors.border.default}`, px: 1 }}>
        {dailyData.map((value, idx) => {
          const maxValue = Math.max(...dailyData)
          return (
            <Box
              key={idx}
              sx={{
                flex: 1,
                height: `${(value / maxValue) * 100}%`,
                bgcolor: colors.button.primary,
                borderRadius: '2px 2px 0 0',
                opacity: 0.6 + (idx / 7) * 0.4,
              }}
            />
          )
        })}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1.5, mt: 3, textAlign: 'center' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <Typography key={day} variant="caption" sx={{ color: colors.text.disabled, fontSize: '0.75rem' }}>
            {day}
          </Typography>
        ))}
      </Box>
    </Paper>
  )
}

export default SalesRevenue

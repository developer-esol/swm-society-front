import { Box, Paper, Typography } from '@mui/material'
import { colors } from '../../../theme'
import type { SalesChartData } from '../../../types/Admin'

interface TotalSalesProps {
  data: SalesChartData[]
}

const TotalSales = ({ data }: TotalSalesProps) => {
  const chartColors = [colors.chart.primary, colors.chart.secondary, colors.chart.tertiary, colors.chart.quaternary]
  const radius = 60
  const circumference = 2 * Math.PI * radius

  let currentOffset = 0
  const segments = data.map((item, idx) => {
    const offset = currentOffset
    currentOffset += (item.percentage / 100) * circumference
    return { ...item, offset, color: chartColors[idx] }
  })

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
        Total Sales
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Box sx={{ position: 'relative', width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            {segments.map((segment, idx) => (
              <circle
                key={idx}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={`${(segment.percentage / 100) * circumference} ${circumference}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <Typography variant="body2" sx={{ color: colors.text.primary, fontWeight: 600 }}>
              Total
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, width: '100%' }}>
          {segments.map((segment, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: segment.color, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
                  {segment.label}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.disabled, fontSize: '0.65rem' }}>
                  ${segment.value.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

export default TotalSales

import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { Star as StarIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { CustomerLoyaltyData } from '../../../types/Admin/loyalty'

interface CustomerInfoBoxProps {
  customerData: CustomerLoyaltyData
}

const StatBox: React.FC<{
  title: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
}> = ({ title, value, icon, color, bgColor }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: '8px',
      border: `1px solid ${colors.border.default}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: '#3d3939ff',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color,
          lineHeight: 1.2,
          textAlign: 'center',
        }}
      >
        {value.toLocaleString()}
      </Typography>
    </Box>
  </Paper>
)

const CustomerInfoBox: React.FC<CustomerInfoBoxProps> = ({ customerData }) => {
  return (
    <Box>
      {/* Customer Name and ID - Outside Box */}
      <Box sx={{ mb: 2 }}>
        <Typography
          sx={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: colors.text.primary,
            mb: 0.25,
          }}
        >
          {customerData.customerName}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.9rem',
            color: colors.text.primary,
          }}
        >
          {customerData.customerId}
        </Typography>
      </Box>

      {/* Main Customer Info Container */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: '8px',
          border: `1px solid ${colors.border.default}`,
          display: 'flex',
          gap: { xs: 2, sm: 3 },
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {/* Middle: 3 Stat Boxes in Row */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flex: 1.5,
            justifyContent: 'space-between',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          <Box sx={{ flex: 1, minWidth: '140px' }}>
            <StatBox
              title="Available Points"
              value={customerData.availablePoints}
              icon={<StarIcon size={20} />}
              color={colors.loyalty.primary}
              bgColor={`${colors.loyalty.primary}20`}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '140px' }}>
            <StatBox
              title="Points Issued"
              value={customerData.totalPoints}
              icon={<TrendingUpIcon size={20} />}
              color={colors.status.success}
              bgColor={`${colors.status.success}20`}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '140px' }}>
            <StatBox
              title="Points Redeemed"
              value={customerData.pointsRedeemed}
              icon={<TrendingDownIcon size={20} />}
              color={colors.status.error}
              bgColor={`${colors.status.error}20`}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default CustomerInfoBox


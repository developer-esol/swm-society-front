import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { TrendingUp, CardGiftcard } from '@mui/icons-material';
import { colors } from '../../theme';
import type { LoyaltyWallet } from '../../types/loyalty';

interface LoyaltyStatsOverviewProps {
  loyaltyData: LoyaltyWallet;
}

export const LoyaltyStatsOverview: React.FC<LoyaltyStatsOverviewProps> = ({ loyaltyData }) => {
  return (
    <Box>
      {/* Header with Expiring Soon */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Loyalty Rewards Program
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Track your points and gain exclusive benefits
          </Typography>
        </Box>
        
        {/* Expiring Soon Box */}
        <Box sx={{
          bgcolor: colors.loyalty.yellow,
          border: `1px solid ${colors.loyalty.yellowBorder}`,
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          minWidth: '280px',
          flexShrink: 0,
        }}>
          <Box sx={{ fontSize: '24px' }}>⏰</Box>
          <Box>
            <Typography variant="body2" sx={{ color: colors.loyalty.tertiary, fontWeight: 600, mb: 0.5 }}>
              Expiring Soon
            </Typography>
            <Typography variant="h6" sx={{ color: colors.loyalty.primary, fontWeight: 700 }}>
              350 points
            </Typography>
            <Typography variant="caption" sx={{ color: colors.loyalty.secondary }}>
              Expires on March 15, 2025
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Stats Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
      }}>
        {/* Available Points Card */}
        <Card sx={{
          background: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',
          color: colors.text.secondary,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
        }}>
          <Box sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }} />
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Available Points
              </Typography>
              <Typography sx={{ fontSize: '24px' }}>⭐</Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {loyaltyData.totalPoints.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Worth £{(loyaltyData.totalPoints / 100).toFixed(2)} in rewards
            </Typography>
          </CardContent>
        </Card>

        {/* Total Earned Card */}
        <Card sx={{
          bgcolor: colors.background.paper,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 3
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text.disabled, fontWeight: 500 }}>
                  Total Earned
                </Typography>
              </Box>
              <TrendingUp sx={{ color: colors.loyalty.green, fontSize: '28px' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.text.dark, mb: 1 }}>
              {loyaltyData.totalEarned.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.loyalty.greenDark, fontWeight: 500 }}>
              +450 this month
            </Typography>
          </CardContent>
        </Card>

        {/* Total Redeemed Card */}
        <Card sx={{
          bgcolor: colors.background.paper,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 3
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text.disabled, fontWeight: 500 }}>
                  Total Redeemed
                </Typography>
              </Box>
              <Box sx={{
                width: 40,
                height: 40,
                bgcolor: colors.loyalty.lightRed,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CardGiftcard sx={{ color: colors.loyalty.primary, fontSize: '24px' }} />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.text.dark, mb: 1 }}>
              {loyaltyData.totalRedeemed.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.button.primary, fontWeight: 500 }}>
              Last: 2 days ago
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

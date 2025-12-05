import React, { useEffect, useState } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { Typography } from '@mui/material';
import { loyaltyService } from '../../api/services/loyaltyService';
import { colors } from '../../theme';
import type { LoyaltyWallet } from '../../types/loyalty';
import { LoyaltyStatsOverview } from './LoyaltyStatsOverview';
import { PointsHistory } from './PointsHistory';

export const LoyaltyWalletPageComponent: React.FC = () => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        setIsLoading(true);
        const data = await loyaltyService.getLoyaltyWallet();
        setLoyaltyData(data);
      } catch (err) {
        setError('Failed to load loyalty wallet data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyData();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !loyaltyData) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error">{error || 'Failed to load loyalty data'}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.background.default, width: '100%', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Stats Overview */}
        <LoyaltyStatsOverview loyaltyData={loyaltyData} />
        
        {/* Points History Section */}
        <Box sx={{ mt: 6 }}>
          <PointsHistory loyaltyData={loyaltyData} />
        </Box>
      </Container>
    </Box>
  );
};

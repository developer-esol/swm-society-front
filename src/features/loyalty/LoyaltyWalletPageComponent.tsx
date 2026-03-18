import React, { useEffect, useState } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { Typography } from '@mui/material';
import { useLoyaltyBalance, useLoyaltyHistory } from '../../hooks/useLoyalty';
import { loyaltyService } from '../../api/services/loyaltyService';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme';
import { LoyaltyStatsOverview } from './LoyaltyStatsOverview';
import { PointsHistory } from './PointsHistory';
import { Leaderboard } from './Leaderboard';

export const LoyaltyWalletPageComponent: React.FC = () => {
  const { user } = useAuthStore();
  
  // Use React Query hooks for automatic cache invalidation
  const { data: balance, isLoading: isLoadingBalance, error: balanceError } = useLoyaltyBalance(user?.id);
  const { data: historyData, isLoading: isLoadingHistory, error: historyError } = useLoyaltyHistory(user?.id);
  
  // Fetch leaderboard data
  const [leaderboardUsers, setLeaderboardUsers] = useState<any[]>([]);
  const [, setIsLoadingLeaderboard] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log('Fetching leaderboard data...');
        const data = await loyaltyService.getLeaderboard();
        console.log('Leaderboard data received:', data);
        console.log('Leaderboard data length:', data?.length);
        console.log('Is array?', Array.isArray(data));
        console.log('First user:', data?.[0]);
        setLeaderboardUsers(data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLeaderboardUsers([]);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isLoading = isLoadingBalance || isLoadingHistory;
  const error = balanceError || historyError;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !balance) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error">{error ? String(error) : 'Failed to load loyalty data'}</Typography>
        </Box>
      </Container>
    );
  }

  const transactions = historyData?.transactions || [];

  // Convert balance data to match the expected format
  const loyaltyData = {
    userId: user?.id || '',
    totalPoints: balance.availablePoints,
    totalEarned: balance.totalEarned,
    totalRedeemed: balance.totalRedeemed,
    lastUpdated: new Date().toISOString(),
    transactions: transactions,
  };

  return (
    <Box sx={{ bgcolor: colors.background.default, width: '100%', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Stats Overview */}
        <LoyaltyStatsOverview loyaltyData={loyaltyData} leaderboardUsers={leaderboardUsers} currentUserId={user?.id} />
        
        {/* Points History Section */}
        <Box sx={{ mt: 6 }}>
          <PointsHistory loyaltyData={loyaltyData} />
        </Box>
      </Container>
    </Box>
  );
};

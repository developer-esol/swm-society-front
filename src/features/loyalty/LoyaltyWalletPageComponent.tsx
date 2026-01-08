import React, { useEffect, useState } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { Typography } from '@mui/material';
import { loyaltyService } from '../../api/services/loyaltyService';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme';
import type { LoyaltyBalance, LoyaltyTransaction } from '../../types/loyalty';
import { LoyaltyStatsOverview } from './LoyaltyStatsOverview';
import { PointsHistory } from './PointsHistory';

export const LoyaltyWalletPageComponent: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [balance, setBalance] = useState<LoyaltyBalance | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      // If no user yet, just keep loading (auth might still be initializing)
      if (!user?.id) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch balance and transaction history in parallel
        const [balanceData, historyData] = await Promise.all([
          loyaltyService.getUserBalance(user.id),
          loyaltyService.getTransactionHistory(user.id),
        ]);
        
        console.log('Balance data:', balanceData);
        console.log('History data:', historyData);
        console.log('Transactions array:', historyData.transactions);
        console.log('Transactions count:', historyData.transactions?.length || 0);
        
        setBalance(balanceData);
        setTransactions(historyData.transactions || []);
        
        if (!historyData.transactions || historyData.transactions.length === 0) {
          console.warn('No transactions found for user:', user.id);
          console.log('This could mean:');
          console.log('1. User has no transaction history yet');
          console.log('2. API is not returning transactions');
          console.log('3. Transaction mapping failed in loyaltyService');
        } else {
          console.log('✅ Successfully loaded', historyData.transactions.length, 'transactions');
          console.log('Sample transaction:', historyData.transactions[0]);
        }
      } catch (err) {
        setError('Failed to load loyalty wallet data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [user?.id]);

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

  if (error || !balance) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error">{error || 'Failed to load loyalty data'}</Typography>
        </Box>
      </Container>
    );
  }

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
        <LoyaltyStatsOverview loyaltyData={loyaltyData} />
        
        {/* Points History Section */}
        <Box sx={{ mt: 6 }}>
          <PointsHistory loyaltyData={loyaltyData} />
        </Box>
      </Container>
    </Box>
  );
};

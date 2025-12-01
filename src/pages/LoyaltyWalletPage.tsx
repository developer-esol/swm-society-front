import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { Add, Remove, TrendingUp, CardGiftcard } from '@mui/icons-material';
import { loyaltyService } from '../api/services/loyaltyService';
import type { LoyaltyWallet, LoyaltyTransaction } from '../types/loyalty';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`loyalty-tabpanel-${index}`}
      aria-labelledby={`loyalty-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const LoyaltyWalletPage: React.FC = () => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // Load loyalty wallet data
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
    <Box sx={{ bgcolor: 'white', width: '100%', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
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
            bgcolor: '#fff8cbff',
            border: '1px solid #fcd34d',
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
              <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 600, mb: 0.5 }}>
                Expiring Soon
              </Typography>
              <Typography variant="h6" sx={{ color: '#ea580c', fontWeight: 700 }}>
                350 points
              </Typography>
              <Typography variant="caption" sx={{ color: '#b45309' }}>
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
          mb: 4
        }}>
          {/* Available Points Card */}
          <Card sx={{
            background: 'linear-gradient(135deg, #000000 0%, #dc2626 100%)',
            color: 'white',
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
            bgcolor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    Total Earned
                  </Typography>
                </Box>
                <TrendingUp sx={{ color: '#10b981', fontSize: '28px' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                {loyaltyData.totalEarned.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#059669', fontWeight: 500 }}>
                +450 this month
              </Typography>
            </CardContent>
          </Card>

          {/* Total Redeemed Card */}
          <Card sx={{
            bgcolor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 3
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    Total Redeemed
                  </Typography>
                </Box>
                <Box sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#fef2f2',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CardGiftcard sx={{ color: '#ea580c', fontSize: '24px' }} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1 }}>
                {loyaltyData.totalRedeemed.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 500 }}>
                Last: 2 days ago
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid #e5e7eb',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
              },
              '& .Mui-selected': {
                color: '#dc2626',
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#dc2626',
              }
            }}
          >
            <Tab label="Points History" id="loyalty-tab-0" aria-controls="loyalty-tabpanel-0" />
            <Tab label="Redeem Rewards" id="loyalty-tab-1" aria-controls="loyalty-tabpanel-1" />
            <Tab label="Refer & Earn" id="loyalty-tab-2" aria-controls="loyalty-tabpanel-2" />
          </Tabs>

          {/* Points History Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3, pb: 3 }}>
              {/* Title and Filter Chips - One Line */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pb: 2, borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Points History
                </Typography>
                {/* Filter Tabs */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="All"
                    variant="filled"
                    sx={{
                      bgcolor: '#fecaca',
                      color: '#7f1d1d',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#fca5a5' }
                    }}
                  />
                  <Chip
                    label="Earned"
                    variant="outlined"
                    sx={{
                      color: '#6b7280',
                      borderColor: '#d1d5db',
                      fontWeight: 500,
                      '&:hover': { bgcolor: '#f9fafb' }
                    }}
                  />
                  <Chip
                    label="Redeemed"
                    variant="outlined"
                    sx={{
                      color: '#6b7280',
                      borderColor: '#d1d5db',
                      fontWeight: 500,
                      '&:hover': { bgcolor: '#f9fafb' }
                    }}
                  />
                </Box>
              </Box>

              {/* Transaction List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {(showAllTransactions 
                  ? loyaltyData.transactions 
                  : loyaltyData.transactions.slice(0, 4)
                ).map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </Box>

              {/* View All Button */}
              {loyaltyData.transactions.length > 4 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    onClick={() => setShowAllTransactions(!showAllTransactions)}
                    sx={{
                      color: '#dc2626',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(220, 38, 38, 0.04)',
                      }
                    }}
                  >
                    {showAllTransactions ? 'Show Less' : 'View All History'}
                  </Button>
                </Box>
              )}
            </Box>
          </TabPanel>

          {/* Redeem Rewards Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3, pb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Available Rewards
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {[
                  { id: 1, name: '£5 Discount', points: 500, description: 'Get £5 off your next purchase' },
                  { id: 2, name: '£10 Discount', points: 1000, description: 'Get £10 off your next purchase' },
                  { id: 3, name: 'Free Shipping', points: 300, description: 'Free shipping on any order' },
                  { id: 4, name: '£20 Discount', points: 2000, description: 'Get £20 off your next purchase' },
                ].map((reward) => (
                  <Card key={reward.id} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {reward.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                          {reward.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${reward.points} pts`}
                        sx={{ bgcolor: '#fef2f2', color: '#dc2626', fontWeight: 600 }}
                      />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={loyaltyData.totalPoints < reward.points}
                      sx={{
                        bgcolor: '#dc2626',
                        '&:hover': { bgcolor: '#b91c1c' },
                        '&:disabled': { bgcolor: '#e5e7eb', color: '#9ca3af' },
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 1.5,
                      }}
                    >
                      {loyaltyData.totalPoints < reward.points ? 'Not Enough Points' : 'Redeem'}
                    </Button>
                  </Card>
                ))}
              </Box>
            </Box>
          </TabPanel>

          {/* Refer & Earn Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ textAlign: 'center', py: 4, px: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Refer Friends & Earn Points
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: '500px', mx: 'auto' }}>
                Share your unique referral code with friends. When they make their first purchase, you both earn 100 bonus points!
              </Typography>
              <Card sx={{ bgcolor: '#f9fafb', border: '1px solid #e5e7eb', p: 3, mb: 3, maxWidth: '500px', mx: 'auto', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Your Referral Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1, fontFamily: 'monospace' }}>
                    FRIEND50
                  </Typography>
                  <Button variant="outlined" size="small">
                    Copy
                  </Button>
                </Box>
              </Card>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#dc2626',
                  '&:hover': { bgcolor: '#b91c1c' },
                  textTransform: 'none',
                  px: 4,
                  borderRadius: 1.5,
                }}
              >
                Share Referral Link
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

// Transaction Item Component
const TransactionItem: React.FC<{ transaction: LoyaltyTransaction }> = ({ transaction }) => {
  const isEarned = transaction.type === 'earned';
  const Icon = isEarned ? Add : Remove;

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      p: 3,
      bgcolor: '#f9fafb',
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s',
      '&:hover': {
        bgcolor: '#f3f4f6',
        borderColor: '#d1d5db',
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, flex: 1 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isEarned ? '#d1fae5' : '#fef5e7',
          flexShrink: 0,
          mt: 0.5,
        }}>
          <Icon sx={{ color: isEarned ? '#10b981' : '#d97706', fontSize: '24px' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* Line 1: Transaction Description */}
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
            {transaction.description}
          </Typography>
          
          {/* Line 2: Order ID */}
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            {transaction.orderId}
          </Typography>
          
          {/* Line 3: Date and Time */}
          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
            {new Date(transaction.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })} at {new Date(transaction.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography variant="body2" sx={{
          fontWeight: 'bold',
          color: isEarned ? '#10b981' : '#dc2626',
          mb: 0.5,
          fontSize: '1.1rem',
        }}>
          {isEarned ? '+' : ''}{transaction.points}
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
          Balance: {transaction.balance}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoyaltyWalletPage;

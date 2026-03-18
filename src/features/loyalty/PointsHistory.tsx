import React, { useState } from 'react';
import { Box, Button, Chip, Paper, Tab, Tabs, Typography } from '@mui/material';
import { colors } from '../../theme';
import type { LoyaltyWallet, LoyaltyTransaction } from '../../types/loyalty';
import { Add, Remove } from '@mui/icons-material';

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

interface PointsHistoryProps {
  loyaltyData: LoyaltyWallet;
}

export const PointsHistory: React.FC<PointsHistoryProps> = ({ loyaltyData }) => {
  const [tabValue, setTabValue] = useState(0);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'earned' | 'redeemed'>('all');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getFilteredTransactions = () => {
    let filtered = loyaltyData.transactions;
    
    if (filterType === 'earned') {
      filtered = filtered.filter(t => t.points > 0);
    } else if (filterType === 'redeemed') {
      filtered = filtered.filter(t => t.points < 0);
    }
    
    return filtered;
  };

  return (
    <Paper sx={{ borderRadius: 3 }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          borderBottom: `1px solid ${colors.border.default}`,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
          },
          '& .Mui-selected': {
            color: colors.button.primary,
          },
          '& .MuiTabs-indicator': {
            bgcolor: colors.button.primary,
          }
        }}
      >
        <Tab label="Points History" id="loyalty-tab-0" aria-controls="loyalty-tabpanel-0" />
        {/* <Tab label="Redeem Rewards" id="loyalty-tab-1" aria-controls="loyalty-tabpanel-1" />
        <Tab label="Refer & Earn" id="loyalty-tab-2" aria-controls="loyalty-tabpanel-2" /> */}
      </Tabs>

      {/* Points History Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ px: 3, pb: 3 }}>
          {/* Title and Filter Chips - One Line */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pb: 2, borderBottom: `1px solid ${colors.border.default}` }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Points History
            </Typography>
            {/* Filter Tabs */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="All"
                variant={filterType === 'all' ? 'filled' : 'outlined'}
                onClick={() => setFilterType('all')}
                sx={{
                  bgcolor: filterType === 'all' ? colors.loyalty.lightRedPink : 'transparent',
                  color: filterType === 'all' ? colors.loyalty.darkRed : colors.text.disabled,
                  borderColor: filterType === 'all' ? colors.button.primary : colors.border.default,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: filterType === 'all' ? colors.loyalty.lightRedPinkHover : colors.background.lighter }
                }}
              />
              <Chip
                label="Earned"
                variant={filterType === 'earned' ? 'filled' : 'outlined'}
                onClick={() => setFilterType('earned')}
                sx={{
                  bgcolor: filterType === 'earned' ? colors.loyalty.lightRedPink : 'transparent',
                  color: filterType === 'earned' ? colors.loyalty.darkRed : colors.text.disabled,
                  borderColor: filterType === 'earned' ? colors.button.primary : colors.border.default,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: filterType === 'earned' ? colors.loyalty.lightRedPinkHover : colors.background.lighter }
                }}
              />
              <Chip
                label="Redeemed"
                variant={filterType === 'redeemed' ? 'filled' : 'outlined'}
                onClick={() => setFilterType('redeemed')}
                sx={{
                  bgcolor: filterType === 'redeemed' ? colors.loyalty.lightRedPink : 'transparent',
                  color: filterType === 'redeemed' ? colors.loyalty.darkRed : colors.text.disabled,
                  borderColor: filterType === 'redeemed' ? colors.button.primary : colors.border.default,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: filterType === 'redeemed' ? colors.loyalty.lightRedPinkHover : colors.background.lighter }
                }}
              />
            </Box>
          </Box>

          {/* Transaction List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {(() => {
              const filtered = getFilteredTransactions();
              console.log('Rendering transaction list. Total transactions:', loyaltyData.transactions.length);
              console.log('Filtered transactions:', filtered.length);
              console.log('Filter type:', filterType);
              
              if (filtered.length === 0) {
                return (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    bgcolor: colors.background.lighter,
                    borderRadius: 2,
                    border: `1px dashed ${colors.border.default}`
                  }}>
                    <Typography variant="h6" sx={{ color: colors.text.disabled, mb: 1, fontWeight: 600 }}>
                      No transactions yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.disabled, mb: 2 }}>
                      {filterType === 'all' 
                        ? 'Your points history will appear here once you earn or redeem points'
                        : filterType === 'earned'
                        ? 'You haven\'t earned any points yet. Make a purchase to start earning!'
                        : 'You haven\'t redeemed any points yet. Check out available rewards!'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'block', mt: 1 }}>
                      💡 Check the browser console for API response details
                    </Typography>
                  </Box>
                );
              }
              
              return (showAllTransactions ? filtered : filtered.slice(0, 4)).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ));
            })()}
          </Box>

          {/* View All Button */}
          {getFilteredTransactions().length > 4 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                sx={{
                  color: colors.button.primary,
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: `rgba(220, 38, 38, 0.04)`,
                  }
                }}
              >
                {showAllTransactions ? 'Show Less' : 'View All History'}
              </Button>
            </Box>
          )}
        </Box>
      </TabPanel>

      {/* Note: Redeem Rewards and Refer & Earn tabs removed - only Points History shown */}
    </Paper>
  );
};

// Transaction Item Component
const TransactionItem: React.FC<{ transaction: LoyaltyTransaction }> = ({ transaction }) => {
  // Determine if earned based on points value: positive = earned, negative = redeemed
  const isEarned = transaction.points > 0;
  const Icon = isEarned ? Add : Remove;
  
  // Debug log for each transaction
  console.log('Transaction:', {
    id: transaction.id,
    type: transaction.type,
    points: transaction.points,
    isEarned: isEarned ? 'EARNED' : 'REDEEMED',
    description: transaction.description,
    orderId: transaction.orderId
  });

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      p: 3,
      bgcolor: colors.background.light,
      borderRadius: 2,
      border: `2px solid ${isEarned ? colors.loyalty.lightGreen : colors.loyalty.lightRed}`,
      borderLeftWidth: '4px',
      borderLeftColor: isEarned ? colors.loyalty.green : colors.loyalty.orange,
      transition: 'all 0.2s',
      '&:hover': {
        bgcolor: colors.background.lighter,
        borderColor: isEarned ? colors.loyalty.green : colors.loyalty.orange,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
          bgcolor: isEarned ? colors.loyalty.lightGreen : colors.loyalty.lightOrange,
          flexShrink: 0,
          mt: 0.5,
        }}>
          <Icon sx={{ color: isEarned ? colors.loyalty.green : colors.loyalty.orange, fontSize: '24px' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          {/* Line 1: Transaction Type Badge + Description */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip 
              label={isEarned ? 'EARNED' : 'REDEEMED'} 
              size="small"
              sx={{ 
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: isEarned ? colors.loyalty.lightGreen : colors.loyalty.lightOrange,
                color: isEarned ? colors.loyalty.green : colors.loyalty.orange,
                border: `1px solid ${isEarned ? colors.loyalty.green : colors.loyalty.orange}`,
              }} 
            />
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
              {transaction.description}
            </Typography>
          </Box>
          
          {/* Line 2: Order ID (if available) */}
          {transaction.orderId && (
            <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'block', mb: 0.25 }}>
              Order: {transaction.orderId}
            </Typography>
          )}
          
          {/* Line 3: Date and Time */}
          <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'block' }}>
            {(() => {
              try {
                if (!transaction.date) {
                  console.warn('No date for transaction:', transaction.id);
                  return 'Date not available';
                }
                
                // Parse date - handle ISO strings and timestamps
                const dateVal = transaction.date;
                let dateObj: Date;
                
                if ((dateVal as any) instanceof Date) {
                  dateObj = dateVal as unknown as Date;
                } else if (typeof dateVal === 'string') {
                  // Handle ISO date strings (e.g., "2026-01-08T11:19:11.068Z")
                  dateObj = new Date(dateVal);
                } else if (typeof dateVal === 'number') {
                  // Handle timestamps
                  const ms = String(dateVal).length === 10 ? dateVal * 1000 : dateVal;
                  dateObj = new Date(ms);
                } else {
                  console.warn('Unexpected date format:', typeof dateVal, dateVal);
                  return 'Date not available';
                }
                
                // Validate the date
                if (isNaN(dateObj.getTime())) {
                  console.error('Invalid date for transaction:', transaction.id, dateVal);
                  return 'Date not available';
                }
                
                return `${dateObj.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })} at ${dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
              } catch (err) {
                console.error('Error parsing transaction date:', err, transaction);
                return 'Date not available';
              }
            })()}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0, minWidth: 100 }}>
        {/* Points Display */}
        <Typography variant="h6" sx={{
          fontWeight: 'bold',
          color: isEarned ? colors.loyalty.green : colors.button.primary,
          mb: 0.5,
        }}>
          {isEarned ? '+' : '-'}{Math.abs(transaction.points)}
        </Typography>
        
        {/* Points Label */}
        <Typography variant="caption" sx={{ 
          color: isEarned ? colors.loyalty.greenDark : colors.loyalty.darkRed, 
          display: 'block',
          fontWeight: 600,
        }}>
          {isEarned ? 'Points Earned' : 'Discount Redeemed'}
        </Typography>
      </Box>
    </Box>
  );
};

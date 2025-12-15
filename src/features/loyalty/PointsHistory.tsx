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
      filtered = filtered.filter(t => t.type === 'earned');
    } else if (filterType === 'redeemed') {
      filtered = filtered.filter(t => t.type === 'redeemed');
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
                  bgcolor: filterType === 'all' ? '#fecaca' : 'transparent',
                  color: filterType === 'all' ? '#7f1d1d' : colors.text.disabled,
                  borderColor: filterType === 'all' ? colors.button.primary : colors.border.default,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: filterType === 'all' ? '#fca5a5' : colors.background.lighter }
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
            {(showAllTransactions 
              ? getFilteredTransactions()
              : getFilteredTransactions().slice(0, 4)
            ).map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
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
  const isEarned = transaction.type === 'earned';
  const Icon = isEarned ? Add : Remove;

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      p: 3,
      bgcolor: colors.background.light,
      borderRadius: 2,
      border: `1px solid ${colors.border.default}`,
      transition: 'all 0.2s',
      '&:hover': {
        bgcolor: colors.background.lighter,
        borderColor: colors.border.light,
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
          {/* Line 1: Transaction Description */}
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>
            {transaction.description}
          </Typography>
          
          {/* Line 2: Order ID */}
          <Typography variant="caption" sx={{ color: colors.text.disabled }}>
            {transaction.orderId}
          </Typography>
          
          {/* Line 3: Date and Time */}
          <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'block' }}>
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
          color: isEarned ? colors.loyalty.green : colors.button.primary,
          mb: 0.5,
          fontSize: '1.1rem',
        }}>
          {isEarned ? '+' : ''}{transaction.points}
        </Typography>
        <Typography variant="caption" sx={{ color: colors.text.disabled, display: 'block' }}>
          Balance: {transaction.balance}
        </Typography>
      </Box>
    </Box>
  );
};

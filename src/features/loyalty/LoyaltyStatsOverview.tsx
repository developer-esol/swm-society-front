import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { TrendingUp, CardGiftcard, EmojiEvents } from '@mui/icons-material';
import { colors } from '../../theme';
import type { LoyaltyWallet, LeaderboardUser } from '../../types/loyalty';
import { POINT_VALUE } from '../../configs/loyalty';

interface LoyaltyStatsOverviewProps {
  loyaltyData: LoyaltyWallet;
  leaderboardUsers?: LeaderboardUser[];
  currentUserId?: string;
}

export const LoyaltyStatsOverview: React.FC<LoyaltyStatsOverviewProps> = ({ loyaltyData, leaderboardUsers, currentUserId }) => {
  // Check if current user is in top 5
  const currentUserRank = leaderboardUsers?.find(u => u.userId === currentUserId)?.rank;
  const isInTop5 = currentUserRank && currentUserRank <= 5;
  
  return (
    <Box>
      {/* Header with Expiring Soon */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Loyalty Rewards Program
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Track your points and gain exclusive benefits
            </Typography>
            {isInTop5 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: `linear-gradient(135deg, ${colors.adminloyalty.yellow} 0%, ${colors.adminloyalty.yellownew} 100%)`,
                  color: 'white',
                  px: 2.5,
                  py: 1,
                  borderRadius: 3,
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                  border: `2px solid ${colors.adminloyalty.yellow}`,
                }}
              >
                <EmojiEvents sx={{ fontSize: '22px' }} />
                <Box>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.95 }}>
                    Top Earner
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1 }}>
                    #{currentUserRank}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        
        {/* Expiring Soon Box - derived from transactions if expiry info exists */}
        {(() => {
          // Look for transactions that contain an expiry field
          const expiring = loyaltyData.transactions
            .map((t) => {
              // possible expiry fields
              const raw = (t as any).expiryDate || (t as any).expiresAt || (t as any).expiry || (t as any).expires_on || null;
              if (!raw) return null;
              let val = raw;
              if (typeof val === 'number' || /^[0-9]+$/.test(String(val))) {
                const n = Number(val);
                const ms = String(n).length === 10 ? n * 1000 : n;
                val = new Date(ms).toISOString();
              }
              const date = val ? new Date(val) : null;
              return date ? { date, points: Math.abs(t.points || 0) } : null;
            })
            .filter(Boolean) as { date: Date; points: number }[];

          if (expiring.length === 0) return null;

          expiring.sort((a, b) => a.date.getTime() - b.date.getTime());
          const next = expiring[0];

          return (
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
                  {next.points} points
                </Typography>
                <Typography variant="caption" sx={{ color: colors.loyalty.secondary }}>
                  Expires on {next.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>
          );
        })()}
      </Box>

      {/* Main Stats Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
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
              Worth £{(loyaltyData.totalPoints * POINT_VALUE).toFixed(2)} in rewards
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
              {(() => {
                // compute earned this calendar month from transactions
                try {
                  const now = new Date();
                  const month = now.getMonth();
                  const year = now.getFullYear();
                  const earnedThisMonth = loyaltyData.transactions
                    .filter(t => t.type === 'earned' && t.date)
                    .reduce((sum, t) => {
                      const d = new Date(t.date as string);
                      return (d.getMonth() === month && d.getFullYear() === year) ? sum + (t.points || 0) : sum;
                    }, 0);
                  return `+${earnedThisMonth} this month`;
                } catch {
                  return '';
                }
              })()}
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
              {(() => {
                try {
                  const redeemed = loyaltyData.transactions
                    .filter(t => t.type === 'redeemed' && t.date)
                    .map(t => new Date(t.date as string).getTime())
                    .sort((a, b) => b - a);
                  if (redeemed.length === 0) return 'No redemptions';
                  const last = redeemed[0];
                  const diffDays = Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24));
                  if (diffDays === 0) return 'Last: today';
                  if (diffDays === 1) return 'Last: 1 day ago';
                  return `Last: ${diffDays} days ago`;
                } catch {
                  return '';
                }
              })()}
            </Typography>
          </CardContent>
        </Card>

        {/* Leaderboard Card */}
        <Card sx={{
          bgcolor: colors.background.paper,
          border: `1px solid ${colors.border.default}`,
          borderRadius: 3,
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: colors.text.disabled, fontWeight: 500 }}>
                  Top Earners
                </Typography>
              </Box>
              <EmojiEvents sx={{ color: '#FFD700', fontSize: '28px' }} />
            </Box>
            
            {/* Leaderboard List */}
            {leaderboardUsers && leaderboardUsers.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {leaderboardUsers.slice(0, 5).map((user, _index) => {
                  const getRankIcon = (rank: number) => {
                    switch (rank) {
                      case 1: return '🥇';
                      case 2: return '🥈';
                      case 3: return '🥉';
                      default: return `#${rank}`;
                    }
                  };
                  
                  const getRankColor = (rank: number) => {
                    switch (rank) {
                      case 1: return '#FFD700';
                      case 2: return '#C0C0C0';
                      case 3: return '#CD7F32';
                      default: return colors.text.secondary;
                    }
                  };
                  
                  const isCurrentUser = currentUserId && user.userId === currentUserId;
                  
                  return (
                    <Box
                      key={user.userId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1,
                        bgcolor: user.rank === 1 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                        borderRadius: 1,
                        border: user.rank <= 3 ? `1px solid ${getRankColor(user.rank)}20` : 'none',
                      }}
                    >
                      {/* Rank */}
                      <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: user.rank <= 3 ? '20px' : '14px',
                          fontWeight: 'bold',
                          color: getRankColor(user.rank),
                          bgcolor: user.rank <= 3 ? `${getRankColor(user.rank)}15` : colors.background.lighter,
                          borderRadius: 1,
                        }}
                      >
                        {getRankIcon(user.rank)}
                      </Box>
                      
                      {/* User Name */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: colors.text.dark,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.userName}
                        </Typography>
                      </Box>
                      
                      {/* You Badge for Current User */}
                      {isCurrentUser && (
                        <Box
                          sx={{
                            bgcolor: colors.button.primary,
                            color: 'white',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                          }}
                        >
                          You
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  No leaderboard data
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

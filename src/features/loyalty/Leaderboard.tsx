import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { colors } from '../../theme';
import { POINT_VALUE } from '../../configs/loyalty';

interface LeaderboardUser {
  userId: string;
  userName: string;
  totalEarned: number;
  availablePoints: number;
  rank: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `#${rank}`;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return '#FFD700'; // Gold
    case 2:
      return '#C0C0C0'; // Silver
    case 3:
      return '#CD7F32'; // Bronze
    default:
      return colors.text.secondary;
  }
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  if (!users || users.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <EmojiEvents sx={{ fontSize: 32, color: '#FFD700' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Top Earners Leaderboard
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mt: 0.5 }}>
            Top 5 users with the highest earned points
          </Typography>
        </Box>
      </Box>

      <Card sx={{
        bgcolor: colors.background.paper,
        border: `1px solid ${colors.border.default}`,
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <CardContent sx={{ p: 0 }}>
          {users.map((user, index) => (
            <Box
              key={user.userId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                p: 3,
                borderBottom: index < users.length - 1 ? `1px solid ${colors.border.default}` : 'none',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: colors.background.lighter,
                },
                ...(user.rank === 1 && {
                  background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, transparent 100%)',
                }),
              }}
            >
              {/* Rank Badge */}
              <Box
                sx={{
                  minWidth: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: user.rank <= 3 ? `${getRankColor(user.rank)}20` : colors.background.lighter,
                  borderRadius: 2,
                  fontSize: user.rank <= 3 ? '32px' : '20px',
                  fontWeight: 'bold',
                  color: getRankColor(user.rank),
                }}
              >
                {getRankIcon(user.rank)}
              </Box>

              {/* User Avatar */}
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: colors.button.primary,
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                {user.userName.charAt(0).toUpperCase()}
              </Avatar>

              {/* User Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colors.text.primary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.userName}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  {user.availablePoints.toLocaleString()} points available
                </Typography>
              </Box>

              {/* Earned Points */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: user.rank === 1 ? '#FFD700' : colors.text.dark,
                  }}
                >
                  {user.totalEarned.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  total earned
                </Typography>
              </Box>

              {/* Value Badge */}
              <Box
                sx={{
                  minWidth: 80,
                  bgcolor: colors.loyalty.lightRed,
                  borderRadius: 2,
                  p: 1.5,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: colors.button.primary,
                    fontSize: '16px',
                  }}
                >
                  £{(user.totalEarned * POINT_VALUE).toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                  lifetime value
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

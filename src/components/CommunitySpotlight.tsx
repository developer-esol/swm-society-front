import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Container,
} from '@mui/material';
import { Favorite, FavoriteBorder, Instagram, Twitter } from '@mui/icons-material';
import { colors } from '../theme';
import { communityService } from '../api/services/communityService';
import type { CommunityPost } from '../types/community';

interface CommunitySpotlightProps {
  posts: CommunityPost[];
  onLikeUpdate?: () => void; // Callback to refresh posts after like
}

const CommunitySpotlight: React.FC<CommunitySpotlightProps> = ({
  posts,
  onLikeUpdate,
}) => {
  const currentUserId = localStorage.getItem('userId') || '';

  // Check if the media is a video
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Get top 3 most-liked posts
  const topPosts = posts
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  if (topPosts.length === 0) {
    return null;
  }

  const handleLike = async (postId: string) => {
    // If user not logged in, redirect to login
    if (!currentUserId) {
      window.location.href = '/login';
      return;
    }

    try {
      const result = await communityService.toggleLike(postId, currentUserId);
      if (result) {
        onLikeUpdate?.(); // Notify parent to refetch posts
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: colors.background.box, py: 4, width: '100%' }}>
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: colors.text.primary,
              mb: 2,
            }}
          >
            Community Spotlight
          </Typography>
        </Box>

        {/* Top 3 Posts Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {topPosts.map((post) => (
            <Box key={post.id}>
              <Box
                sx={{
                  bgcolor: colors.background.default,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {/* Post Image/Video */}
                {isVideo(post.image) ? (
                  <Box
                    component="video"
                    src={post.image}
                    controls
                    sx={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={post.image}
                    alt={post.caption}
                    sx={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                {/* Post Content */}
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* User Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={post.userAvatar}
                      alt={post.userName}
                      sx={{
                        width: 48,
                        height: 48,
                        mr: 2,
                        border: `2px solid ${colors.button.primary}`,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: colors.text.primary,
                          fontSize: '0.95rem',
                        }}
                      >
                        {post.userName}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'grey.600',
                          fontSize: '0.85rem',
                        }}
                      >
                        @{post.userHandle}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Post Caption */}
                  <Typography
                    sx={{
                      color: colors.text.primary,
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      mb: 2,
                      flex: 1,
                    }}
                  >
                    "{post.caption}"
                  </Typography>

                  {/* Social Icons */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2, borderTop: `1px solid ${colors.border.light}` }}>
                    <IconButton
                      size="small"
                      onClick={() => handleLike(post.id)}
                      sx={{
                        color: post.isLiked ? colors.danger.primary : 'grey.600',
                        '&:hover': {
                          color: colors.danger.primary,
                        },
                      }}
                    >
                      {post.isLiked ? (
                        <Favorite sx={{ fontSize: 18 }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                    <Typography sx={{ fontSize: '0.85rem', color: 'grey.600', mt: 0.5 }}>
                      {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                    </Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: 'grey.600' }}>
                        <Instagram sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'grey.600' }}>
                        <Twitter sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CommunitySpotlight;

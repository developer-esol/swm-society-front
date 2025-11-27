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
import type { CommunityPost } from '../types/community';

interface CommunitySpotlightProps {
  posts: CommunityPost[];
  onLike?: (postId: string) => void;
}

const CommunitySpotlight: React.FC<CommunitySpotlightProps> = ({
  posts,
  onLike,
}) => {
  // Get top 3 most-liked posts
  const topPosts = posts
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  if (topPosts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', py: 4, width: '100%' }}>
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
                  bgcolor: 'white',
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
                {/* Post Image */}
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
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <IconButton
                      size="small"
                      onClick={() => onLike?.(post.id)}
                      sx={{
                        color: post.isLiked ? colors.button.primary : 'grey.600',
                        '&:hover': {
                          color: colors.button.primary,
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

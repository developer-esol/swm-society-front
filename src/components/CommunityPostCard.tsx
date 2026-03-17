import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { communityService } from '../api/services/communityService';
import { colors } from '../theme';
import type { CommunityPost } from '../types/community';

interface CommunityPostCardProps {
  post: CommunityPost;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('userId') || '';

  // Check if the media is a video
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Update local state when post prop changes
  useEffect(() => {
    setIsLiked(post.isLiked || false);
    setLikeCount(post.likes);
  }, [post.isLiked, post.likes]);

  const handleLikeClick = async () => {
    // If user not logged in, redirect to login
    if (!currentUserId) {
      window.location.href = '/login';
      return;
    }
    
    if (isLiking) return;

    try {
      setIsLiking(true);
      
      // Call the toggle like API
      const result = await communityService.toggleLike(post.id, currentUserId);
      
      if (result) {
        setIsLiked(result.liked);
        setLikeCount(result.noOfLikes);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card
      sx={{
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${colors.overlay.blackLight}`,
        },
      }}
    >
      {/* Post Image/Video with Like Button */}
      <Box sx={{ position: 'relative' }}>
        {isVideo(post.image) ? (
          <Box
            component="video"
            src={post.image}
            controls
            sx={{
              width: '100%',
              height: 280,
              objectFit: 'cover',
              backgroundColor: colors.card.imagePlaceholder,
            }}
          />
        ) : (
          <CardMedia
            component="img"
            height="280"
            image={post.image}
            alt="Community post"
            sx={{
              objectFit: 'cover',
              backgroundColor: colors.card.imagePlaceholder,
            }}
          />
        )}
        {/* Like Button on Image/Video Corner */}
        <IconButton
          onClick={handleLikeClick}
          disabled={isLiking}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: colors.overlay.white,
            color: isLiked ? colors.danger.primary : 'grey.600',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: colors.overlay.whiteOpaque,
              transform: 'scale(1.1)',
            },
            '&:disabled': {
              opacity: 0.7,
            },
            transition: 'all 0.2s',
          }}
        >
          {isLiked ? <Favorite sx={{ fontSize: 24 }} /> : <FavoriteBorder sx={{ fontSize: 24 }} />}
        </IconButton>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* User Handle and Like Count */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: colors.text.primary, fontSize: '0.75rem', display: 'block' }}>
            @{post.userHandle}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.text.primary, fontSize: '0.75rem' }}>
            {likeCount} likes
          </Typography>
        </Box>

        {/* Caption */}
        <Typography
          variant="body2"
          sx={{
            color: colors.text.primary,
            mb: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.caption}
        </Typography>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {post.hashtags.slice(0, 2).map((tag, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  color: colors.text.primary,
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {tag}
              </Typography>
            ))}
          </Box>
        )}

        {/* Products */}
        {post.products && post.products.length > 0 && (
          <Box>
            {post.products.map((product, index) => (
              <Chip
                key={index}
                label={product.name}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  bgcolor: colors.card.imagePlaceholder,
                  color: colors.text.primary,
                  fontWeight: 500,
                  mb: 0.5,
                  mr: 0.5,
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityPostCard;

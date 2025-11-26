import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import type { CommunityPost } from '../types/community';

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike?: (postId: string) => Promise<void>;
}

const CommunityPostCard: React.FC<CommunityPostCardProps> = ({
  post,
  onLike,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async () => {
    if (!onLike || isLiking) return;

    try {
      setIsLiking(true);
      await onLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
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
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Post Image with Like Button */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="280"
          image={post.image}
          alt="Community post"
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
          }}
        />
        {/* Like Button on Image Corner */}
        <IconButton
          onClick={handleLikeClick}
          disabled={isLiking}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'transparent',
            color: isLiked ? '#dc2626' : 'grey.500',
            width: 'auto',
            height: 'auto',
            padding: 0,
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&:disabled': {
              opacity: 0.7,
            },
          }}
        >
          {isLiked ? <Favorite sx={{ fontSize: 28 }} /> : <Favorite sx={{ fontSize: 28 }} />}
        </IconButton>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* User Handle and Like Count */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'black', fontSize: '0.75rem', display: 'block' }}>
            @{post.userHandle}
          </Typography>
          <Typography variant="caption" sx={{ color: 'black', fontSize: '0.75rem' }}>
            {likeCount} likes
          </Typography>
        </Box>

        {/* Caption */}
        <Typography
          variant="body2"
          sx={{
            color: 'black',
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
                  color: 'black',
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
                  bgcolor: '#f5f5f5',
                  color: 'black',
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

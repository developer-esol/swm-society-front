import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
} from '@mui/material'
import { Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../theme'
import type { CommunityPost } from '../types/community'

interface AdminCommunityPostCardProps {
  post: CommunityPost
  onDelete: (post: CommunityPost) => void
}

const AdminCommunityPostCard: React.FC<AdminCommunityPostCardProps> = ({
  post,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(post)
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'visible',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {/* Post Image */}
      <Box
        sx={{
          width: { xs: '100%', sm: '200px' },
          height: { xs: '200px', sm: '200px' },
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          image={post.image}
          alt={post.caption}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
          }}
        />
      </Box>

      {/* Post Content */}
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 1.5, sm: 2 },
        }}
      >
        {/* User Handle and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: colors.text.primary,
                fontSize: '0.9rem',
              }}
            >
              @{post.userHandle}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.text.disabled,
                fontSize: '0.75rem',
              }}
            >
              User ID: {post.userId}
            </Typography>
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={handleDelete}
              sx={{
                minWidth: '40px',
                width: '40px',
                height: '40px',
                p: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${colors.border.default}`,
                borderRadius: '6px',
                color: '#dc2626',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: '#fee2e2',
                },
              }}
            >
              <DeleteIcon size={18} />
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: '1.1rem' }}>❤️</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: colors.text.disabled, fontWeight: 500 }}>
                {post.likes}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Caption */}
        <Typography
          sx={{
            color: colors.text.primary,
            fontSize: '0.9rem',
            fontWeight: 500,
            mb: 0.5,
            lineHeight: 1.4,
          }}
        >
          {post.caption}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: colors.text.disabled,
            fontSize: '0.85rem',
            mb: 1,
            lineHeight: 1.4,
          }}
        >
          {post.description}
        </Typography>

        {/* Products */}
        {post.products && post.products.length > 0 && (
          <Box sx={{ mb: 1 }}>
            {post.products.map((product, index) => (
              <Typography key={index} sx={{ fontSize: '0.8rem', color: colors.text.disabled }}>
                <strong>Products:</strong> {product.collection}
              </Typography>
            ))}
          </Box>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 'auto' }}>
            {post.hashtags.slice(0, 2).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  height: '24px',
                  fontSize: '0.75rem',
                  borderColor: colors.border.default,
                  color: colors.text.disabled,
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminCommunityPostCard

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button as MuiButton,
  CircularProgress,
  IconButton,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { communityService } from '../api/services/communityService';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmDeleteDialog } from '../components';
import { colors } from '../theme';
import type { CommunityPost } from '../types/community';

const YourPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; caption: string } | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const currentUserId = user?.id || '';

  // Load user posts on mount
  useEffect(() => {
    const loadUserPosts = async () => {
      if (!isAuthenticated || !currentUserId) {
        console.log('User not authenticated, skipping posts load');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const userPosts = await communityService.getByUserId(currentUserId);
        setPosts(userPosts);
        console.log(`Loaded ${userPosts.length} posts for user ${currentUserId}`);
      } catch (error) {
        console.error('Failed to load user posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPosts();
  }, [currentUserId, isAuthenticated]);

  const handleLikePost = (postId: string) => {
    setLikedPosts(prev => {
      const updated = new Set(prev);
      if (updated.has(postId)) {
        updated.delete(postId);
      } else {
        updated.add(postId);
      }
      return updated;
    });
  };

  const handleRemovePost = (post: CommunityPost) => {
    setPostToDelete({ id: post.id, caption: post.caption });
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      await communityService.deletePost(postToDelete.id);
      setPosts(posts.filter((post) => post.id !== postToDelete.id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.background.default,
          mt: { xs: 10, md: 12 },
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.background.default, width: '100%', minHeight: '100vh' }}>
      {/* Add top padding to account for fixed navbar */}
      <Box sx={{ pt: { xs: 4, md: 6 } }} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: colors.text.primary,
            mb: 4,
          }}
        >
          Your Posts
        </Typography>

        {/* Posts List */}
        {posts.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {posts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  bgcolor: colors.background.paper,
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                {/* Post Image */}
                <CardMedia
                  component="img"
                  image={post.image}
                  alt={post.caption}
                  sx={{
                    width: { xs: '100%', md: 150 },
                    height: { xs: 150, md: 150 },
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />

                {/* Post Content */}
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {/* Top Section - User Info and Likes */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    {/* Left: User and Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: '600',
                          color: colors.text.primary,
                          mb: 0.5,
                        }}
                      >
                        @{post.userHandle}
                      </Typography>

                      {/* Caption */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.primary,
                          mb: 0.5,
                          lineHeight: 1.6,
                          fontWeight: 500,
                        }}
                      >
                        {post.caption}
                      </Typography>

                      {/* Hashtags */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: colors.text.secondary,
                          display: 'block',
                          mb: 0.5,
                          fontWeight: '500',
                        }}
                      >
                        {post.hashtags?.join(' ') || '#swmsociety #style'}
                      </Typography>

                      {/* Products Info */}
                      {post.products && post.products.length > 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.text.secondary,
                            display: 'block',
                            fontWeight: '500',
                          }}
                        >
                          Products: {post.products.map((p) => `${p.name} ${p.collection}`).join(', ')}
                        </Typography>
                      )}
                    </Box>

                    {/* Right: Likes Display */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                      <FavoriteIcon sx={{ color: colors.button.primary, fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.primary,
                          fontWeight: '600',
                        }}
                      >
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)} likes
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bottom Section - Like Button and Remove Button */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    {/* Like Button */}
                    <IconButton
                      size="small"
                      onClick={() => handleLikePost(post.id)}
                      sx={{
                        color: likedPosts.has(post.id) ? '#dc2626' : colors.text.secondary,
                        p: 0,
                        '&:hover': {
                          color: colors.button.primary,
                        },
                      }}
                    >
                      {likedPosts.has(post.id) ? (
                        <FavoriteIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>

                    {/* Remove Button */}
                    <MuiButton
                      variant="contained"
                      size="small"
                      onClick={() => handleRemovePost(post)}
                      sx={{
                        bgcolor: colors.text.primary,
                        color: colors.text.secondary,
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        py: 0.75,
                        px: 2,
                        '&:hover': {
                          bgcolor: colors.text.dark,
                        },
                      }}
                    >
                      Remove
                    </MuiButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: colors.text.secondary,
                mb: 2,
              }}
            >
              You haven't posted anything yet.
            </Typography>
            <MuiButton
              variant="contained"
              sx={{
                bgcolor: colors.button.primary,
                color: colors.text.secondary,
                textTransform: 'none',
                fontWeight: '600',
                py: 1,
                px: 3,
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
              }}
            >
              Create Your First Post
            </MuiButton>
          </Box>
        )}
      </Container>

      {/* Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        message={`Are you sure you want to delete "${postToDelete?.caption}"? This action cannot be undone.`}
        onConfirm={confirmDeletePost}
        onCancel={cancelDelete}
      />
    </Box>
  );
};

export default YourPostsPage;

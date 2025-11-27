import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button as MuiButton,
  CircularProgress,
  TextField,
} from '@mui/material';
import CommunityPostCard from '../components/CommunityPostCard';
import CommunitySpotlight from '../components/CommunitySpotlight';
import { communityService } from '../api/services/communityService';
import { colors } from '../theme';
import type { CommunityPost } from '../types/community';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const initialPostsCount = 3;

  // Load initial posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const loadedPosts = await communityService.getAll();
        setAllPosts(loadedPosts);
        setPosts(loadedPosts.slice(0, initialPostsCount));
      } catch (error) {
        console.error('Failed to load community posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleViewMore = () => {
    setPosts(allPosts);
    setShowAll(true);
  };

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPost = await communityService.likePost(postId);
      if (updatedPost) {
        setPosts(
          posts.map((post) =>
            post.id === postId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
      throw error;
    }
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
      <Box sx={{ pt: { xs: 10, md: 12 } }} />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Section Title */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: colors.text.primary,
            }}
          >
            Style Inspiration
          </Typography>
        </Box>

        {/* Community Posts Grid */}
        {posts.length > 0 ? (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
                mb: 1,
                justifyItems: 'center',
              }}
            >
              {posts.map((post) => (
                <Box key={post.id}>
                  <CommunityPostCard
                    post={post}
                    onLike={handleLikePost}
                  />
                </Box>
              ))}
            </Box>

            {/* Load More Button */}
            {!showAll && allPosts.length > initialPostsCount && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
                <MuiButton
                  variant="text"
                  sx={{
                    color: colors.text.primary,
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      color: colors.button.primary,
                      bgcolor: 'transparent',
                    },
                  }}
                  onClick={handleViewMore}
                >
                  View More
                </MuiButton>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" sx={{ color: colors.text.disabled }}>
              No posts yet. Be the first to share your style!
            </Typography>
          </Box>
        )}
      </Container>

      {/* Community Spotlight - Top 3 Most-Liked Posts */}
      {posts.length > 0 && (
        <CommunitySpotlight posts={posts} onLike={handleLikePost} />
      )}

      {/* Share Your Style Section */}
      <Box sx={{ bgcolor: '#fafafa', width: '100%', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            {/* Section Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: colors.text.primary,
                mb: 2,
              }}
            >
              Share Your Style
            </Typography>

            {/* Section Description */}
            <Typography
              variant="body2"
              sx={{
                color: 'grey.600',
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
              }}
            >
              Show us how you wear our SWMSOCIETY pieces. Tag @swmsociety and use #StyleWithMeaning for a chance to be featured.
            </Typography>

            {/* CTA Button - Shop the Collection */}
            {!showPostForm && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
                <MuiButton
                  variant="contained"
                  sx={{
                    bgcolor: colors.button.primary,
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#b91c1c',
                    },
                  }}
                  onClick={() => window.location.href = '/shop'}
                >
                  Shop the Collection
                </MuiButton>
              </Box>
            )}

            {/* Add Your Post Button - Hidden when form is shown */}
            {!showPostForm && (
              <MuiButton
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#1a1a1a',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 1.5,
                  mb: 2,
                  maxWidth: '400px',
                  mx: 'auto',
                  display: 'block',
                  '&:hover': {
                    bgcolor: '#333',
                  },
                }}
                onClick={() => setShowPostForm(true)}
              >
                Add Your Post
              </MuiButton>
            )}
          </Box>
        </Container>
      </Box>

      {/* Join Our Style Community Section - Only shown when Add Your Post is clicked */}
      {showPostForm && (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Section Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: colors.text.primary,
                mb: 3,
              }}
            >
              Join Our Style Community
            </Typography>

          {/* Comment Form */}
          <Box sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Your comment here..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#bdbdbd',
                  },
                },
                mb: 1,
              }}
            />
          </Box>

          {/* Upload Image Section */}
          <Box
            sx={{
              border: '2px dashed #e0e0e0',
              borderRadius: '8px',
              py: 4,
              px: 2,
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'border-color 0.3s ease',
              '&:hover': {
                borderColor: colors.button.primary,
              },
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              🖼️
            </Box>
            <Typography
              sx={{
                color: 'grey.600',
                fontSize: '0.9rem',
              }}
            >
              Upload Image
            </Typography>
          </Box>

          {/* Publish Button */}
          <MuiButton
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#1a1a1a',
              color: 'white',
              textTransform: 'none',
              fontSize: '1rem',
              py: 1.5,
              maxWidth: '400px',
              mx: 'auto',
              display: 'block',
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            Publish Post
          </MuiButton>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default CommunityPage;

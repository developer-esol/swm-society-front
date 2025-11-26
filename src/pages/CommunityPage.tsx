import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button as MuiButton,
  CircularProgress,
} from '@mui/material';
import CommunityPostCard from '../components/CommunityPostCard';
import { communityService } from '../api/services/communityService';
import { colors } from '../theme';
import type { CommunityPost } from '../types/community';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
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

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Section Title */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
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
                gap: 4,
                mb: 4,
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
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
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
    </Box>
  );
};

export default CommunityPage;

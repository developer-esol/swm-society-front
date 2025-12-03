import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button as MuiButton, CircularProgress } from '@mui/material';
import CommunityPostCard from '../../components/CommunityPostCard';
import { useCommunity } from '../../hooks/useCommunity';
import { colors } from '../../theme';
import type { CommunityPost } from '../../types/community';

interface StyleInspirationProps {
  onLike: (postId: string) => Promise<void>;
}

const INITIAL_POSTS_COUNT = 3;

export const StyleInspiration: React.FC<StyleInspirationProps> = ({ onLike }) => {
  const { getAll } = useCommunity();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const postsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const loadedPosts = await getAll();
        setAllPosts(loadedPosts);
        setPosts(loadedPosts.slice(0, INITIAL_POSTS_COUNT));
      } catch (error) {
        console.error('Failed to load community posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [getAll]);

  const handleViewMore = () => {
    setPosts(allPosts);
    setShowAll(true);
  };

  const handleLikePost = async (postId: string) => {
    try {
      await onLike(postId);
      // Update local state
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
      );
      setPosts(updatedPosts);
      setAllPosts(allPosts.map((post) =>
        post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.background.default,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
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
            ref={postsRef}
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
                <CommunityPostCard post={post} onLike={handleLikePost} />
              </Box>
            ))}
          </Box>

          {/* Load More Button */}
          {!showAll && allPosts.length > INITIAL_POSTS_COUNT && (
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
  );
};

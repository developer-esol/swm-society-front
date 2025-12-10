import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { colors } from '../../theme';
import { CommunityHero } from './CommunityHero';
import { StyleInspiration } from './StyleInspiration';
import { CommunitySpotlightSection } from './CommunitySpotlightSection';
import { ShareYourStyle } from './ShareYourStyle';
import { useCommunity } from '../../hooks/useCommunity';
import type { CommunityPost } from '../../types/community';

interface CommunityPageComponentProps {
  onPostSuccess?: () => void;
}

export const CommunityPageComponent: React.FC<CommunityPageComponentProps> = ({ onPostSuccess }) => {
  const shareYourStyleRef = useRef<HTMLDivElement>(null);
  const { likePost, getAll } = useCommunity();
  const [posts, setPosts] = React.useState<CommunityPost[]>([]);
  const [spotlightPosts, setSpotlightPosts] = React.useState<CommunityPost[]>([]);

  // Load all posts and set spotlight
  const loadPosts = async () => {
    try {
      const allPosts = await getAll();
      setPosts(allPosts);
      // Get top 3 most-liked posts for spotlight
      const topPosts = allPosts
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3);
      setSpotlightPosts(topPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [getAll]);

  const handlePostSuccess = () => {
    // Refresh posts after successful creation
    loadPosts();
    if (onPostSuccess) {
      onPostSuccess();
    }
  };

  const handleShareYourLook = () => {
    if (shareYourStyleRef.current) {
      const offsetTop = shareYourStyleRef.current.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const updatedPost = await likePost(postId);
      if (updatedPost) {
        setPosts(
          posts.map((post) =>
            post.id === postId ? updatedPost : post
          )
        );
        // Update spotlight if liked post is in top 3
        setSpotlightPosts(
          spotlightPosts.map((post) =>
            post.id === postId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: colors.background.default, width: '100%', minHeight: '100vh' }}>
      {/* Community Hero Section */}
      <CommunityHero onShareYourLook={handleShareYourLook} />

      {/* Style Inspiration Section */}
      <StyleInspiration onLike={handleLikePost} />

      {/* Community Spotlight Section */}
      {spotlightPosts.length > 0 && (
        <CommunitySpotlightSection posts={spotlightPosts} onLike={handleLikePost} />
      )}

      {/* Share Your Style Section */}
      <Box ref={shareYourStyleRef}>
        <ShareYourStyle onPostSuccess={handlePostSuccess} />
      </Box>
    </Box>
  );
};

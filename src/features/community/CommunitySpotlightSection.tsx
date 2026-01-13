import React from 'react';
import { Container, Box} from '@mui/material';
import CommunitySpotlight from '../../components/CommunitySpotlight';
import { colors } from '../../theme';
import type { CommunityPost } from '../../types/community';

interface CommunitySpotlightSectionProps {
  posts: CommunityPost[];
  onLike: (postId: string) => Promise<void>;
  onLikeUpdate?: () => void;
}

export const CommunitySpotlightSection: React.FC<CommunitySpotlightSectionProps> = ({ posts, onLike, onLikeUpdate }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: colors.background.default, width: '100%', py: 4 }}>
      <Container maxWidth="lg">
        <CommunitySpotlight posts={posts} onLikeUpdate={onLikeUpdate} />
      </Container>
    </Box>
  );
};

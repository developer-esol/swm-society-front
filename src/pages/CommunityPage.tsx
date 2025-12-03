import React from 'react';
import { CommunityPageComponent } from '../features/community';

const CommunityPage: React.FC = () => {
  const handlePostSuccess = () => {
    // Handle post success logic here
    console.log('Post created successfully');
  };

  return <CommunityPageComponent onPostSuccess={handlePostSuccess} />;
};

export default CommunityPage;

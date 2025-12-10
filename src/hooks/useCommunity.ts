import { useCallback } from 'react';
import { communityService } from '../api/services/communityService';
import type { CommunityPost } from '../types/community';

export const useCommunity = () => {
  const getAll = useCallback(async (): Promise<CommunityPost[]> => {
    try {
      return await communityService.getAll();
    } catch (error) {
      console.error('Failed to fetch community posts:', error);
      throw error;
    }
  }, []);

  const getPaginated = useCallback(
    async (page: number = 1, limit: number = 6): Promise<CommunityPost[]> => {
      try {
        // Use getRecent for paginated-like behavior
        return await communityService.getRecent(limit);
      } catch (error) {
        console.error('Failed to fetch paginated posts:', error);
        throw error;
      }
    },
    []
  );

  const likePost = useCallback(async (postId: string): Promise<CommunityPost | null> => {
    try {
      // Toggle like on the post
      return await communityService.toggleLike(postId, true);
    } catch (error) {
      console.error('Failed to like post:', error);
      throw error;
    }
  }, []);

  const getById = useCallback(async (postId: string): Promise<CommunityPost | null> => {
    try {
      // Get all posts and find by ID
      const allPosts = await communityService.getAll();
      return allPosts.find(post => post.id === postId) || null;
    } catch (error) {
      console.error('Failed to fetch post:', error);
      throw error;
    }
  }, []);

  const getMockPosts = useCallback((): CommunityPost[] => {
    try {
      // Return empty array since we're using real API now
      return [];
    } catch (error) {
      console.error('Failed to get mock posts:', error);
      throw error;
    }
  }, []);

  const getByUserId = useCallback(async (userId: string): Promise<CommunityPost[]> => {
    try {
      return await communityService.getByUserId(userId);
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
      throw error;
    }
  }, []);

  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    try {
      return await communityService.deletePost(postId);
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  }, []);

  return {
    getAll,
    getPaginated,
    likePost,
    getById,
    getMockPosts,
    getByUserId,
    deletePost,
    create: communityService.create,
    getFeatured: communityService.getFeatured,
    getRecent: communityService.getRecent,
  };
};

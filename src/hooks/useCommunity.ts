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
        return await communityService.getPaginated(page, limit);
      } catch (error) {
        console.error('Failed to fetch paginated posts:', error);
        throw error;
      }
    },
    []
  );

  const likePost = useCallback(async (postId: string): Promise<CommunityPost | null> => {
    try {
      return await communityService.likePost(postId);
    } catch (error) {
      console.error('Failed to like post:', error);
      throw error;
    }
  }, []);

  const getById = useCallback(async (postId: string): Promise<CommunityPost | null> => {
    try {
      return await communityService.getById(postId);
    } catch (error) {
      console.error('Failed to fetch post:', error);
      throw error;
    }
  }, []);

  const getMockPosts = useCallback((): CommunityPost[] => {
    try {
      return communityService.getMockPosts();
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
  };
};

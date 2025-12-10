import { apiClient } from '../apiClient';
import type { CommunityPost, CreateCommunityPostData, CommunityPostResponse } from '../../types/community';

export const communityService = {
  /**
   * Get all community posts
   * @returns Array of all community posts
   */
  getAll: async (): Promise<CommunityPost[]> => {
    try {
      console.log('Fetching all community posts from API');
      
      const response = await apiClient.get<CommunityPostResponse[]>('/community-posts');
      
      // Transform API response to match frontend types
      const posts: CommunityPost[] = response.map(post => ({
        id: post.id,
        userId: post.userId,
        userName: 'Community User', // Will be populated by user lookup
        userHandle: `user_${post.userId.substring(0, 8)}`,
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        image: post.imageUrl,
        caption: post.description,
        description: post.description,
        productId: '', // Not in current API response
        products: [], // Will be populated if needed
        likes: post.noOfLikes || 0,
        isLiked: false, // Will be determined by user interaction
        createdAt: post.createdAt || post.date,
        hashtags: [], // Extract from description if needed
      }));
      
      console.log(`Fetched ${posts.length} community posts`);
      return posts;
    } catch (error) {
      console.error('Failed to fetch community posts:', error);
      throw new Error('Failed to load community posts');
    }
  },

  /**
   * Get community posts by user ID
   * @param userId - User ID
   * @returns Array of community posts for the user
   */
  getByUserId: async (userId: string): Promise<CommunityPost[]> => {
    try {
      console.log('Fetching community posts for user:', userId);
      
      // Get all posts and filter by userId
      const allPosts = await communityService.getAll();
      const userPosts = allPosts.filter(post => post.userId === userId);
      
      console.log(`Found ${userPosts.length} posts for user ${userId}`);
      return userPosts;
    } catch (error) {
      console.error('Failed to fetch user community posts:', error);
      throw new Error('Failed to load your posts');
    }
  },

  /**
   * Create a new community post
   * @param postData - Community post data
   * @returns Created community post
   */
  create: async (postData: CreateCommunityPostData): Promise<CommunityPost> => {
    try {
      console.log('Creating community post:', postData);
      
      const response = await apiClient.post<CommunityPostResponse>('/community-posts', {
        userId: postData.userId,
        description: postData.description,
        imageUrl: postData.imageUrl,
      });
      
      // Transform response to frontend type
      const post: CommunityPost = {
        id: response.id,
        userId: response.userId,
        userName: 'You', // Current user
        userHandle: `user_${response.userId.substring(0, 8)}`,
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        image: response.imageUrl,
        caption: response.description,
        description: response.description,
        productId: '',
        products: [],
        likes: response.noOfLikes || 0,
        isLiked: false,
        createdAt: response.createdAt,
        hashtags: [],
      };
      
      console.log('Community post created successfully:', post.id);
      return post;
    } catch (error) {
      console.error('Failed to create community post:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        throw new Error(`Failed to create post: ${error.message}`);
      }
      
      throw new Error('Failed to create post. Please check your connection and try again.');
    }
  },

  /**
   * Delete a community post
   * @param postId - Post ID
   * @returns Success status
   */
  deletePost: async (postId: string): Promise<boolean> => {
    try {
      console.log('Deleting community post:', postId);
      
      await apiClient.delete(`/community-posts/${postId}`);
      
      console.log('Community post deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete community post:', error);
      return false;
    }
  },

  /**
   * Update likes for a community post
   * @param postId - Post ID
   * @param likes - New like count
   * @returns Updated post
   */
  updateLikes: async (postId: string, likes: number): Promise<boolean> => {
    try {
      console.log('Updating likes for post:', postId, 'to:', likes);
      
      await apiClient.put(`/community-posts/${postId}`, {
        noOfLikes: likes,
      });
      
      console.log('Post likes updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update post likes:', error);
      return false;
    }
  },

  /**
   * Toggle like/unlike a community post
   * @param postId - Post ID
   * @param isLiked - Whether the post should be liked or unliked
   * @returns Updated post
   */
  toggleLike: async (postId: string, isLiked: boolean): Promise<CommunityPost | null> => {
    try {
      // Get current post to determine new like count
      const posts = await communityService.getAll();
      const post = posts.find(p => p.id === postId);
      
      if (!post) return null;
      
      const newLikes = isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
      
      await communityService.updateLikes(postId, newLikes);
      
      return {
        ...post,
        likes: newLikes,
        isLiked: isLiked,
      };
    } catch (error) {
      console.error('Failed to toggle post like:', error);
      return null;
    }
  },

  /**
   * Get featured community posts (top liked posts)
   * @param limit - Number of posts to return
   * @returns Array of featured community posts
   */
  getFeatured: async (limit: number = 6): Promise<CommunityPost[]> => {
    try {
      const allPosts = await communityService.getAll();
      const featured = allPosts
        .sort((a, b) => b.likes - a.likes)
        .slice(0, limit);
      
      return featured;
    } catch (error) {
      console.error('Failed to fetch featured posts:', error);
      return [];
    }
  },

  /**
   * Get recent community posts
   * @param limit - Number of posts to return
   * @returns Array of recent community posts
   */
  getRecent: async (limit: number = 10): Promise<CommunityPost[]> => {
    try {
      const allPosts = await communityService.getAll();
      const recent = allPosts
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      
      return recent;
    } catch (error) {
      console.error('Failed to fetch recent posts:', error);
      return [];
    }
  },

  // Legacy method aliases for backward compatibility
  getAllPosts: async (): Promise<CommunityPost[]> => {
    return communityService.getAll();
  },
};
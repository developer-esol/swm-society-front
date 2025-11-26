/**
 * Community post-related types
 */

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar?: string;
  image: string;
  caption: string;
  description: string;
  productId: string;
  products?: Array<{
    name: string;
    collection: string;
  }>;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
  hashtags?: string[];
}

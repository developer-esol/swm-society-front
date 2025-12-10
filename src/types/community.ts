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

//newly added 
export interface CreateCommunityPostData {
  userId: string;
  description: string;
  imageUrl: string;
}

export interface CommunityPostResponse {
  id: string;
  userId: string;
  description: string;
  noOfLikes: number;
  imageUrl: string;
  date: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

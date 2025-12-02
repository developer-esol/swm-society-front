import type { CommunityPost } from '../../types/community';

// Mock/Dummy community post data
const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    userId: 'user_alex',
    userName: 'Alex Style',
    userHandle: 'alex_style',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    image: './d2.jpg',
    caption: 'Loving my new Project Zero\'s jacket, so comfortable and stylish. #SWMSOCIETY',
    description: 'Amazing quality and perfect fit for everyday wear. Highly recommend!',
    productId: '1',
    products: [
      {
        name: 'Project Zero Puffer Jacket',
        collection: 'SWMSOCIETY x PROJECT ZERO',
      },
    ],
    likes: 124,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#SWMSOCIETY', '#ProjectZero', '#style'],
  },
  {
    id: '2',
    userId: 'user_thomas',
    userName: 'Thomas Beaumont',
    userHandle: 'thomas_beaumont',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    image: 'd4.jpg',
    caption: 'The quality and craftsmanship is unmatched. Every detail matters! #craftsmanship',
    description: 'Exceptional craftsmanship and attention to detail in every stitch.',
    productId: '5',
    products: [
      {
        name: 'Thomas Mushet Premium Collection',
        collection: 'SWMSOCIETY x THOMAS MUSHET',
      },
    ],
    likes: 89,
    isLiked: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#craftsmanship', '#quality', '#mushet'],
  },
  {
    id: '3',
    userId: 'user_aria',
    userName: 'Aria Rose',
    userHandle: 'aria_rose',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    image: './d1.jpg',
    caption: 'Styling my Hear My Voice collection for the weekend. Perfect vibe! ✨',
    description: 'The perfect piece for empowerment and self-expression.',
    productId: '7',
    products: [
      {
        name: 'Hear My Voice Hoodie',
        collection: 'SWMSOCIETY x HEAR MY VOICE',
      },
    ],
    likes: 156,
    isLiked: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#hearMyVoice', '#hoodies', '#weekend'],
  },
  {
    id: '4',
    userId: 'user_marcus',
    userName: 'Marcus JP',
    userHandle: 'marcus_jp',
    userAvatar: 'https://i.pravatar.cc/150?img=4',
    image: 'b3.jpg',
    caption: 'Supporting local artists and designers. Love what SWMSOCIETY stands for! 💯',
    description: 'Proud to support a brand that makes a real difference in the community.',
    productId: '3',
    products: [
      {
        name: 'Limited Edition T-Shirt',
        collection: 'SWMSOCIETY Collaboration',
      },
    ],
    likes: 203,
    isLiked: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#supportlocal', '#community', '#design'],
  },
  {
    id: '5',
    userId: 'user_sophie',
    userName: 'Sophie Adams',
    userHandle: 'sophie_adams',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    image: 'B2.webp',
    caption: 'Finally got my hands on the exclusive drop. Worth the wait! 🔥',
    description: 'Exclusive quality that justifies the wait time. Absolutely stunning.',
    productId: '6',
    products: [
      {
        name: 'Exclusive Collection Jacket',
        collection: 'SWMSOCIETY Limited',
      },
    ],
    likes: 178,
    isLiked: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#exclusive', '#limitededition', '#swm'],
  },
  {
    id: '6',
    userId: 'user_jordan',
    userName: 'Jordan Parker',
    userHandle: 'jordan_parker',
    userAvatar: 'https://i.pravatar.cc/150?img=6',
    image: 'd4.jpg',
    caption: 'The Hear My Voice mission resonates with me. Empowering through fashion! 🙌',
    description: 'A collection that truly empowers and inspires. Love the mission!',
    productId: '8',
    products: [
      {
        name: 'Hear My Voice Collection',
        collection: 'SWMSOCIETY x HEAR MY VOICE',
      },
    ],
    likes: 142,
    isLiked: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    hashtags: ['#empowerment', '#hearMyVoice', '#fashion'],
  },
];

export const communityService = {
  /**
   * Get all community posts
   * @returns Array of community posts
   */
  getAll: (): Promise<CommunityPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockCommunityPosts]);
      }, 300);
    });
  },

  /**
   * Get community posts with pagination
   * @param page - Page number (1-indexed)
   * @param limit - Number of posts per page
   * @returns Array of community posts
   */
  getPaginated: (page: number = 1, limit: number = 6): Promise<CommunityPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        resolve([...mockCommunityPosts.slice(startIndex, endIndex)]);
      }, 300);
    });
  },

  /**
   * Like a community post
   * @param postId - Post ID
   * @returns Updated post
   */
  likePost: (postId: string): Promise<CommunityPost | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = mockCommunityPosts.find((p) => p.id === postId);
        if (post) {
          post.isLiked = !post.isLiked;
          post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
          resolve({ ...post });
        }
        resolve(null);
      }, 300);
    });
  },

  /**
   * Get a single community post by ID
   * @param postId - Post ID
   * @returns Community post or null
   */
  getById: (postId: string): Promise<CommunityPost | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = mockCommunityPosts.find((p) => p.id === postId);
        resolve(post ? { ...post } : null);
      }, 300);
    });
  },

  /**
   * Get mock community posts (for initial load)
   * @returns Array of mock posts
   */
  getMockPosts: (): CommunityPost[] => {
    return [...mockCommunityPosts];
  },

  /**
   * Get community posts by user ID
   * @param userId - User ID
   * @returns Array of community posts for the user
   */
  getByUserId: (userId: string): Promise<CommunityPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userPosts = mockCommunityPosts.filter((p) => p.userId === userId);
        resolve([...userPosts]);
      }, 300);
    });
  },

  /**
   * Delete a community post
   * @param postId - Post ID
   * @returns Success status
   */
  deletePost: (postId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockCommunityPosts.findIndex((p) => p.id === postId);
        if (index > -1) {
          mockCommunityPosts.splice(index, 1);
          resolve(true);
        }
        resolve(false);
      }, 300);
    });
  },
};

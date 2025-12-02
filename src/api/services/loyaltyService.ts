import type { LoyaltyTransaction } from '../../types/loyalty';

// Dummy loyalty data
const dummyLoyaltyData = {
  userId: 'user1',
  totalPoints: 3450,
  totalEarned: 12890,
  totalRedeemed: 9440,
  lastUpdated: new Date().toISOString(),
  transactions: [
    {
      id: 'txn_001',
      userId: 'user1',
      type: 'earned',
      points: 250,
      orderId: '#ORD-2024-1155',
      description: 'Purchase Reward',
      date: '2025-01-10T14:34:00Z',
      balance: 3450,
    },
    {
      id: 'txn_002',
      userId: 'user1',
      type: 'redeemed',
      points: -2000,
      orderId: '#ORD-2024-1156',
      description: 'Discount Redeemed',
      date: '2025-01-12T10:22:00Z',
      balance: 3200,
    },
    {
      id: 'txn_003',
      userId: 'user1',
      type: 'earned',
      points: 180,
      orderId: '#ORD-2024-1048',
      description: 'Purchase Reward',
      date: '2025-01-08T07:45:00Z',
      balance: 5200,
    },
    {
      id: 'txn_004',
      userId: 'user1',
      type: 'redeemed',
      points: -2000,
      orderId: '#ORD-2024-1156',
      description: 'Discount Redeemed',
      date: '2025-01-12T10:22:00Z',
      balance: 3200,
    },
    {
      id: 'txn_005',
      userId: 'user1',
      type: 'earned',
      points: 320,
      orderId: '#ORD-2024-0687',
      description: 'Purchase Reward',
      date: '2024-12-28T03:29:00Z',
      balance: 4370,
    },
  ] as LoyaltyTransaction[],
};

export const loyaltyService = {
  /**
   * Get loyalty wallet data for a user
   */
  async getLoyaltyWallet() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be: 
      // const response = await apiClient.get(`/loyalty/wallet/${userId}`);
      
      return dummyLoyaltyData;
    } catch (error) {
      console.error('Failed to fetch loyalty wallet:', error);
      throw error;
    }
  },

  /**
   * Get loyalty transaction history
   */
  async getTransactionHistory(userId: string, limit: number = 50) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        userId,
        transactions: dummyLoyaltyData.transactions.slice(0, limit),
        total: dummyLoyaltyData.transactions.length,
      };
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      throw error;
    }
  },

  /**
   * Add points manually (admin only)
   */
  async addPoints(userId: string, points: number, reason: string) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In production: POST /loyalty/points/add
      return {
        success: true,
        newBalance: dummyLoyaltyData.totalPoints + points,
        transaction: {
          id: `txn_${Date.now()}`,
          userId,
          type: 'earned',
          points,
          description: reason,
          date: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Failed to add points:', error);
      throw error;
    }
  },

  /**
   * Remove points manually (admin only)
   */
  async removePoints(userId: string, points: number, reason: string) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In production: POST /loyalty/points/remove
      return {
        success: true,
        newBalance: dummyLoyaltyData.totalPoints - points,
        transaction: {
          id: `txn_${Date.now()}`,
          userId,
          type: 'redeemed',
          points: -points,
          description: reason,
          date: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Failed to remove points:', error);
      throw error;
    }
  },

  /**
   * Redeem points
   */
  async redeemPoints(userId: string, points: number, rewardId: string) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In production: POST /loyalty/redeem
      return {
        success: true,
        newBalance: dummyLoyaltyData.totalPoints - points,
        rewardId,
        transactionId: `txn_${Date.now()}`,
      };
    } catch (error) {
      console.error('Failed to redeem points:', error);
      throw error;
    }
  },
};

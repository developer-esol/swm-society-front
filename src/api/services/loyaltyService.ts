import type {
  LoyaltyTransaction,
  LoyaltyBalance,
  MaxRedeemableCalculation,
  RedeemPointsRequest,
  RedeemPointsResponse,
} from '../../types/loyalty';
import { apiClient } from '../apiClient';

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
   * GET /loyalty-points/user/:userId/history
   */
  async getTransactionHistory(userId: string | number) {
    try {
      const raw = await apiClient.get<any>(`/loyalty-points/user/${userId}/history`);

      // Normalize response shapes: API may return { transactions: [...] } or { data: { transactions: [...] } } or the array directly
      let items: any[] = [];
      if (Array.isArray(raw)) {
        items = raw;
      } else if (raw.transactions && Array.isArray(raw.transactions)) {
        items = raw.transactions;
      } else if (raw.data && raw.data.transactions && Array.isArray(raw.data.transactions)) {
        items = raw.data.transactions;
      } else if (raw.data && Array.isArray(raw.data)) {
        items = raw.data;
      }

      // Coerce into LoyaltyTransaction shape and normalize date fields
      const transactions: LoyaltyTransaction[] = items.map((t: any) => {
        const id = t.id || t.transactionId || `${t.type}_${Date.now()}`;
        const type = t.type || (t.points && Number(t.points) < 0 ? 'redeemed' : 'earned');
        const points = Number(t.points ?? t.amount ?? 0);
        const orderId = t.orderId || t.order_id || t.reference || t.source || '';
        // Create meaningful description based on order info
        let description = t.description || t.note || '';
        if (!description && orderId) {
          description = points > 0 ? `Points earned from order ${orderId}` : `Points redeemed for order ${orderId}`;
        } else if (!description) {
          description = points > 0 ? 'Points Earned' : 'Points Redeemed';
        }

        // Normalize date: prioritize earnedAt field from database
        let dateVal = t.earnedAt || t.createdAt || t.created_at || t.date || t.timestamp || t.time || null;
        
        // Log which date field was used (for debugging)
        if (t.earnedAt) {
          console.log(`Transaction ${id}: Using earnedAt date:`, t.earnedAt);
        } else if (t.createdAt) {
          console.log(`Transaction ${id}: Using createdAt date:`, t.createdAt);
        }
        
        if (dateVal) {
          if (typeof dateVal === 'number' || (typeof dateVal === 'string' && /^[0-9]+$/.test(dateVal))) {
            // numeric timestamp in seconds or ms
            const n = Number(dateVal);
            // If seconds (10 digits) convert to ms
            const ms = String(n).length === 10 ? n * 1000 : n;
            dateVal = new Date(ms).toISOString();
          } else if (typeof dateVal === 'string') {
            // Ensure it's a valid date string (handles "2026-01-08 11:19:11.068" format)
            const testDate = new Date(dateVal);
            if (!isNaN(testDate.getTime())) {
              dateVal = testDate.toISOString();
            }
          }
        }

        const date = dateVal || new Date().toISOString();
        const balance = Number(t.balance ?? t.newBalance ?? t.runningBalance ?? 0);

        return {
          id,
          userId: t.userId || t.user_id || t.user || '',
          type,
          points,
          orderId,
          description,
          date,
          balance,
        } as LoyaltyTransaction;
      });

      return { transactions };
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

  /**
   * Get user's loyalty points balance
   * GET /loyalty-points/user/:userId/balance
   */
  async getUserBalance(userId: number | string): Promise<LoyaltyBalance> {
    try {
      const raw = await apiClient.get<any>(`/loyalty-points/user/${userId}/balance`);

      // Normalize possible response shapes
      const source = raw?.data || raw;

      const balance: LoyaltyBalance = {
        availablePoints: Number(source?.availablePoints ?? source?.available ?? 0),
        totalEarned: Number(source?.totalEarned ?? source?.earned ?? 0),
        totalRedeemed: Number(source?.totalRedeemed ?? source?.redeemed ?? 0),
        totalExpired: Number(source?.totalExpired ?? source?.expired ?? 0),
        availableValue: Number(source?.availableValue ?? 0),
      };

      return balance;
    } catch (error) {
      console.error('Failed to fetch loyalty balance:', error);
      throw error;
    }
  },

  /**
   * Calculate maximum redeemable points for a basket total
   * GET /loyalty-points/calculate-max-redeemable/:basketTotal
   */
  async calculateMaxRedeemable(basketTotal: number): Promise<MaxRedeemableCalculation> {
    try {
      const response = await apiClient.get<MaxRedeemableCalculation>(
        `/loyalty-points/calculate-max-redeemable/${basketTotal}`
      );
      return response;
    } catch (error) {
      console.error('Failed to calculate max redeemable:', error);
      throw error;
    }
  },

  /**
   * Redeem loyalty points during checkout
   * POST /loyalty-points/redeem
   */
  async redeemLoyaltyPoints(request: RedeemPointsRequest): Promise<RedeemPointsResponse> {
    try {
      const response = await apiClient.post<RedeemPointsResponse>(
        '/loyalty-points/redeem',
        request
      );
      return response;
    } catch (error) {
      console.error('Failed to redeem loyalty points:', error);
      throw error;
    }
  },
};

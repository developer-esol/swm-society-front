export interface LoyaltyTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'redeemed' | 'adjustment';
  points: number;
  orderId?: string;
  description: string;
  date: string;
  balance: number;
}

export interface LoyaltyWallet {
  userId: string;
  totalPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  lastUpdated: string;
  transactions: LoyaltyTransaction[];
}

export interface RedeemRewardRequest {
  userId: string;
  points: number;
  rewardId: string;
}

export interface RedeemRewardResponse {
  success: boolean;
  newBalance: number;
  rewardId: string;
  transactionId: string;
}

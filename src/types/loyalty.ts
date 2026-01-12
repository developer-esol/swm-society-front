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

export interface LoyaltyBalance {
  availablePoints: number;
  totalEarned: number;
  totalRedeemed: number;
  totalExpired: number;
  availableValue: number; // £ discount available
}

export interface MaxRedeemableCalculation {
  basketTotal: number;
  maxRedeemablePoints: number;
  maxDiscountAmount: number;
  maxDiscountPercentage: number;
}

export interface RedeemPointsRequest {
  userId: number | string;
  pointsToRedeem: number;
  basketTotal: number;
  orderId: string;
}

export interface RedeemPointsResponse {
  success: boolean;
  pointsRedeemed: number;
  discountAmount: number;
  message: string;
}

export interface LeaderboardUser {
  userId: string;
  userName: string;
  totalEarned: number;
  availablePoints: number;
  rank: number;
}

export type LoyaltyTransactionType = 'earned' | 'redeemed' | 'adjustment'

export interface LoyaltyTransaction {
  id: string
  date: string
  type: LoyaltyTransactionType
  points: number
  orderId: string
  description: string
  balance: number
  name: string
}

export interface CustomerLoyaltyData {
  customerName: string
  customerId: string
  availablePoints: number
  totalPoints: number
  pointsRedeemed: number
  transactions: LoyaltyTransaction[]
}

export interface AdjustPointsRequest {
  points: number
  reason: string
}

import type { CustomerLoyaltyData, LoyaltyTransaction } from '../../../types/Admin/loyalty'

// Using same customer names from access control service
const mockCustomers = [
  { name: 'Sarah Chen', id: '#CUS-001234' },
  { name: 'Mike Johnson', id: '#CUS-001235' },
  { name: 'Emily Davis', id: '#CUS-001236' },
  { name: 'David Wilson', id: '#CUS-001237' },
  { name: 'Lisa Brown', id: '#CUS-001238' },
  { name: 'James Martinez', id: '#CUS-001239' },
  { name: 'Jessica Taylor', id: '#CUS-001240' },
]

// Dummy transactions (7 transactions)
const mockTransactions: LoyaltyTransaction[] = [
  {
    id: 'txn_001',
    date: 'Nov 25, 2024',
    type: 'earned',
    points: 150,
    orderId: '#ORD-2847',
    description: 'Purchase reward',
    balance: 2450,
    name: 'Sarah Chen',
  },
  {
    id: 'txn_002',
    date: 'Nov 20, 2024',
    type: 'redeemed',
    points: -300,
    orderId: '#ORD-2820',
    description: 'Discount applied',
    balance: 2300,
    name: 'Sarah Chen',
  },
  {
    id: 'txn_003',
    date: 'Nov 18, 2024',
    type: 'earned',
    points: 75,
    orderId: '#ORD-2819',
    description: 'Purchase reward',
    balance: 2500,
    name: 'Sarah Chen',
  },
  {
    id: 'txn_004',
    date: 'Nov 15, 2024',
    type: 'earned',
    points: 500,
    orderId: '#ORD-2810',
    description: 'Purchase reward',
    balance: 2425,
    name: 'Sarah Chen',
  },
  {
    id: 'txn_005',
    date: 'Nov 12, 2024',
    type: 'redeemed',
    points: -100,
    orderId: '#ORD-2790',
    description: 'Free shipping',
    balance: 1925,
    name: 'Sarah Chen',
  },
  {
    id: 'txn_006',
    date: 'Nov 08, 2024',
    type: 'earned',
    points: 200,
    orderId: '#ORD-2745',
    description: 'Purchase reward',
    balance: 2025,
    name: 'Sarah Chen',
  },
  {
    id: 'txn_007',
    date: 'Nov 05, 2024',
    type: 'earned',
    points: 125,
    orderId: '#ORD-2698',
    description: 'Purchase reward',
    balance: 1825,
    name: 'Sarah Chen',
  },
]

class AdminLoyaltyService {
  private mockTransactions: LoyaltyTransaction[] = mockTransactions

  /**
   * Get customer loyalty data by ID or use default
   */
  async getCustomerLoyalty(customerId?: string): Promise<CustomerLoyaltyData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = customerId || '#CUS-001234'
        const customer = mockCustomers.find((c) => c.id === id) || mockCustomers[0]
        resolve({
          customerName: customer.name,
          customerId: customer.id,
          availablePoints: 2450,
          totalPoints: 3400,
          pointsRedeemed: 950,
          transactions: [...this.mockTransactions],
        })
      }, 300)
    })
  }

  /**
   * Search customers by name or ID
   */
  async searchCustomers(query: string): Promise<typeof mockCustomers> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query.trim()) {
          resolve([])
          return
        }
        const results = mockCustomers.filter(
          (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase())
        )
        resolve(results)
      }, 300)
    })
  }

  /**
   * Get all customers
   */
  async getCustomers(): Promise<typeof mockCustomers> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockCustomers])
      }, 300)
    })
  }

  /**
   * Search transactions by date range or type
   */
  async searchTransactions(
    filters?: {
      startDate?: string
      endDate?: string
      type?: 'earned' | 'redeemed' | 'adjustment'
    }
  ): Promise<LoyaltyTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.mockTransactions]

        if (filters?.type) {
          filtered = filtered.filter((t) => t.type === filters.type)
        }

        resolve(filtered)
      }, 300)
    })
  }

  /**
   * Add points to customer (admin)
   */
  async addPoints(
    _customerId: string,
    points: number,
    reason: string
  ): Promise<{ success: boolean; newBalance: number; transaction: LoyaltyTransaction }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBalance = 2450 + points
        const newTransaction: LoyaltyTransaction = {
          id: `txn_${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          type: 'adjustment',
          points: points,
          orderId: '#ADM-' + Date.now().toString().slice(-4),
          description: reason,
          balance: newBalance,
          name: 'Sarah Chen',
        }

        this.mockTransactions.unshift(newTransaction)

        resolve({
          success: true,
          newBalance,
          transaction: newTransaction,
        })
      }, 300)
    })
  }

  /**
   * Get paginated transactions
   */
  async getTransactionsPaginated(page: number = 1, limit: number = 5): Promise<{
    transactions: LoyaltyTransaction[]
    total: number
    page: number
    limit: number
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginated = this.mockTransactions.slice(startIndex, endIndex)

        resolve({
          transactions: paginated,
          total: this.mockTransactions.length,
          page,
          limit,
        })
      }, 300)
    })
  }
}

export const adminLoyaltyService = new AdminLoyaltyService()

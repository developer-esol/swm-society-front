import { apiClient, authApiClient } from '../../apiClient'
import type { CustomerLoyaltyData, LoyaltyTransaction } from '../../../types/Admin/loyalty'

class AdminLoyaltyService {

  /**
   * Get customer loyalty data by ID from API
   */
  async getCustomerLoyalty(userId: string): Promise<CustomerLoyaltyData> {
    try {
      // Fetch user data and loyalty balance in parallel
      const [userResponse, balanceResponse, historyResponse] = await Promise.all([
        authApiClient.get<any>(`/api/users/${userId}`),
        apiClient.get<any>(`/loyalty-points/user/${userId}/balance`),
        apiClient.get<any>(`/loyalty-points/user/${userId}/history`)
      ])

      const user = userResponse?.data || userResponse
      const balance = balanceResponse?.data || balanceResponse
      const history = historyResponse?.data || historyResponse

      // Parse transactions
      let transactionItems: any[] = []
      if (Array.isArray(history)) {
        transactionItems = history
      } else if (history.transactions && Array.isArray(history.transactions)) {
        transactionItems = history.transactions
      } else if (history.data && Array.isArray(history.data)) {
        transactionItems = history.data
      }

      const transactions: LoyaltyTransaction[] = transactionItems.map((t: any) => {
        const points = Number(t.points || 0)
        const isEarned = points > 0
        
        return {
          id: t.id || String(Date.now()),
          date: t.earnedAt || t.createdAt || new Date().toISOString(),
          type: isEarned ? 'earned' : 'redeemed',
          points: Math.abs(points),
          orderId: t.source || t.orderId || '—',
          description: t.description || (isEarned ? 'Points Earned' : 'Discount Redeemed'),
          balance: Number(t.balance || 0),
          name: user.fullName || user.email,
        }
      })

      return {
        customerName: user.fullName || user.email,
        customerId: String(user.id),
        availablePoints: Number(balance.availablePoints || 0),
        totalPoints: Number(balance.totalEarned || 0),
        pointsRedeemed: Number(balance.totalRedeemed || 0),
        transactions: transactions,
      }
    } catch (error) {
      console.error('Failed to fetch customer loyalty data:', error)
      throw error
    }
  }

  /**
   * Search users by name or email
   */
  async searchCustomers(query: string): Promise<Array<{ name: string; id: string }>> {
    try {
      if (!query.trim()) {
        return []
      }

      const response = await authApiClient.get<any>('/api/users')
      const data = response?.data || response
      const users = Array.isArray(data) ? data : []

      return users
        .filter((user: any) => {
          const name = (user.fullName || user.email || '').toLowerCase()
          const email = (user.email || '').toLowerCase()
          const searchQuery = query.toLowerCase()
          return name.includes(searchQuery) || email.includes(searchQuery)
        })
        .map((user: any) => ({
          name: user.fullName || user.email,
          id: String(user.id),
        }))
    } catch (error) {
      console.error('Failed to search customers:', error)
      return []
    }
  }

  /**
   * Get all users
   */
  async getCustomers(): Promise<Array<{ name: string; id: string; uuid?: string }>> {
    try {
      const response = await authApiClient.get<any>('/api/users')
      const data = response?.data || response
      const users = Array.isArray(data) ? data : []

      return users.map((user: any) => {
        console.log('User data:', user) // Debug log to see actual structure
        return {
          name: user.fullName || user.email,
          id: String(user.externalId || user.id), // externalId is the numeric ID
          uuid: user.id, // id field contains the UUID
        }
      })
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      return []
    }
  }

  /**
   * Get all loyalty transactions across all users
   */
  async getAllLoyaltyTransactions(): Promise<LoyaltyTransaction[]> {
    try {
      // Get all users first
      const users = await this.getCustomers()
      
      // Get transaction history for all users in parallel
      const historyPromises = users.map(user => 
        apiClient.get<any>(`/loyalty-points/user/${user.id}/history`)
          .then(response => {
            const history = response?.data || response
            let transactionItems: any[] = []
            
            if (Array.isArray(history)) {
              transactionItems = history
            } else if (history.transactions && Array.isArray(history.transactions)) {
              transactionItems = history.transactions
            } else if (history.data && Array.isArray(history.data)) {
              transactionItems = history.data
            }

            return transactionItems.map((t: any) => {
              const points = Number(t.points || 0)
              const isEarned = points > 0
              
              return {
                id: t.id || String(Date.now()),
                date: t.earnedAt || t.createdAt || new Date().toISOString(),
                type: isEarned ? 'earned' : 'redeemed',
                points: Math.abs(points),
                orderId: t.source || t.orderId || '—',
                description: t.description || (isEarned ? 'Points Earned' : 'Discount Redeemed'),
                balance: Number(t.balance || 0),
                name: user.name,
              }
            })
          })
          .catch(error => {
            console.error(`Failed to fetch history for user ${user.id}:`, error)
            return []
          })
      )

      const allTransactionArrays = await Promise.all(historyPromises)
      const allTransactions = allTransactionArrays.flat()

      // Sort by date descending
      allTransactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })

      return allTransactions
    } catch (error) {
      console.error('Failed to fetch all loyalty transactions:', error)
      return []
    }
  }

  /**
   * Add points to customer (admin) - NOT IMPLEMENTED YET
   */
  async addPoints(
    _customerId: string,
    _points: number,
    _reason: string
  ): Promise<{ success: boolean; newBalance: number; transaction: LoyaltyTransaction }> {
    console.warn('Add points API not implemented yet')
    // TODO: Implement API call when endpoint is ready
    // await apiClient.post('/loyalty-points/admin/add', { userId: customerId, points, reason })
    
    throw new Error('Add points functionality not yet implemented')
  }
}

export const adminLoyaltyService = new AdminLoyaltyService()

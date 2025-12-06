import type { SalesTransaction, SalesData, SalesFilters } from '../../../types/Admin/sales'

// Dummy transactions data (25 transactions for pagination testing)
const mockTransactions: SalesTransaction[] = Array.from({ length: 25 }, (_, i) => ({
  id: `sale_${String(i + 1).padStart(3, '0')}`,
  orderId: '001',
  userId: '001',
  productId: '001',
  quantity: 2,
  size: i % 2 === 0 ? 'M' : 'XL',
  color: i % 3 === 0 ? 'Green' : 'Red',
  unitPrice: i % 2 === 0 ? 100 : 150,
  total: 250,
  date: '10-10-2025',
  status: (
    ['Pending', 'Packaged', 'Delivered', 'Returned'][i % 4] as SalesTransaction['status']
  ),
}))

class AdminSalesService {
  private mockTransactions: SalesTransaction[] = mockTransactions

  /**
   * Get all sales transactions
   */
  async getSalesTransactions(): Promise<SalesData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactions: [...this.mockTransactions],
          total: this.mockTransactions.reduce((sum, t) => sum + t.total, 0),
          count: this.mockTransactions.length,
        })
      }, 300)
    })
  }

  /**
   * Search transactions by order ID, user ID, or product ID
   */
  async searchTransactions(query: string): Promise<SalesTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query.trim()) {
          resolve([...this.mockTransactions])
          return
        }
        const results = this.mockTransactions.filter(
          (t) =>
            t.orderId.toLowerCase().includes(query.toLowerCase()) ||
            t.userId.toLowerCase().includes(query.toLowerCase()) ||
            t.productId.toLowerCase().includes(query.toLowerCase())
        )
        resolve(results)
      }, 300)
    })
  }

  /**
   * Get transactions with pagination
   */
  async getTransactionsPaginated(page: number = 1, limit: number = 5): Promise<{
    transactions: SalesTransaction[]
    total: number
    page: number
    limit: number
    totalPages: number
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
          totalPages: Math.ceil(this.mockTransactions.length / limit),
        })
      }, 300)
    })
  }

  /**
   * Filter transactions by status or date range
   */
  async filterTransactions(filters: SalesFilters): Promise<SalesTransaction[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.mockTransactions]

        if (filters.status && filters.status !== 'all') {
          filtered = filtered.filter((t) => t.status === filters.status)
        }

        resolve(filtered)
      }, 300)
    })
  }
}

export const adminSalesService = new AdminSalesService()

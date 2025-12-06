import { useState, useCallback, useEffect, useMemo } from 'react'
import { adminLoyaltyService } from '../../api/services/admin/loyaltyService'
import type { CustomerLoyaltyData, LoyaltyTransaction, LoyaltyTransactionType } from '../../types/Admin/loyalty'

export const useAdminLoyalty = () => {
  const [customerData, setCustomerData] = useState<CustomerLoyaltyData | null>(null)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState<LoyaltyTransactionType | 'all'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('#CUS-001234')

  const ITEMS_PER_PAGE = 5

  // Load customer loyalty data on mount or when customer changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await adminLoyaltyService.getCustomerLoyalty(selectedCustomerId)
        setCustomerData(data)
        setTransactions(data.transactions)
        setCurrentPage(1)
      } catch (error) {
        console.error('Failed to load loyalty data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedCustomerId])

  // Filter transactions based on type
  const filteredTransactions = useMemo(() => {
    if (filterType === 'all') {
      return transactions
    }
    return transactions.filter((t) => t.type === filterType)
  }, [transactions, filterType])

  // Paginate transactions
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleFilterChange = useCallback((type: LoyaltyTransactionType | 'all') => {
    setFilterType(type)
    setCurrentPage(1) // Reset to first page when changing filter
  }, [])

  const handleAddPoints = useCallback(
    async (points: number, reason: string) => {
      try {
        const result = await adminLoyaltyService.addPoints('#CUS-001234', points, reason)
        if (result.success && customerData) {
          // Update transactions
          setTransactions((prev) => [result.transaction, ...prev])

          // Update customer data
          setCustomerData({
            ...customerData,
            availablePoints: result.newBalance,
            totalPoints: customerData.totalPoints + points,
          })
        }
        return result
      } catch (error) {
        console.error('Failed to add points:', error)
        throw error
      }
    },
    [customerData]
  )

  const handleSelectCustomer = useCallback((customerId: string) => {
    setSelectedCustomerId(customerId)
  }, [])

  return {
    customerData,
    transactions: paginatedTransactions,
    filteredTransactions,
    currentPage,
    totalPages,
    filterType,
    isLoading,
    handlePageChange,
    handleFilterChange,
    handleAddPoints,
    handleSelectCustomer,
  }
}

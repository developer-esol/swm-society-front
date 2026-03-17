import { useState, useCallback, useEffect, useMemo } from 'react'
import { adminLoyaltyService } from '../../api/services/admin/loyaltyService'
import type { CustomerLoyaltyData, LoyaltyTransaction, LoyaltyTransactionType } from '../../types/Admin/loyalty'

export const useAdminLoyalty = () => {
  const [customerData, setCustomerData] = useState<CustomerLoyaltyData | null>(null)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState<LoyaltyTransactionType | 'all'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [allTransactions, setAllTransactions] = useState<LoyaltyTransaction[]>([])

  const ITEMS_PER_PAGE = 5

  // Load all transactions on mount
  useEffect(() => {
    const loadAllTransactions = async () => {
      setIsLoading(true)
      try {
        const data = await adminLoyaltyService.getAllLoyaltyTransactions()
        setAllTransactions(data)
        setTransactions(data)
        console.log('Loaded all transactions:', data.length)
      } catch (error) {
        console.error('Failed to load all transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAllTransactions()
  }, [])

  // Load customer loyalty data when customer is selected
  useEffect(() => {
    const loadData = async () => {
      if (!selectedCustomerId) {
        // Show all transactions when no customer selected
        setCustomerData(null)
        setTransactions(allTransactions)
        return
      }

      setIsLoading(true)
      try {
        const data = await adminLoyaltyService.getCustomerLoyalty(selectedCustomerId)
        setCustomerData(data)
        setTransactions(data.transactions)
        setCurrentPage(1)
      } catch (error) {
        console.error('Failed to load loyalty data:', error)
        setCustomerData(null)
        setTransactions(allTransactions)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedCustomerId, allTransactions])

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

  const handleSelectCustomer = useCallback((customerId: string | null) => {
    setSelectedCustomerId(customerId)
  }, [])

  // Calculate aggregated stats for all transactions
  const aggregatedStats = useMemo(() => {
    const earnedTransactions = allTransactions.filter(t => t.type === 'earned')
    const redeemedTransactions = allTransactions.filter(t => t.type === 'redeemed')
    
    const totalEarned = earnedTransactions.reduce((sum, t) => sum + t.points, 0)
    const totalRedeemed = redeemedTransactions.reduce((sum, t) => sum + t.points, 0)
    const remaining = totalEarned - totalRedeemed

    return {
      totalEarned,
      totalRedeemed,
      remaining,
    }
  }, [allTransactions])

  return {
    customerData,
    transactions: paginatedTransactions,
    filteredTransactions,
    currentPage,
    totalPages,
    filterType,
    isLoading,
    aggregatedStats,
    handlePageChange,
    handleFilterChange,
    handleAddPoints,
    handleSelectCustomer,
  }
}

import { useState, useCallback, useEffect, useMemo } from 'react'
import { adminSalesService } from '../../api/services/admin/salesService'
import type { SalesTransaction } from '../../types/Admin/sales'

export const useAdminSales = () => {
  const [transactions, setTransactions] = useState<SalesTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | SalesTransaction['status']>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const ITEMS_PER_PAGE = 5

  // Load transactions on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await adminSalesService.getSalesTransactions()
        setTransactions(data.transactions)
      } catch (error) {
        console.error('Failed to load sales data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (t) =>
          t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.productId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status === filterStatus)
    }

    // Apply date range filter
    if (fromDate || toDate) {
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.date)
        if (fromDate) {
          const from = new Date(fromDate)
          if (transactionDate < from) return false
        }
        if (toDate) {
          const to = new Date(toDate)
          if (transactionDate > to) return false
        }
        return true
      })
    }

    return filtered
  }, [transactions, searchQuery, filterStatus, fromDate, toDate])

  // Paginate transactions
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }, [])

  const handleFilterChange = useCallback((status: 'all' | SalesTransaction['status']) => {
    setFilterStatus(status)
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  const handleDateFilterChange = useCallback((from: string, to: string) => {
    setFromDate(from)
    setToDate(to)
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  return {
    transactions: paginatedTransactions,
    filteredTransactions,
    currentPage,
    totalPages,
    isLoading,
    searchQuery,
    filterStatus,
    fromDate,
    toDate,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    handleDateFilterChange,
  }
}

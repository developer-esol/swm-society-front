import { useState, useCallback, useEffect, useMemo } from 'react'
import { orderService } from '../../api/services/orderService'
import type { Order } from '../../types/order'

export const useAdminSales = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const ITEMS_PER_PAGE = 10

  // Load orders on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await orderService.getAllOrders(1, 100) // Fetch all orders
        setOrders(data.orders)
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter and search orders
  const filteredTransactions = useMemo(() => {
    let filtered = [...orders]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply date range filter
    if (fromDate || toDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date || order.createdAt)
        if (fromDate) {
          const from = new Date(fromDate)
          if (orderDate < from) return false
        }
        if (toDate) {
          const to = new Date(toDate)
          if (orderDate > to) return false
        }
        return true
      })
    }

    return filtered
  }, [orders, searchQuery, fromDate, toDate])

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
    searchQuery,
    fromDate,
    toDate,
    isLoading,
    handleSearch,
    handlePageChange,
    handleDateFilterChange,
  }
}

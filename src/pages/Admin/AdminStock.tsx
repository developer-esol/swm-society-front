import { Box, Container, Typography, Pagination, Stack } from '@mui/material'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { StockTable, StockTableHeader, StockEditModal } from '../../features/Admin/stock'
import { useStockStore } from '../../store/useStockStore'
import { colors } from '../../theme'
import type { StockItem } from '../../types/Admin'

const AdminStock = () => {
  const navigate = useNavigate()
  const { stockItems, initializeStockItems, updateStockItem, deleteStockItem } = useStockStore()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  // Initialize stock items on mount
  useEffect(() => {
    if (stockItems.length === 0) {
      initializeStockItems()
    }
  }, [initializeStockItems, stockItems.length])

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return stockItems
    return stockItems.filter(
      (item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, stockItems])

  // Paginate items
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleEdit = (item: StockItem) => {
    setSelectedItem(item)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedItem(null)
  }

  const handleSaveEdit = (updatedItem: StockItem) => {
    updateStockItem(updatedItem)
    setEditModalOpen(false)
    setSelectedItem(null)
  }

  const handleDeleteItem = (id: string) => {
    deleteStockItem(id)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleAddStock = () => {
    navigate('/admin/add-stock')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 4, md: 4 },
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, sm: 4 },
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Your Stock
        </Typography>

        <StockTableHeader searchQuery={searchQuery} onSearch={handleSearch} onAddStock={handleAddStock} />

        <StockTable items={paginatedItems} onEdit={handleEdit} onDelete={handleDeleteItem} />

        {/* Pagination and Info */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
              {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, filteredItems.length)} of {filteredItems.length} items
            </Typography>
            <Stack spacing={2} direction="row">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: colors.text.primary,
                    borderColor: colors.border.default,
                    '&.Mui-selected': {
                      backgroundColor: '#dc2626',
                      color: 'white',
                    },
                  },
                }}
              />
            </Stack>
          </Box>
        )}

        {/* Fallback text when no pagination needed */}
        {totalPages <= 1 && filteredItems.length > 0 && (
          <Typography
            sx={{
              mt: 3,
              color: colors.text.secondary,
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            1-{filteredItems.length} of {filteredItems.length} items
          </Typography>
        )}

        <StockEditModal open={editModalOpen} item={selectedItem} onClose={handleCloseEditModal} onSave={handleSaveEdit} />
      </Container>
    </Box>
  )
}

export default AdminStock

import { Box, Container, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
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
  const [displayItems, setDisplayItems] = useState<StockItem[]>(stockItems)
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize stock items on mount
  useEffect(() => {
    if (stockItems.length === 0) {
      initializeStockItems()
    }
  }, [initializeStockItems, stockItems.length])

  // Update display items when store items change
  useEffect(() => {
    setDisplayItems(stockItems)
  }, [stockItems])

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
    if (query.trim()) {
      const filtered = stockItems.filter(
        (item) =>
          item.productName.toLowerCase().includes(query.toLowerCase()) ||
          item.color.toLowerCase().includes(query.toLowerCase()) ||
          item.size.toLowerCase().includes(query.toLowerCase()) ||
          item.id.toLowerCase().includes(query.toLowerCase())
      )
      setDisplayItems(filtered)
    } else {
      setDisplayItems(stockItems)
    }
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

        <StockTable items={displayItems} onEdit={handleEdit} onDelete={handleDeleteItem} />

        <Typography
          sx={{
            mt: 3,
            color: colors.text.secondary,
            fontSize: '0.875rem',
            textAlign: 'center',
          }}
        >
          1-05 of 3 products
        </Typography>

        <StockEditModal open={editModalOpen} item={selectedItem} onClose={handleCloseEditModal} onSave={handleSaveEdit} />
      </Container>
    </Box>
  )
}

export default AdminStock

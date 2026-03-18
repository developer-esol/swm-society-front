import { Box, Container, Typography, Pagination, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, IconButton } from '@mui/material'
import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search as SearchIcon } from '@mui/icons-material'
import { StockTable, StockEditModal } from '../../features/Admin/stock'
import StockViewModal from '../../features/Admin/stock/StockViewModal'
import { useAllStocks, useAllProducts, useUpdateStock, useDeleteStock } from '../../hooks/useStock'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import type { StockItem } from '../../types/Admin'
import { Permission } from '../../components/Permission'
import { PERMISSIONS } from '../../configs/permissions'

const AdminStock = () => {
  const navigate = useNavigate()
  const { brandSlug } = useParams<{ brandSlug: string }>()
  const brandFilter = brandSlug // Get brand from URL params
  const { data: stocks = [] } = useAllStocks(brandFilter)
  const { data: products = [] } = useAllProducts()
  const updateStockMutation = useUpdateStock()
  const deleteStockMutation = useDeleteStock()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; stockId: string; stockName: string }>({ 
    open: false, 
    stockId: '', 
    stockName: '' 
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const ITEMS_PER_PAGE = 5

  // Get display name for page title
  const getBrandDisplayName = (slug: string | null) => {
    if (!slug) return null
    const displayMap: Record<string, string> = {
      'project-zero': 'Project Zero',
      'thomas-mushet': 'Thomas Mushet',
      'hear-my-voice': 'Hear My Voice'
    }
    return displayMap[slug] || null
  }

  // Map brand slugs to brand names for filtering
  const getBrandName = (slug: string | null) => {
    if (!slug) return null
    const brandMap: Record<string, string[]> = {
      'project-zero': ['Project Zero', 'Project ZerO', "Project ZerO's", 'Project Zeros'],
      'thomas-mushet': ['Thomas Mushet'],
      'hear-my-voice': ['Hear My Voice', 'HMV']
    }
    return brandMap[slug] || null
  }

  // Transform stocks data to include product names and match StockItem interface
  const stockItems = useMemo(() => {
    if (!stocks || !products) return []
    
    let items = stocks.map(stock => {
      const product = products.find(p => p.id === stock.productId)
      return {
        id: stock.id,
        itemId: stock.id,
        productName: product?.name || 'Unknown Product',
        brandName: product?.brandName || '',
        color: stock.color,
        size: stock.size,
        quantity: stock.quantity,
        price: stock.price,
        imageUrl: stock.imageUrl || ''
      }
    })

    // Filter by brand if brand query param exists
    const brandNames = getBrandName(brandFilter ?? null)
    if (brandNames) {
      items = items.filter(item => {
        const itemBrandName = (item.brandName as string)?.toLowerCase() || ''
        return brandNames.some(brandName => 
          itemBrandName.includes(brandName.toLowerCase())
        )
      })
    }

    return items
  }, [stocks, products, brandFilter])

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleAddStock = () => {
    navigate(`/admin/${brandFilter}/add-stock`)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedItem(null)
  }

  const handleSaveEdit = async (updatedItem: StockItem) => {
    try {
      // Find the original stock to get the productId for the update
      const originalStock = stocks.find(s => s.id === updatedItem.id)
      if (originalStock) {
        await updateStockMutation.mutateAsync({
          id: updatedItem.id,
          data: {
            productId: originalStock.productId,
            color: updatedItem.color,
            size: updatedItem.size,
            quantity: updatedItem.quantity,
            price: updatedItem.price
            // Don't send imageUrl - API doesn't expect it and it will be preserved automatically
          }
        })
      }
      setEditModalOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error('Failed to update stock:', error)
    }
  }

  const handleView = (item: StockItem) => {
    setSelectedItem(item)
    setViewModalOpen(true)
  }

  const handleEdit = (item: StockItem) => {
    setSelectedItem(item)
    setEditModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setSelectedItem(null)
  }

  const handleDelete = (id: string) => {
    const stockItem = stockItems.find(item => item.id === id)
    setDeleteConfirm({
      open: true,
      stockId: id,
      stockName: stockItem ? `${stockItem.productName} (${stockItem.size}, ${stockItem.color})` : 'this stock item'
    })
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteStockMutation.mutateAsync(deleteConfirm.stockId)
      setDeleteConfirm({ open: false, stockId: '', stockName: '' })
    } catch (error) {
      console.error('Failed to delete stock:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, stockId: '', stockName: '' })
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
        {/* Header */}
        <AdminBreadcrumbs 
          items={[
            { label: 'Dashboard', to: '/admin' },
            { label: getBrandDisplayName(brandFilter ?? null) || 'Stock', to: `/admin/${brandFilter ?? ''}/stock` }
          ]} 
        />
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          {getBrandDisplayName(brandFilter ?? null)} Stock
        </Typography>

        {/* Search Box with Add Button */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search Stock..."
              value={searchQuery}
              onChange={handleSearch}
              size="small"
              sx={{
                width: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: colors.background.default,
                },
              }}
            />
            <IconButton
              sx={{
                bgcolor: '#C62C2B',
                color: 'white',
                borderRadius: 1,
                p: 1,
                '&:hover': { bgcolor: '#A82421' },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          
          <Permission permission={(() => {
            if (!brandFilter) return PERMISSIONS.CREATE_STOCK
            const brandPermissionMap: Record<string, string> = {
              'project-zero': 'CREATE_STOCK_PROJECT_ZERO',
              'thomas-mushet': 'CREATE_STOCK_THOMAS_MUSHET',
              'hear-my-voice': 'CREATE_STOCK_HEAR_MY_VOICE'
            }
            const permissionKey = brandPermissionMap[brandFilter]
            return permissionKey ? PERMISSIONS[permissionKey as keyof typeof PERMISSIONS] : PERMISSIONS.CREATE_STOCK
          })()}>
            <Button
              variant="contained"
              onClick={handleAddStock}
              sx={{
                bgcolor: colors.button.primary,
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                py: 1,
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
              }}
            >
              Add Stock
            </Button>
          </Permission>
        </Box>
        <StockTable items={paginatedItems} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} brandFilter={brandFilter} />

        <StockViewModal
          open={viewModalOpen}
          stock={selectedItem}
          onClose={handleCloseViewModal}
        />

        {/* Pagination and Info */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
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
                      backgroundColor: colors.button.primary,
                      color: colors.text.secondary,
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

        <StockEditModal 
          open={editModalOpen} 
          item={selectedItem} 
          onClose={handleCloseEditModal} 
          onSave={handleSaveEdit}
          originalStock={selectedItem ? stocks.find(s => s.id === selectedItem.id) : undefined}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirm.open}
          onClose={cancelDelete}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(205, 159, 159, 0.12)',
            },
          }}
        >
          <DialogTitle 
            sx={{ 
              fontWeight: 700, 
              color: colors.text.primary,
              fontSize: '1.2rem',
              pb: 1,
            }}
          >
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: colors.text.primary, fontSize: '1rem' }}>
              Are you sure you want to delete "{deleteConfirm.stockName}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={cancelDelete}
              variant="outlined"
              sx={{
                borderColor: colors.border.default,
                color: colors.text.primary,
                '&:hover': {
                  backgroundColor: colors.background.lighter,
                  borderColor: colors.border.default,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              disabled={isDeleting}
              sx={{
                backgroundColor: colors.button.primary,
                color: colors.text.secondary,
                '&:hover': {
                  backgroundColor: colors.button.dark,
                },
                '&:disabled': {
                  backgroundColor: colors.button.primaryDisabled,
                },
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default AdminStock

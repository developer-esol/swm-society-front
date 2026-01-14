import { Box, Container, Typography, Pagination, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, IconButton } from '@mui/material'
import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from '@mui/icons-material'
import { ProductsTable, ProductViewModal, ProductEditModal } from '../../features/Admin/products'
import { useAdminProducts } from '../../hooks/useProducts'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import type { AdminProduct } from '../../types/Admin'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../configs/queryKeys'
import { deleteProduct } from '../../api/services/admin/productsService'
import { Permission } from '../../components/Permission'
import { PERMISSIONS } from '../../configs/permissions'

const AdminProducts = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const brandFilter = searchParams.get('brand') // Get brand from query params
  const { data: products = [], isLoading, error } = useAdminProducts(brandFilter)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; productId: string; productName: string }>({
    open: false,
    productId: '',
    productName: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

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

  // Filter products based on brand name and search query
  const filteredProducts = useMemo(() => {
    console.log('All products:', products)
    console.log('Brand filter slug:', brandFilter)
    let filtered = products

    // Filter by brand if brand query param exists
    const brandNames = getBrandName(brandFilter)
    console.log('Brand names to filter by:', brandNames)
    if (brandNames) {
      filtered = filtered.filter(product => {
        const productBrandName = product.brandName?.toLowerCase() || ''
        console.log('Checking product:', product.productName, 'Brand:', productBrandName)
        const matches = brandNames.some(brandName => 
          productBrandName.includes(brandName.toLowerCase())
        )
        console.log('Matches:', matches)
        return matches
      })
      console.log('Filtered products after brand filter:', filtered)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [searchQuery, products, brandFilter])

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleView = (product: AdminProduct) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setSelectedProduct(null)
  }

  const handleEdit = (product: AdminProduct) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleSaveEdit = (updatedProduct: AdminProduct) => {
    console.log('Update product:', updatedProduct)
    // TODO: Implement update functionality with API call
    setEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id)
    setDeleteConfirm({
      open: true,
      productId: id,
      productName: product?.productName || 'this product'
    })
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProduct(deleteConfirm.productId)
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.admin })
      setDeleteConfirm({ open: false, productId: '', productName: '' })
    } catch (error) {
      console.error('Error deleting product:', error)
      // You can add error handling here if needed
    } finally {
      setIsDeleting(false)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, productId: '', productName: '' })
  }

  const handleAddProduct = () => {
    if (brandFilter) {
      navigate(`/admin/${brandFilter}/add-product`)
    } else {
      navigate('/admin/add-product')
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading products...</Typography>
      </Box>
    )
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography color="error">Failed to load products. Please try again.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 3, sm: 4, md: 4 }, 
          flex: 1, 
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%'
        }}
      >
        {/* Header */}
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Products', to: '/admin/products' }]} />
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          {getBrandDisplayName(brandFilter) ? `${getBrandDisplayName(brandFilter)} Products` : 'All Products'}
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
              placeholder="Search Products..."
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
            if (!brandFilter) return PERMISSIONS.CREATE_PRODUCTS
            const brandPermissionMap: Record<string, string> = {
              'project-zero': 'CREATE_PRODUCTS_PROJECT_ZERO',
              'thomas-mushet': 'CREATE_PRODUCTS_THOMAS_MUSHET',
              'hear-my-voice': 'CREATE_PRODUCTS_HEAR_MY_VOICE'
            }
            const permissionKey = brandPermissionMap[brandFilter]
            return permissionKey ? PERMISSIONS[permissionKey as keyof typeof PERMISSIONS] : PERMISSIONS.CREATE_PRODUCTS
          })()}>
            <Button
              variant="contained"
              onClick={handleAddProduct}
              sx={{
                bgcolor: colors.button.primary,
                color: colors.text.secondary,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                py: 1,
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
              }}
            >
              Add Product
            </Button>
          </Permission>
        </Box>

        <ProductsTable
          products={paginatedProducts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
          brandFilter={brandFilter}
        />

        {/* Pagination and Info */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
              {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, filteredProducts.length)} of {filteredProducts.length} products
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

        <ProductViewModal
          open={viewModalOpen}
          product={selectedProduct}
          onClose={handleCloseViewModal}
        />

        <ProductEditModal
          open={editModalOpen}
          product={selectedProduct}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
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
              Are you sure you want to delete "{deleteConfirm.productName}"? This action cannot be undone.
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
                backgroundColor: colors.danger.primary,
                color: colors.text.secondary,
                '&:hover': {
                  backgroundColor: colors.button.primaryHover,
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

export default AdminProducts

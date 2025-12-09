import { Box, Container, Typography, Pagination, Stack } from '@mui/material'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductsTable, ProductTableHeader, ProductViewModal, ProductEditModal } from '../../features/Admin/products'
import { useProductsStore } from '../../store/useProductsStore'
import { colors } from '../../theme'
import type { AdminProduct } from '../../types/Admin'

const AdminProducts = () => {
  const navigate = useNavigate()
  const { products, initializeProducts, updateProduct, deleteProduct } = useProductsStore()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  // Initialize products on mount
  useEffect(() => {
    if (products.length === 0) {
      initializeProducts()
    }
  }, [initializeProducts, products.length])

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    return products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, products])

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
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
    updateProduct(updatedProduct)
    setEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id)
  }

  const handleAddProduct = () => {
    navigate('/admin/add-product')
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
        <Typography 
          variant="h4" 
          sx={{ 
            mb: { xs: 3, sm: 4 }, 
            fontWeight: 700, 
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          All Products
        </Typography>

        <ProductTableHeader
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onAddProduct={handleAddProduct}
        />

        <ProductsTable
          products={paginatedProducts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
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
                      backgroundColor: '#dc2626',
                      color: 'white',
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
      </Container>
    </Box>
  )
}

export default AdminProducts

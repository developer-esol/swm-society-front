import { Box, Container, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/admin'
import { ProductsTable, ProductTableHeader, ProductViewModal, ProductEditModal } from '../../features/Admin/products'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import { useProductsStore } from '../../store/useProductsStore'
import { colors } from '../../theme'
import type { AdminProduct } from '../../types/Admin'

const AdminProducts = () => {
  const navigate = useNavigate()
  const { searchQuery, handleSearch } = useProducts()
  const { products, initializeProducts, updateProduct, deleteProduct } = useProductsStore()
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
  const [displayProducts, setDisplayProducts] = useState<AdminProduct[]>(products)

  // Initialize products on mount
  useEffect(() => {
    if (products.length === 0) {
      initializeProducts()
    }
  }, [initializeProducts, products.length])

  // Update display products when store products change
  useEffect(() => {
    setDisplayProducts(products)
  }, [products])

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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
        <AdminSidebar activeMenu="products" />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: { xs: '100%', md: 'auto' } }}>
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
            products={displayProducts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteProduct}
          />

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
    </Box>
  )
}

export default AdminProducts

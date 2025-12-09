import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { colors } from '../../../theme'
import type { AdminProduct } from '../../../types/Admin'
import { useBrands } from '../../../hooks/useBrands'

interface ProductsTableProps {
  products: AdminProduct[]
  onView: (product: AdminProduct) => void
  onEdit: (product: AdminProduct) => void
  onDelete: (id: string) => void
}

const ProductsTable = ({ products, onView, onEdit, onDelete }: ProductsTableProps) => {
  const { data: brands = [] } = useBrands()

  const getBrandName = (brandId: string | number) => {
    const brand = brands.find(b => b.id === brandId.toString() || b.id === brandId)
    // Try different possible field names from backend
    return brand?.brandName || brand?.name || `Brand ID: ${brandId}`
  }

  return (
    <Paper sx={{ bgcolor: colors.background.default, border: `1px solid ${colors.border.default}` }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#d3d3d3' }}>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Product ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Product Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Description
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Brand Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Delivery Method
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem', textAlign: 'center' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <TableRow key={index} sx={{ '&:hover': { bgcolor: colors.background.lighter } }}>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {product.id}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {product.productName}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {product.description}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {getBrandName(product.brandId)}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {product.deliveryMethod}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => onView(product)}
                          sx={{
                            color: colors.text.primary,
                            '&:hover': { bgcolor: `${colors.text.primary}10` },
                          }}
                        >
                          <ViewIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(product)}
                          sx={{
                            color: colors.text.primary,
                            '&:hover': { bgcolor: `${colors.text.primary}10` },
                          }}
                        >
                          <EditIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(product.id)}
                          sx={{
                            color: colors.button.primary,
                            '&:hover': { bgcolor: `${colors.button.primary}10` },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography sx={{ color: colors.text.disabled }}>
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default ProductsTable

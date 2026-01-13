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
  Button,
} from '@mui/material'
import { Eye as ViewIcon, Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { AdminProduct } from '../../../types/Admin'
import { useBrands } from '../../../hooks/useBrands'
import { Permission } from '../../../components/Permission'
import { PERMISSIONS } from '../../../configs/permissions'

interface ProductsTableProps {
  products: AdminProduct[]
  onView: (product: AdminProduct) => void
  onEdit: (product: AdminProduct) => void
  onDelete: (id: string) => void
  brandFilter?: string | null
}

const ProductsTable = ({ products, onView, onEdit, onDelete, brandFilter }: ProductsTableProps) => {
  const { data: brands = [] } = useBrands()

  const getBrandName = (brandId: string | number) => {
    const brand = brands.find(b => b.id === brandId.toString() || b.id === brandId)
    // Try different possible field names from backend
    return brand?.brandName || brand?.name || `Brand ID: ${brandId}`
  }

  // Get brand-specific permissions based on brand filter
  const getPermission = (action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE') => {
    if (!brandFilter) {
      return PERMISSIONS[`${action}_PRODUCTS` as keyof typeof PERMISSIONS]
    }
    
    const brandPermissionMap: Record<string, string> = {
      'project-zero': `${action}_PRODUCTS_PROJECT_ZERO`,
      'thomas-mushet': `${action}_PRODUCTS_THOMAS_MUSHET`,
      'hear-my-voice': `${action}_PRODUCTS_HEAR_MY_VOICE`
    }
    
    const permissionKey = brandPermissionMap[brandFilter]
    return permissionKey ? PERMISSIONS[permissionKey as keyof typeof PERMISSIONS] : PERMISSIONS[`${action}_PRODUCTS` as keyof typeof PERMISSIONS]
  }

  return (
    <Paper sx={{ bgcolor: colors.background.default, border: `1px solid ${colors.border.default}` }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: colors.login.access }}>
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
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                      <Permission permission={getPermission('VIEW')}>
                      <Button
                        onClick={() => onView(product)}
                        sx={{
                          minWidth: '40px',
                          width: '40px',
                          height: '40px',
                          p: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: '6px',
                          color: colors.text.primary,
                          bgcolor: 'transparent',
                          '&:hover': {
                            bgcolor: colors.background.lighter,
                          },
                        }}
                      >
                        <ViewIcon size={18} />
                      </Button>
                      </Permission>
                      <Permission permission={getPermission('UPDATE')}>
                      <Button
                        onClick={() => onEdit(product)}
                        sx={{
                          minWidth: '40px',
                          width: '40px',
                          height: '40px',
                          p: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: '6px',
                          color: colors.text.primary,
                          bgcolor: 'transparent',
                          '&:hover': {
                            bgcolor: colors.background.lighter,
                          },
                        }}
                      >
                        <EditIcon size={18} />
                      </Button>
                      </Permission>
                      <Permission permission={getPermission('DELETE')}>
                      <Button
                        onClick={() => onDelete(product.id)}
                        sx={{
                          minWidth: '40px',
                          width: '40px',
                          height: '40px',
                          p: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: '6px',
                          color: colors.button.primary,
                          bgcolor: 'transparent',
                          '&:hover': {
                            bgcolor: colors.danger.background,
                          },
                        }}
                      >
                        <DeleteIcon size={18} />
                      </Button>
                      </Permission>
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

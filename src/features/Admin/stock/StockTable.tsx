import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material'
import { Eye as ViewIcon, Edit as EditIcon, Trash2 as DeleteIcon } from 'lucide-react'
import { colors } from '../../../theme'
import { Permission } from '../../../components/Permission'
import { PERMISSIONS } from '../../../configs/permissions'
import type { StockItem } from '../../../types/Admin'

interface StockTableProps {
  items: StockItem[];
  onView: (item: StockItem) => void;
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
  brandFilter?: string | null;
}

const StockTable = ({ items, onView, onEdit, onDelete, brandFilter }: StockTableProps) => {
  // Get brand-specific permissions based on brand filter
  const getPermission = (action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE') => {
    if (!brandFilter) {
      return PERMISSIONS[`${action}_STOCK` as keyof typeof PERMISSIONS]
    }
    
    const brandPermissionMap: Record<string, string> = {
      'project-zero': `${action}_STOCK_PROJECT_ZERO`,
      'thomas-mushet': `${action}_STOCK_THOMAS_MUSHET`,
      'hear-my-voice': `${action}_STOCK_HEAR_MY_VOICE`
    }
    
    const permissionKey = brandPermissionMap[brandFilter]
    return permissionKey ? PERMISSIONS[permissionKey as keyof typeof PERMISSIONS] : PERMISSIONS[`${action}_STOCK` as keyof typeof PERMISSIONS]
  }

  return (
    <Paper sx={{ bgcolor: colors.background.default, border: `1px solid ${colors.border.default}` }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#d3d3d3' }}>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Item ID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Product Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Color
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Size
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Quantity
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem' }}>
                Price
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.9rem', textAlign: 'center' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id} sx={{ '&:hover': { bgcolor: colors.background.lighter } }}>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {item.id}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {item.productName}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {item.color}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {item.size}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                    ${item.price}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                      <Permission permission={getPermission('VIEW')}>
                      <Button
                        onClick={() => onView(item)}
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
                        onClick={() => onEdit(item)}
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
                        onClick={() => onDelete(item.id)}
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
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  No stock items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default StockTable

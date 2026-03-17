import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Typography, IconButton } from '@mui/material'
import { Eye, Edit } from 'lucide-react'
import { colors } from '../../../theme'
import { Permission } from '../../../components/Permission'
import { PERMISSIONS } from '../../../configs/permissions'
import type { Order } from '../../../types/order'

interface SalesTableProps {
  transactions: Order[]
  onView: (order: Order) => void
  onEdit: (order: Order) => void
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { bg: `${colors.status.processing}20`, text: colors.status.processing }
    case 'processing':
      return { bg: `${colors.status.processing}20`, text: colors.status.processing }
    case 'Packaged':
      return { bg: `${colors.status.shipped}20`, text: colors.status.shipped }
    case 'delivered':
      return { bg: `${colors.status.delivered}20`, text: colors.status.delivered }
    case 'cancelled':
      return { bg: `${colors.status.cancelled}20`, text: colors.status.cancelled }
    default:
      return { bg: '#f3f4f620', text: colors.text.primary }
  }
}

const SalesTable = ({ transactions, onView, onEdit }: SalesTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ border: `1px solid ${colors.border.default}`, borderRadius: '8px' }}>
      <Table>
        <TableHead sx={{ bgcolor: colors.background.light }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Contact Email</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Products</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }} align="right">
              Total Amount
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((order) => {
            const statusColor = getStatusColor(order.status || 'pending')
            return (
              <TableRow key={order.id} sx={{ '&:hover': { bgcolor: colors.background.light } }}>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>
                  {order.id.substring(0, 8)}...
                </TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>
                  {order.contactEmail || 'N/A'}
                </TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>
                  <Box>
                    {order.items.map((item, idx) => (
                      <Typography key={idx} sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                        {item.productName} ({item.size}, {item.color}) x{item.quantity}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem', textAlign: 'right' }}>
                  £{order.totalPrice ? Number(order.totalPrice).toFixed(2) : '0.00'}
                </TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>
                  {order.orderDate}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status || 'Pending'}
                    size="small"
                    sx={{
                      bgcolor: statusColor.bg,
                      color: statusColor.text,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {/* View Icon - Requires VIEW_SALES permission */}
                    <Permission permission={PERMISSIONS.VIEW_SALES}>
                      <IconButton
                        onClick={() => onView(order)}
                        sx={{
                          width: '40px',
                          height: '40px',
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: '8px',
                          '&:hover': {
                            bgcolor: colors.background.light,
                          },
                        }}
                      >
                        <Eye size={18} color={colors.text.primary} />
                      </IconButton>
                    </Permission>
                    
                    {/* Edit Icon - Requires UPDATE_SALES permission */}
                    <Permission permission={PERMISSIONS.UPDATE_SALES}>
                      <IconButton
                        onClick={() => onEdit(order)}
                        sx={{
                          width: '40px',
                          height: '40px',
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: '8px',
                          '&:hover': {
                            bgcolor: colors.background.light,
                          },
                        }}
                      >
                        <Edit size={18} color={colors.text.primary} />
                      </IconButton>
                    </Permission>
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SalesTable

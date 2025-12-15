import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import { colors } from '../../../theme'
import type { SalesTransaction } from '../../../types/Admin/sales'

interface SalesTableProps {
  transactions: SalesTransaction[]
}

const getStatusColor = (status: SalesTransaction['status']) => {
  switch (status) {
    case 'Pending':
      return { bg: `${colors.status.processing}20`, text: colors.status.processing }
    case 'Packaged':
      return { bg: `${colors.status.shipped}20`, text: colors.status.shipped }
    case 'Delivered':
      return { bg: `${colors.status.delivered}20`, text: colors.status.delivered }
    case 'Returned':
      return { bg: `${colors.status.cancelled}20`, text: colors.status.cancelled }
    default:
      return { bg: '#f3f4f620', text: colors.text.primary }
  }
}

const SalesTable = ({ transactions }: SalesTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ border: `1px solid ${colors.border.default}`, borderRadius: '8px' }}>
      <Table>
        <TableHead sx={{ bgcolor: colors.background.light }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Order ID</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>User ID</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Product ID</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }} align="center">
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Size</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Color</TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }} align="right">
              Unit Price
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }} align="right">
              Total
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: colors.text.primary, fontSize: '0.875rem' }}>Date</TableCell>
            {/* Status column hidden per request */}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => {
            const statusColor = getStatusColor(transaction.status)
            return (
              <TableRow key={transaction.id} sx={{ '&:hover': { bgcolor: colors.background.light } }}>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>{transaction.orderId}</TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>{transaction.userId}</TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>{transaction.productId}</TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem', textAlign: 'center' }}>
                  {transaction.quantity}
                </TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>{transaction.size}</TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>{transaction.color}</TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem', textAlign: 'right' }}>
                  ${transaction.unitPrice}
                </TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem', textAlign: 'right' }}>
                  ${transaction.total}
                </TableCell>
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.875rem' }}>{transaction.date}</TableCell>
                {/* Status column removed */}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SalesTable

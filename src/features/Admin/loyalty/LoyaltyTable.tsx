import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Paper,
} from '@mui/material'
import { Edit2 as EditIcon } from 'lucide-react'
import { colors } from '../../../theme'
import type { LoyaltyTransaction } from '../../../types/Admin/loyalty'

interface LoyaltyTableProps {
  transactions: LoyaltyTransaction[]
  onEditBalance: (transaction: LoyaltyTransaction) => void
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'earned':
      return '#10b981' // Green
    case 'redeemed':
      return '#f59e0b' // Amber
    case 'adjustment':
      return '#3b82f6' // Blue
    default:
      return '#6b7280' // Gray
  }
}

const getTypeBgColor = (type: string) => {
  switch (type) {
    case 'earned':
      return '#dcfce7'
    case 'redeemed':
      return '#fef3c7'
    case 'adjustment':
      return '#dbeafe'
    default:
      return '#f3f4f6'
  }
}

const LoyaltyTable: React.FC<LoyaltyTableProps> = ({ transactions, onEditBalance }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        border: `1px solid ${colors.border.default}`,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: colors.background.light,
              borderBottom: `1px solid ${colors.border.default}`,
            }}
          >
            <TableCell
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '0.9rem',
                padding: '12px 16px',
              }}
            >
              Date
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '0.9rem',
                padding: '12px 16px',
              }}
            >
              Type
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '0.9rem',
                padding: '12px 16px',
              }}
              align="right"
            >
              Points
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '0.9rem',
                padding: '12px 16px',
              }}
            >
              Order #
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '0.9rem',
                padding: '12px 16px',
              }}
            >
              Description
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '0.9rem',
                padding: '12px 16px',
              }}
              align="right"
            >
              Balance
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '0.9rem',
                padding: '12px 16px',
                width: '50px',
              }}
              align="center"
            >
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow
              key={transaction.id}
              sx={{
                borderBottom: index < transactions.length - 1 ? `1px solid ${colors.border.default}` : 'none',
                '&:hover': {
                  backgroundColor: colors.background.light,
                },
              }}
            >
              <TableCell sx={{ padding: '12px 16px', fontSize: '0.9rem', color: colors.text.primary }}>
                {transaction.date}
              </TableCell>
              <TableCell sx={{ padding: '12px 16px' }}>
                <Chip
                  label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  size="small"
                  sx={{
                    backgroundColor: getTypeBgColor(transaction.type),
                    color: getTypeColor(transaction.type),
                    fontWeight: 600,
                    fontSize: '0.8rem',
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  padding: '12px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: transaction.points > 0 ? colors.loyalty.green : colors.status.error,
                }}
                align="right"
              >
                {transaction.points > 0 ? '+' : ''}{transaction.points}
              </TableCell>
              <TableCell sx={{ padding: '12px 16px', fontSize: '0.9rem', color: colors.status.error, fontWeight: 600 }}>
                {transaction.orderId}
              </TableCell>
              <TableCell sx={{ padding: '12px 16px', fontSize: '0.9rem', color: colors.text.primary }}>
                {transaction.description}
              </TableCell>
              <TableCell
                sx={{
                  padding: '12px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: colors.loyalty.primary,
                }}
                align="right"
              >
                {transaction.balance}
              </TableCell>
              <TableCell sx={{ padding: '12px 16px' }} align="center">
                <IconButton
                  size="small"
                  onClick={() => onEditBalance(transaction)}
                  sx={{
                    color: colors.text.primary,
                    '&:hover': {
                      backgroundColor: `${colors.button.primary}20`,
                      color: colors.button.primary,
                    },
                  }}
                >
                  <EditIcon size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LoyaltyTable

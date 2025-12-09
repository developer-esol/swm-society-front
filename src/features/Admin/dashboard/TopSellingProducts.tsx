import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material'
import { colors } from '../../../theme'
import type { TopProduct } from '../../../types/Admin'

interface TopSellingProductsProps {
  products: TopProduct[]
}

const TopSellingProducts = ({ products }: TopSellingProductsProps) => {
  return (
    <Paper
      sx={{
        bgcolor: colors.background.default,
        border: `1px solid ${colors.border.default}`,
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text.primary }}>
          Top Selling Products
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fef2f2' }}>
              <TableCell sx={{ fontWeight: 600, color: colors.text.gray, fontSize: '0.85rem' }}>
                Name
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: colors.text.gray, fontSize: '0.85rem' }}>
                Price
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: colors.text.gray, fontSize: '0.85rem' }}>
                Quantity
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: colors.text.gray, fontSize: '0.85rem' }}>
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, idx) => (
              <TableRow
                key={idx}
                sx={{
                  bgcolor: '#fef2f2',
                  '&:hover': {
                    bgcolor: '#fecaca',
                  },
                }}
              >
                <TableCell sx={{ color: colors.text.primary, fontSize: '0.9rem' }}>
                  {product.name}
                </TableCell>
                <TableCell align="right" sx={{ color: colors.text.primary, fontSize: '0.9rem', fontWeight: 500 }}>
                  ${Number(product.price).toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ color: colors.text.primary, fontSize: '0.9rem', fontWeight: 500 }}>
                  {product.quantity}
                </TableCell>
                <TableCell align="right" sx={{ color: colors.text.primary, fontSize: '0.9rem', fontWeight: 600 }}>
                  ${Number(product.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default TopSellingProducts

import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Typography, Divider } from '@mui/material'
import { colors } from '../../../theme'
import type { Order } from '../../../types/order'

const OrderViewModal = ({ open, order, onClose }: { open: boolean; order: Order | null; onClose: () => void }) => {
  if (!order) return null

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.background.default,
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      '& .MuiOutlinedInput-input': {
        color: '#5f5959ff !important',
        WebkitTextFillColor: '#5f5a5aff !important',
        opacity: '1 !important',
        fontSize: '1rem',
      },
      '& fieldset': {
        borderColor: colors.border.default,
      },
    },
    '& .MuiInputLabel-root.Mui-disabled': {
      color: '#000000 !important',
      opacity: '1 !important',
    },
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
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
          borderBottom: `1px solid ${colors.border.default}`,
          fontSize: '1.2rem',
          pb: 2,
        }}
      >
        Order Details
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          {/* Order Info */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Order ID"
              value={order.id}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
            <TextField
              label="Status"
              value={order.status || 'Pending'}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Contact Email"
              value={order.contactEmail || 'N/A'}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
            <TextField
              label="Order Date"
              value={order.orderDate}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          {/* Delivery Address */}
          <Typography sx={{ fontWeight: 600, mt: 2, mb: 1, color: colors.text.primary }}>
            Delivery Address
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="House Number"
              value={order.deliveryAddress?.houseNumber || 'N/A'}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
            <TextField
              label="Apartment Name"
              value={order.deliveryAddress?.apartmentName || 'N/A'}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Street Name"
              value={order.deliveryAddress?.streetName || 'N/A'}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
            <TextField
              label="City"
              value={order.deliveryAddress?.city || 'N/A'}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <TextField
            label="Postal Code"
            value={order.deliveryAddress?.postalCode || 'N/A'}
            disabled
            fullWidth
            size="small"
            variant="outlined"
            sx={textFieldStyles}
          />

          <Divider sx={{ my: 2 }} />

          {/* Products */}
          <Typography sx={{ fontWeight: 600, mb: 1, color: colors.text.primary }}>
            Products
          </Typography>
          {order.items.map((item, idx) => (
            <Box key={idx} sx={{ p: 2, bgcolor: colors.background.light, borderRadius: 1, mb: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 1 }}>
                {item.productName}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1 }}>
                <Typography sx={{ fontSize: '0.85rem', color: colors.text.primary, fontWeight: 500 }}>
                  Size: {item.size}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: colors.text.primary, fontWeight: 500 }}>
                  Color: {item.color}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: colors.text.secondary }}>
                  Quantity: {item.quantity}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: colors.text.secondary }}>
                  Price: £{Number(item.price).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <TextField
              label="Subtotal"
              value={`£${order.subtotal ? Number(order.subtotal).toFixed(2) : '0.00'}`}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
            <TextField
              label="Total Amount"
              value={`£${order.totalPrice ? Number(order.totalPrice).toFixed(2) : '0.00'}`}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                ...textFieldStyles,
                '& .MuiOutlinedInput-root.Mui-disabled': {
                  ...textFieldStyles['& .MuiOutlinedInput-root.Mui-disabled'],
                  '& .MuiOutlinedInput-input': {
                    ...textFieldStyles['& .MuiOutlinedInput-root.Mui-disabled']['& .MuiOutlinedInput-input'],
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: `1px solid ${colors.border.default}` }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                borderColor: colors.button.primary,
                color: colors.button.primary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  borderColor: colors.button.primaryHover,
                  bgcolor: `${colors.button.primary}08`,
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default OrderViewModal

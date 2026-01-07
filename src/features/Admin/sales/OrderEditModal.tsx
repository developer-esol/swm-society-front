import { Dialog, DialogTitle, DialogContent, Box, Button, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState, useEffect } from 'react'
import { colors } from '../../../theme'
import type { Order } from '../../../types/order'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

interface OrderEditModalProps {
  open: boolean
  order: Order | null
  onClose: () => void
  onSave: (orderId: string, status: string) => Promise<void>
}

const OrderEditModal = ({ open, order, onClose, onSave }: OrderEditModalProps) => {
  const [status, setStatus] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (order && open) {
      setStatus(order.status || 'pending')
      setError(null)
      setSuccess(null)
    }
  }, [order, open])

  if (!order) return null

  const selectSx = {
    bgcolor: colors.input?.bg || '#ffffff',
    color: colors.text.primary,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.primary?.main || colors.border.default,
      borderWidth: '2px',
    },
    '& .MuiSelect-select': {
      color: colors.text.primary,
      padding: '12px 14px',
    },
  }

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setStatus(e.target.value)
  }

  const handleSave = async () => {
    if (!status) {
      setError('Please select a status')
      return
    }

    setIsUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      await onSave(order.id, status)
      setSuccess('Order status updated successfully!')
      
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status'
      setError(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
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
        Edit Order Status
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <FormControl fullWidth size="small">
            <InputLabel 
              sx={{ 
                color: colors.text.primary,
                '&.Mui-focused': {
                  color: colors.primary?.main || colors.text.primary,
                },
              }}
            >
              Order Status
            </InputLabel>
            <Select
              value={status}
              onChange={handleStatusChange}
              label="Order Status"
              sx={selectSx}
            >
              {ORDER_STATUSES.map((statusOption) => (
                <MenuItem key={statusOption} value={statusOption}>
                  {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: `1px solid ${colors.border.default}` }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isUpdating}
              sx={{
                borderColor: colors.border.default,
                color: colors.text.primary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  borderColor: colors.border.default,
                  bgcolor: colors.background.lighter,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isUpdating || !status}
              sx={{
                bgcolor: colors.button.primary,
                color: 'white',
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  bgcolor: colors.button.primaryHover,
                },
                '&:disabled': {
                  bgcolor: colors.button.disabled,
                  color: 'white',
                },
              }}
            >
              {isUpdating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default OrderEditModal

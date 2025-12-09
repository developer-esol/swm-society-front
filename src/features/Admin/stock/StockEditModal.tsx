import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { colors } from '../../../theme'
import type { StockItem } from '../../../types/Admin'
import { stockService } from '../../../api/services/stockService'
import type { CreateStockData } from '../../../types/product'

// Mock data for sizes
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const HARDCODED_IMAGE_URL = 'https://example.com/stock-image.jpg'

interface StockEditModalProps {
  open: boolean
  item: StockItem | null
  onClose: () => void
  onSave: (item: StockItem) => void
  originalStock?: { productId: string } // Add originalStock prop to get the real productId
}

const StockEditModal = ({ open, item, onClose, onSave, originalStock }: StockEditModalProps) => {
  const [formData, setFormData] = useState<StockItem | null>(item)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Update formData when item changes
  if (item && (!formData || formData.id !== item.id)) {
    setFormData({
      ...item,
      imageUrl: HARDCODED_IMAGE_URL // Use hardcoded URL like product edit page
    })
  }

  if (!formData) return null

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
    '& .MuiInputLabel-root': {
      color: '#000000ff !important',
    },
  }

  const selectSx = {
    bgcolor: colors.background.default,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.border.default,
    },
  }

  const handleTextChange = (field: keyof StockItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Clear error when user starts typing
    if (error) setError(null)
    
    const value = e.target.value
    
    if (field === 'quantity') {
      const numValue = value === '' ? 0 : parseInt(value) || 0
      setFormData({
        ...formData,
        [field]: Math.max(0, numValue), // Ensure quantity is never negative
      })
    } else if (field === 'price') {
      const numValue = value === '' ? 0 : parseFloat(value) || 0
      setFormData({
        ...formData,
        [field]: Math.max(0, Math.round(numValue * 100) / 100), // Ensure price is never negative and round to 2 decimal places
      })
    } else {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  const handleSelectChange = (field: keyof StockItem) => (e: SelectChangeEvent<string>) => {
    // Clear error when user makes a selection
    if (error) setError(null)
    
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  const handleSave = async () => {
    if (!formData) return
    
    // Validate required fields and constraints
    if (!formData.productName.trim()) {
      setError('Product name is required')
      return
    }
    
    if (!formData.size.trim()) {
      setError('Size is required')
      return
    }
    
    if (!formData.color.trim()) {
      setError('Color is required')
      return
    }
    
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0')
      return
    }
    
    if (formData.price <= 0) {
      setError('Price must be greater than 0')
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      
      // Map StockItem to CreateStockData format for API
      const updateData: Partial<CreateStockData> = {
        productId: originalStock?.productId || formData.itemId, // Use correct productId from originalStock
        size: formData.size,
        color: formData.color,
        quantity: Math.floor(formData.quantity), // Ensure quantity is an integer
        price: Math.round(formData.price * 100) / 100, // Round to 2 decimal places
        imageUrl: formData.imageUrl
      }
      
      await stockService.updateStock(formData.id, updateData)
      
      setSuccess('Stock item updated successfully!')
      onSave(formData)
      
      // Close modal after short delay
      setTimeout(() => {
        onClose()
        setSuccess(null)
      }, 1500)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update stock. Please try again.'
      setError(errorMessage)
      console.error('Error updating stock:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(item)
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
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
        Edit Stock Item
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          {/* Product Name */}
          <Box>
            <TextField
              label="Product Name"
              value={formData.productName}
              onChange={handleTextChange('productName')}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          {/* Color */}
          <Box>
            <TextField
              label="Color"
              value={formData.color}
              onChange={handleTextChange('color')}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          {/* Size Dropdown */}
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Size</InputLabel>
              <Select
                value={formData.size}
                onChange={handleSelectChange('size')}
                label="Size"
                sx={selectSx}
              >
                <MenuItem value="">
                  <em>Select Size</em>
                </MenuItem>
                {SIZES.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Quantity */}
          <Box>
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleTextChange('quantity')}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          {/* Price */}
          <Box>
            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleTextChange('price')}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          {/* Image URL */}
          <Box>
            <TextField
              label="Image URL"
              value={formData.imageUrl}
              fullWidth
              size="small"
              variant="outlined"
              disabled
              helperText="Image URL is currently hardcoded"
              sx={textFieldStyles}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: `1px solid ${colors.border.default}` }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderColor: colors.border.default,
                color: colors.text.primary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  borderColor: colors.text.primary,
                  bgcolor: `${colors.text.primary}08`,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading}
              sx={{
                backgroundColor: colors.button.primary,
                color: colors.text.secondary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: colors.button.primaryHover,
                },
                '&:disabled': {
                  backgroundColor: colors.border.default,
                },
              }}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default StockEditModal

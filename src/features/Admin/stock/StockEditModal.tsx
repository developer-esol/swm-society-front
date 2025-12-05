import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { colors } from '../../../theme'
import type { StockItem } from '../../../types/Admin'

// Mock data for colors and sizes
const COLORS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface StockEditModalProps {
  open: boolean
  item: StockItem | null
  onClose: () => void
  onSave: (item: StockItem) => void
}

const StockEditModal = ({ open, item, onClose, onSave }: StockEditModalProps) => {
  const [formData, setFormData] = useState<StockItem | null>(item)

  // Update formData when item changes
  if (item && (!formData || formData.id !== item.id)) {
    setFormData(item)
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
    setFormData({
      ...formData,
      [field]: field === 'quantity' || field === 'price' ? Number(e.target.value) : e.target.value,
    })
  }

  const handleSelectChange = (field: keyof StockItem) => (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
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

          {/* Color Dropdown */}
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Color</InputLabel>
              <Select
                value={formData.color}
                onChange={handleSelectChange('color')}
                label="Color"
                sx={selectSx}
              >
                <MenuItem value="">
                  <em>Select Color</em>
                </MenuItem>
                {COLORS.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              sx={{
                backgroundColor: colors.button.primary,
                color: colors.text.secondary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: colors.button.primaryHover,
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default StockEditModal

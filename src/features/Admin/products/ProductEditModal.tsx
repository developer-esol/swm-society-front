import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { colors } from '../../../theme'
import { useBrands } from '../../../hooks/useBrands'
import type { AdminProduct } from '../../../types/Admin'

const DELIVERY_METHODS = ['Shirt Monkey', 'Standard', 'Express', 'Direct']

interface ProductEditModalProps {
  open: boolean
  product: AdminProduct | null
  onClose: () => void
  onSave: (product: AdminProduct) => void
}

const ProductEditModal = ({ open, product, onClose, onSave }: ProductEditModalProps) => {
  const [formData, setFormData] = useState<AdminProduct | null>(product)
  const { data: brands = [] } = useBrands()

  // Update formData when product changes
  if (product && (!formData || formData.id !== product.id)) {
    setFormData(product)
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

  const handleTextChange = (field: keyof AdminProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  const handleSelectChange = (field: keyof AdminProduct) => (e: SelectChangeEvent<string>) => {
    const value = e.target.value
    if (field === 'brandId') {
      const selectedBrand = brands.find(b => b.id === value)
      setFormData({
        ...formData,
        [field]: value,
        brandName: selectedBrand?.brandName || value,
      })
    } else {
      setFormData({
        ...formData,
        [field]: value,
      })
    }
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleCancel = () => {
    setFormData(product)
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
        Edit Product
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1.5 }}>
          {/* Brand Name Dropdown */}
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Brand Name</InputLabel>
              <Select
                value={formData.brandId || ''}
                onChange={handleSelectChange('brandId')}
                label="Brand Name"
                sx={selectSx}
              >
                <MenuItem value="">
                  <em>Select Brand</em>
                </MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

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

          {/* Delivery Method Dropdown */}
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Delivery Method</InputLabel>
              <Select
                value={formData.deliveryMethod}
                onChange={handleSelectChange('deliveryMethod')}
                label="Delivery Method"
                sx={selectSx}
              >
                <MenuItem value="">
                  <em>Select Delivery Method</em>
                </MenuItem>
                {DELIVERY_METHODS.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Description */}
          <Box>
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleTextChange('description')}
              fullWidth
              multiline
              rows={4}
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

export default ProductEditModal

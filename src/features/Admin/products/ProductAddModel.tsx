import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import { colors } from '../../../theme'
import type { AdminProduct } from '../../../types/Admin'

interface ProductAddModalProps {
  open: boolean
  onClose: () => void
  onSave: (product: Omit<AdminProduct, 'id'>) => void
  brands: Array<{ id: string; name: string }>
  deliveryMethods: string[]
}

const ProductAddModal = ({ open, onClose, onSave, brands, deliveryMethods }: ProductAddModalProps) => {
  const [formData, setFormData] = useState({
    brandId: '',
    productName: '',
    deliveryMethod: '',
    description: '',
    imageUrl: '',
    price: '',
  })

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.background.default,
    },
    '& .MuiOutlinedInput-input': {
      color: '#000000 !important',
      fontSize: '1rem',
    },
    '& .MuiInputLabel-root': {
      color: '#000000 !important',
    },
  }

  const handleTextChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  const handleSelectChange = (field: string) => (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    })
  }

  const handleSave = () => {
    const newProduct: Omit<AdminProduct, 'id'> = {
      brandId: formData.brandId,
      brandName: brands.find(b => b.id === formData.brandId)?.name || '',
      productName: formData.productName,
      deliveryMethod: formData.deliveryMethod,
      description: formData.description,
      imageUrl: formData.imageUrl,
      price: parseFloat(formData.price) || 0,
    }
    onSave(newProduct)
    handleCancel()
  }

  const handleCancel = () => {
    setFormData({
      brandId: '',
      productName: '',
      deliveryMethod: '',
      description: '',
      imageUrl: '',
      price: '',
    })
    onClose()
  }

  const isFormValid = formData.brandId && formData.productName && formData.deliveryMethod && formData.price

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
        Add Product
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#000000 !important' }}>Brand Name</InputLabel>
              <Select
                value={formData.brandId}
                onChange={handleSelectChange('brandId')}
                label="Brand Name"
                sx={{
                  backgroundColor: colors.background.default,
                  '& .MuiOutlinedInput-input': {
                    color: '#000000 !important',
                  },
                }}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <TextField
              label="Product Name"
              value={formData.productName}
              onChange={handleTextChange('productName')}
              placeholder="Enter Product Name"
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#000000 !important' }}>Delivery Method</InputLabel>
              <Select
                value={formData.deliveryMethod}
                onChange={handleSelectChange('deliveryMethod')}
                label="Delivery Method"
                sx={{
                  backgroundColor: colors.background.default,
                  '& .MuiOutlinedInput-input': {
                    color: '#000000 !important',
                  },
                }}
              >
                {deliveryMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <TextField
              label="Price"
              value={formData.price}
              onChange={handleTextChange('price')}
              type="number"
              placeholder="Enter Price"
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box>
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleTextChange('description')}
              placeholder="Enter Description"
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
              disabled={!isFormValid}
              sx={{
                backgroundColor: isFormValid ? colors.button.primary : colors.border.default,
                color: colors.text.secondary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: isFormValid ? colors.button.primaryHover : colors.border.default,
                },
              }}
            >
              Save Product
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ProductAddModal

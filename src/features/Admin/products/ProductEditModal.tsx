import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { colors } from '../../../theme'
import type { AdminProduct } from '../../../types/Admin'

interface ProductEditModalProps {
  open: boolean
  product: AdminProduct | null
  onClose: () => void
  onSave: (product: AdminProduct) => void
}

const ProductEditModal = ({ open, product, onClose, onSave }: ProductEditModalProps) => {
  const [formData, setFormData] = useState<AdminProduct | null>(product)

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

  const handleChange = (field: keyof AdminProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 , pt : 1.5}}>
          <Box>
            <TextField
              label="Brand Name"
              value={formData.brandName}
              onChange={handleChange('brandName')}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box>
            <TextField
              label="Product Name"
              value={formData.productName}
              onChange={handleChange('productName')}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box>
            <TextField
              label="Delivery Method"
              value={formData.deliveryMethod}
              onChange={handleChange('deliveryMethod')}
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
              onChange={handleChange('description')}
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

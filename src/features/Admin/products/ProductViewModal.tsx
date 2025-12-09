import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from '@mui/material'
import { colors } from '../../../theme'
import type { AdminProduct } from '../../../types/Admin'
import { useBrands } from '../../../hooks/useBrands'

const ProductViewModal = ({ open, product, onClose }: { open: boolean; product: AdminProduct | null; onClose: () => void }) => {
  const { data: brands = [] } = useBrands()
  
  if (!product) return null

  const getBrandName = (brandId: string | number) => {
    const brand = brands.find(b => b.id === brandId.toString() || b.id === brandId)
    return brand?.brandName || brand?.name || `Brand ID: ${brandId}`
  }

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
        Product Details
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 , pt: 1.5}}>
          <Box>
            <TextField
              label="Brand Name"
              value={getBrandName(product.brandId)}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box>
            <TextField
              label="Product Name"
              value={product.productName}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box>
            <TextField
              label="Delivery Method"
              value={product.deliveryMethod}
              disabled
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Box>

          <Box>
            <TextField
              label="Description"
              value={product.description}
              disabled
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

export default ProductViewModal

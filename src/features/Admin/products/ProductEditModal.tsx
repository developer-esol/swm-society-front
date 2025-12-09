import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useState, useEffect } from 'react'
import { colors } from '../../../theme'
import { useBrands } from '../../../hooks/useBrands'
import { updateAdminProduct } from '../../../api/services/admin/productsService'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../configs/queryKeys'
import type { AdminProduct } from '../../../types/Admin'

const DELIVERY_METHODS = ['standard', 'express', 'pickup']

interface ProductEditModalProps {
  open: boolean
  product: AdminProduct | null
  onClose: () => void
  onSave: (product: AdminProduct) => void
}

const ProductEditModal = ({ open, product, onClose, onSave }: ProductEditModalProps) => {
  const [formData, setFormData] = useState<AdminProduct | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { data: brands = [] } = useBrands()
  const queryClient = useQueryClient()

  // Update formData when product changes or modal opens
  useEffect(() => {
    if (product && open) {
      setFormData({ 
        ...product,
        price: product.price || 0  // Ensure price has a default value
      })
      setError(null)
      setSuccess(null)
    } else if (!open) {
      setFormData(null)
    }
  }, [product, open])

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
    bgcolor: colors.input.bg || '#ffffff',
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
    '& .MuiInputLabel-root': {
      color: colors.text.primary,
      '&.Mui-focused': {
        color: colors.primary?.main || colors.text.primary,
      },
    },
  }

  const handleTextChange = (field: keyof AdminProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setFormData({
      ...formData,
      [field]: field === 'price' ? (value === '' ? 0 : parseFloat(value) || 0) : value,
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

  const handleSave = async () => {
    if (!formData) return
    
    try {
      setIsUpdating(true)
      setError(null)
      setSuccess(null)
      
      const updatedProduct = await updateAdminProduct(formData.id, formData)
      
      // Invalidate and refetch products
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.admin })
      
      setSuccess(`Product "${updatedProduct.productName}" updated successfully!`)
      onSave(updatedProduct)
      
      // Close modal after short delay
      setTimeout(() => {
        onClose()
        setSuccess(null)
      }, 1500)
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product. Please try again.'
      setError(errorMessage)
      console.error('Error updating product:', error)
    } finally {
      setIsUpdating(false)
    }
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
          {/* Brand Name Dropdown */}
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel>Brand Name</InputLabel>
              <Select
                value={formData.brandId?.toString() || ''}
                onChange={handleSelectChange('brandId')}
                label="Brand Name"
                displayEmpty
                sx={{
                  bgcolor: '#ffffff',
                  color: colors.text.primary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border.default,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.border.default,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.primary?.main || '#1976d2',
                    borderWidth: '2px',
                  },
                  '& .MuiSelect-select': {
                    color: formData.brandId ? '#000000 !important' : '#666666 !important',
                    fontWeight: formData.brandId ? '500' : '400',
                    padding: '12px 14px',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000',
                    '&.Mui-focused': {
                      color: colors.primary?.main || '#1976d2',
                    },
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#ffffff',
                      border: `1px solid ${colors.border.default}`,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '& .MuiMenuItem-root': {
                        color: '#000000 !important',
                        backgroundColor: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '400',
                        padding: '8px 16px',
                        '&:hover': {
                          backgroundColor: '#f5f5f5 !important',
                          color: '#000000 !important',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#e3f2fd !important',
                          color: '#000000 !important',
                          fontWeight: '500',
                          '&:hover': {
                            backgroundColor: '#bbdefb !important',
                            color: '#000000 !important',
                          },
                        },
                        '& em': {
                          color: '#666666 !important',
                          fontStyle: 'italic',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: '#999999', fontStyle: 'italic' }}>Select Brand</em>
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

          {/* Price */}
          <Box>
            <TextField
              label="Price"
              type="number"
              value={formData.price || ''}
              onChange={handleTextChange('price')}
              fullWidth
              size="small"
              variant="outlined"
              sx={textFieldStyles}
              inputProps={{
                step: "0.01",
                min: "0"
              }}
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
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: colors.menu.background,
                      border: `1px solid ${colors.menu.border}`,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      '& .MuiMenuItem-root': {
                        color: `${colors.menu.text} !important`,
                        backgroundColor: colors.menu.background,
                        fontSize: '14px',
                        fontWeight: '400',
                        padding: '8px 16px',
                        '&:hover': {
                          backgroundColor: `${colors.menu.hover} !important`,
                          color: `${colors.menu.text} !important`,
                        },
                        '&.Mui-selected': {
                          backgroundColor: `${colors.menu.selected} !important`,
                          color: `${colors.menu.text} !important`,
                          '&:hover': {
                            backgroundColor: `${colors.menu.selectedHover} !important`,
                            color: `${colors.menu.text} !important`,
                          },
                        },
                        '& em': {
                          color: `${colors.menu.textSecondary} !important`,
                        },
                      },
                    },
                  },
                }}
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
              disabled={isUpdating}
              sx={{
                backgroundColor: colors.button.primary,
                color: colors.text.secondary,
                fontWeight: 600,
                px: 3,
                '&:hover': {
                  backgroundColor: colors.button.primaryHover,
                },
                '&:disabled': {
                  backgroundColor: colors.button.primaryDisabled,
                },
              }}
            >
              {isUpdating ? 'Updating...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ProductEditModal

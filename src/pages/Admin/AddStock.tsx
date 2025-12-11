import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import { useAllProducts, useCreateStock } from '../../hooks/useStock'
import type { CreateStockData } from '../../types'

// Validation Schema
const addStockValidationSchema = Yup.object().shape({
  productId: Yup.string()
    .required('Product selection is required'),
  color: Yup.string()
    .required('Color is required'),
  size: Yup.string()
    .required('Size is required'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .positive('Quantity must be greater than 0')
    .required('Quantity is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  imageUrl: Yup.string()
    .url('Please enter a valid URL')
    .required('Image URL is required'),
})

// Field styling
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: colors.input.bg,
    '& fieldset': {
      borderColor: colors.border.default,
    },
    '&:hover fieldset': {
      borderColor: colors.border.default,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.border.default,
    },
  },
}

// Select styling matching AddProduct brand dropdown
const selectSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: colors.input.bg,
    '& fieldset': {
      borderColor: colors.border.default,
    },
    '&:hover fieldset': {
      borderColor: colors.border.default,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.border.default,
    },
  },
  '& .MuiSelect-select': {
    color: colors.text.primary,
    fontSize: '14px',
  },
}

const AddStock: React.FC = () => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const { data: products = [], isLoading: productsLoading } = useAllProducts()
  const createStockMutation = useCreateStock()

  const formik = useFormik<CreateStockData>({
    initialValues: {
      productId: '',
      color: '',
      size: '',
      quantity: 0,
      price: 0,
      imageUrl: 'https://example.com/stock-image.jpg',
    },
    validationSchema: addStockValidationSchema,
    onSubmit: async (values) => {
      setSubmitError(null)
      setSuccessMessage(null)
      
      try {
        console.log('Submitting stock data:', values)
        await createStockMutation.mutateAsync(values)
        setSuccessMessage('Stock added successfully!')
        
        setTimeout(() => {
          navigate('/admin/stock')
        }, 1500)
      } catch (error) {
        console.error('Error adding stock:', error)
        
        // More specific error handling
        let errorMessage = 'Failed to add stock. Please try again.'
        if (error && typeof error === 'object') {
          if ('message' in error && typeof error.message === 'string') {
            errorMessage = error.message
          } else if ('response' in error && error.response) {
            const response = error.response as any
            if (response.data && response.data.message) {
              errorMessage = response.data.message
            } else if (response.statusText) {
              errorMessage = `Error ${response.status}: ${response.statusText}`
            }
          }
        }
        setSubmitError(errorMessage)
      }
    },
  })

  const handleProductChange = (event: SelectChangeEvent) => {
    formik.setFieldValue('productId', event.target.value)
  }

  const handleTextChange = (field: keyof CreateStockData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = field === 'quantity' || field === 'price' ? parseFloat(e.target.value) || 0 : e.target.value
    formik.setFieldValue(field, value)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Stock', to: '/admin/stock' }, { label: 'Add Stock' }]} />
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Add Stock
        </Typography>

        {/* Form Container with Border */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2.5, sm: 3, md: 3 },
            border: `1px solid ${colors.border.default}`,
            borderRadius: '8px',
            p: { xs: 3, sm: 4, md: 4 },
            bgcolor: colors.background.default,
            width: '100%',
          }}
        >
          {/* Error Alert */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          {/* Success Alert */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2.5, sm: 3, md: 3 },
            }}
          >
            {/* Stock Information Section */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: colors.text.primary,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                }}
              >
                Stock Information
              </Typography>

              {/* Product Selection Dropdown */}
              <FormControl 
                fullWidth 
                sx={{ mb: { xs: 1.5, sm: 2 } }}
                error={formik.touched.productId && Boolean(formik.errors.productId)}
                size="small"
              >
                <InputLabel sx={{ color: colors.text.primary }}>
                  Product {productsLoading ? '(Loading...)' : ''}
                </InputLabel>
                <Select
                  value={formik.values.productId}
                  onChange={handleProductChange}
                  onBlur={formik.handleBlur}
                  name="productId"
                  label={`Product ${productsLoading ? '(Loading...)' : ''}`}
                  disabled={productsLoading}
                  size="small"
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
                    <em>Select Product</em>
                  </MenuItem>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name || `Product ${product.id}`}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <em>No products available</em>
                    </MenuItem>
                  )}
                </Select>
                {formik.touched.productId && formik.errors.productId && (
                  <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.productId}
                  </Typography>
                )}
              </FormControl>

              {/* Color */}
              <FormControl 
                fullWidth 
                sx={{ mb: { xs: 1.5, sm: 2 } }}
                error={formik.touched.color && Boolean(formik.errors.color)}
                size="small"
              >
                <InputLabel sx={{ color: colors.text.primary }}>
                  Color
                </InputLabel>
                <Select
                  value={formik.values.color}
                  onChange={(event: SelectChangeEvent) => {
                    formik.setFieldValue('color', event.target.value)
                  }}
                  onBlur={formik.handleBlur}
                  name="color"
                  label="Color"
                  size="small"
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
                    <em>Select Color</em>
                  </MenuItem>
                  <MenuItem value="Red">Red</MenuItem>
                  <MenuItem value="Blue">Blue</MenuItem>
                  <MenuItem value="Green">Green</MenuItem>
                  <MenuItem value="Black">Black</MenuItem>
                  <MenuItem value="White">White</MenuItem>
                  <MenuItem value="Yellow">Yellow</MenuItem>
                  <MenuItem value="Purple">Purple</MenuItem>
                  <MenuItem value="Orange">Orange</MenuItem>
                </Select>
                {formik.touched.color && formik.errors.color && (
                  <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.color}
                  </Typography>
                )}
              </FormControl>

              {/* Size */}
              <FormControl 
                fullWidth 
                sx={{ mb: { xs: 1.5, sm: 2 } }}
                error={formik.touched.size && Boolean(formik.errors.size)}
                size="small"
              >
                <InputLabel sx={{ color: colors.text.primary }}>
                  Size
                </InputLabel>
                <Select
                  value={formik.values.size}
                  onChange={(event: SelectChangeEvent) => {
                    formik.setFieldValue('size', event.target.value)
                  }}
                  onBlur={formik.handleBlur}
                  name="size"
                  label="Size"
                  size="small"
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
                    <em>Select Size</em>
                  </MenuItem>
                  <MenuItem value="XS">XS</MenuItem>
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                  <MenuItem value="XXL">XXL</MenuItem>
                  <MenuItem value="XXXL">XXXL</MenuItem>
                  <MenuItem value="Free Size">Free Size</MenuItem>
                </Select>
                {formik.touched.size && formik.errors.size && (
                  <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.size}
                  </Typography>
                )}
              </FormControl>

              {/* Quantity and Price Row */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: { xs: 1.5, sm: 2 },
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={formik.values.quantity}
                  onChange={handleTextChange('quantity')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                  variant="outlined"
                  size="small"
                  sx={fieldSx}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formik.values.price}
                  onChange={handleTextChange('price')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  variant="outlined"
                  size="small"
                  sx={fieldSx}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Box>

              {/* Image URL */}
              <TextField
                fullWidth
                label="Image URL"
                value={formik.values.imageUrl}
                onChange={handleTextChange('imageUrl')}
                onBlur={formik.handleBlur}
                error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
                helperText={formik.touched.imageUrl && formik.errors.imageUrl}
                variant="outlined"
                size="small"
                sx={{ ...fieldSx, mb: { xs: 1.5, sm: 2 } }}
                placeholder="https://example.com/stock-image.jpg"
              />
            </Box>

            {/* Submit Button */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                pt: { xs: 2, sm: 2.5 },
                borderTop: `1px solid ${colors.border.default}`,
                flexDirection: 'column',
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting || createStockMutation.isPending}
                fullWidth
                sx={{
                  backgroundColor: colors.button.primary,
                  color: colors.text.secondary,
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 1.75 },
                  '&:hover': {
                    backgroundColor: colors.button.primaryHover,
                  },
                  '&:disabled': {
                    backgroundColor: colors.border.default,
                  },
                }}
              >
                {createStockMutation.isPending ? 'Adding Stock...' : 'Add Stock'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AddStock

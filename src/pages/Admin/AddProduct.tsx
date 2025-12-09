import React, { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, Container, CircularProgress } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { colors } from '../../theme'
import { productsService } from '../../api/services/products';
import type { CreateProductData, CreateProductResponse } from '../../types/product'
import { useBrands } from '../../hooks/useBrands'

// Validation Schema
const addProductValidationSchema = Yup.object().shape({
  brandId: Yup.string()
    .required('Brand is required'),
  name: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .required('Product name is required'),
  deliveryMethod: Yup.string()
    .required('Delivery method is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
})

// Field styling matching checkout page
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

const selectSx = {
  bgcolor: colors.input.bg,
  color: colors.text.primary,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.border.default,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.border.default,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.border.default,
  },
  '& .MuiSelect-select': {
    color: colors.text.primary,
  },
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Use React Query hook for brands
  const { data: brands = [], isLoading: brandsLoading, error: brandsError } = useBrands()

  // Debug logging
  useEffect(() => {
    console.log('Brands data:', brands);
    console.log('Brands loading:', brandsLoading);
    console.log('Brands error:', brandsError);
  }, [brands, brandsLoading, brandsError]);

  // Set error message if brands failed to load
  React.useEffect(() => {
    if (brandsError && !submitError) {
      setSubmitError('Failed to load brands. Please refresh the page.')
    }
  }, [brandsError, submitError])

  const DELIVERY_METHODS = ['standard', 'express', 'pickup']
  const HARDCODED_IMAGE_URL = 'https://example.com/product.jpg'

  const formik = useFormik<CreateProductData>({
    initialValues: {
      brandId: '',
      name: '',
      deliveryMethod: '',
      description: '',
      price: 0,
      imageUrl: HARDCODED_IMAGE_URL,
    },
    validationSchema: addProductValidationSchema,
    onSubmit: async (values) => {
      setSubmitError(null)
      setSuccessMessage(null)
      try {
        const response: CreateProductResponse = await productsService.createProductAPI(values)
        console.log('Product created successfully:', response)
        
        setSuccessMessage(`Product "${response.name}" created successfully with ID: ${response.id}`)
        
        // Reset form
        formik.resetForm()
        
        // Navigate back to products page after a short delay
        setTimeout(() => {
          navigate('/admin/products')
        }, 2000)
      } catch (error: any) {
        const errorMessage = error?.message || 'Failed to create product. Please try again.'
        setSubmitError(errorMessage)
        console.error('Error creating product:', error)
      }
    },
  })

  const handleSelectChange = (field: keyof CreateProductData) => (e: SelectChangeEvent<string>) => {
    formik.setFieldValue(field, e.target.value)
  }

  const handleTextChange = (field: keyof CreateProductData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (field === 'price') {
      formik.setFieldValue(field, parseFloat(e.target.value) || 0)
    } else {
      formik.setFieldValue(field, e.target.value)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container maxWidth="lg" sx={{ py: 4, flex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Typography 
          variant="h4" 
            sx={{ 
              mb: 4, 
              fontWeight: 700, 
              color: colors.text.primary,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Add Product
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
            {/* Success Alert */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}
            
            {/* Error Alert */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
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
              {/* Product Information Section */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: colors.text.primary,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Product Information
                </Typography>

                {/* Brand Name */}
                <FormControl 
                  fullWidth 
                  size="small" 
                  sx={{ mb: { xs: 1.5, sm: 2 } }}
                  disabled={brandsLoading}
                >
                  <InputLabel>Brand</InputLabel>
                  <Select
                    value={formik.values.brandId}
                    onChange={handleSelectChange('brandId')}
                    label="Brand"
                    sx={selectSx}
                    error={formik.touched.brandId && Boolean(formik.errors.brandId)}
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
                      <em>Select Brand</em>
                    </MenuItem>
                    {brands && brands.length > 0 ? (
                      brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.id}>
                          {brand.brandName || brand.name || `Brand ${brand.id}`}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <em>No brands available</em>
                      </MenuItem>
                    )}
                  </Select>
                  {brandsLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: colors.text.secondary }}>
                        Loading brands...
                      </Typography>
                    </Box>
                  )}
                  {formik.touched.brandId && formik.errors.brandId && (
                    <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                      {formik.errors.brandId}
                    </Typography>
                  )}
                </FormControl>

                {/* Product Name */}
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formik.values.name}
                  onChange={handleTextChange('name')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  variant="outlined"
                  size="small"
                  sx={{ ...fieldSx, mb: { xs: 1.5, sm: 2 } }}
                />

                {/* Delivery Method */}
                <FormControl 
                  fullWidth 
                  size="small" 
                  sx={{ mb: { xs: 1.5, sm: 2 } }}
                >
                  <InputLabel>Delivery Method</InputLabel>
                  <Select
                    value={formik.values.deliveryMethod}
                    onChange={handleSelectChange('deliveryMethod')}
                    label="Delivery Method"
                    sx={selectSx}
                    error={formik.touched.deliveryMethod && Boolean(formik.errors.deliveryMethod)}
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
                    <MenuItem value="" sx={{ color: colors.text.secondary }}>
                      <em>Select Delivery Method</em>
                    </MenuItem>
                    {DELIVERY_METHODS.map((method) => (
                      <MenuItem 
                        key={method} 
                        value={method}
                        sx={{ 
                          color: colors.text.primary,
                          '&:hover': {
                            backgroundColor: colors.background.paper,
                            color: colors.text.primary
                          }
                        }}
                      >
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.deliveryMethod && formik.errors.deliveryMethod && (
                    <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                      {formik.errors.deliveryMethod}
                    </Typography>
                  )}
                </FormControl>

                {/* Price */}
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
                  inputProps={{ step: '0.01', min: '0' }}
                  sx={fieldSx}
                />
              </Box>

              {/* Description Section */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: colors.text.primary,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Description
                </Typography>

                <TextField
                  fullWidth
                  label="Description"
                  value={formik.values.description}
                  onChange={handleTextChange('description')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  placeholder="Enter product description"
                  multiline
                  rows={4}
                  variant="outlined"
                  size="small"
                  sx={fieldSx}
                />
              </Box>

              {/* Image URL Info */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: colors.text.primary,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Product Image
                </Typography>

                <Alert severity="info" sx={{ mb: 2 }}>
                  Image URL is currently hardcoded: {HARDCODED_IMAGE_URL}
                </Alert>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1.5, sm: 2 },
                  justifyContent: 'flex-start',
                  mt: { xs: 2, sm: 2.5, md: 2 },
                  pt: { xs: 2, sm: 2.5 },
                  borderTop: `1px solid ${colors.border.default}`,
                  flexDirection: 'column',
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
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
                  {formik.isSubmitting ? 'Creating Product...' : 'Create Product'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    )
  }
  
  export default AddProduct
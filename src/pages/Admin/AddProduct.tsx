import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, Container } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import { colors } from '../../theme'
import { useProductsStore } from '../../store/useProductsStore'
import type { AddProductFormData, AdminProduct } from '../../types/Admin'

// Mock data for brands and delivery methods
const BRANDS = [
  { id: 'shirt-monkey', name: 'Shirt Monkey' },
  { id: 'hmv', name: 'Hear My Voice' },
  { id: 'project-zero', name: 'Project Zero' },
]

const DELIVERY_METHODS = ['Shirt Monkey', 'Standard', 'Express']

// Validation Schema
const addProductValidationSchema = Yup.object().shape({
  brandId: Yup.string()
    .required('Brand Name is required'),
  productName: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .required('Product Name is required'),
  deliveryMethod: Yup.string()
    .required('Delivery Method is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  imageUrl: Yup.string()
    .required('Image is required'),
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

const AddProduct: React.FC = () => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { addProduct, getNextProductId } = useProductsStore()

  const BRANDS_MAP: Record<string, string> = {
    'shirt-monkey': 'Shirt Monkey',
    'hmv': 'Hear My Voice',
    'project-zero': 'Project Zero',
  }

  const formik = useFormik<AddProductFormData>({
    initialValues: {
      brandId: '',
      productName: '',
      deliveryMethod: '',
      description: '',
      price: '',
      imageUrl: '',
    },
    validationSchema: addProductValidationSchema,
    onSubmit: async (values) => {
      setSubmitError(null)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Create new product object
        const newProduct: AdminProduct = {
          id: getNextProductId(), // Generate sequential ID like 001, 002, etc.
          productName: values.productName,
          description: values.description,
          brandId: values.brandId,
          brandName: BRANDS_MAP[values.brandId] || values.brandId,
          deliveryMethod: values.deliveryMethod,
          imageUrl: values.imageUrl,
          price: parseFloat(values.price),
        }
        
        // Add product to store
        addProduct(newProduct)
        console.log('Product added:', newProduct)
        
        // Navigate back to products page on success
        navigate('/admin/products')
      } catch (error) {
        setSubmitError('Failed to save product. Please try again.')
        console.error('Error saving product:', error)
      }
    },
  })

  const handleSelectChange = (field: keyof AddProductFormData) => (e: SelectChangeEvent<string>) => {
    formik.setFieldValue(field, e.target.value)
  }

  const handleTextChange = (field: keyof AddProductFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.setFieldValue(field, e.target.value)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        formik.setFieldValue('imageUrl', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
        <AdminSidebar activeMenu="products" />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                >
                  <InputLabel>Brand Name</InputLabel>
                  <Select
                    value={formik.values.brandId}
                    onChange={handleSelectChange('brandId')}
                    label="Brand Name"
                    sx={selectSx}
                    error={formik.touched.brandId && Boolean(formik.errors.brandId)}
                  >
                    <MenuItem value="">
                      <em>Select Brand</em>
                    </MenuItem>
                    {BRANDS.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
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
                  value={formik.values.productName}
                  onChange={handleTextChange('productName')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.productName && Boolean(formik.errors.productName)}
                  helperText={formik.touched.productName && formik.errors.productName}
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

              {/* Image Upload Section */}
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
                  Image Upload
                </Typography>

                <Box
                  sx={{
                    border: `2px dashed ${colors.border.default}`,
                    borderRadius: '8px',
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    bgcolor: colors.background.default,
                    '&:hover': {
                      borderColor: colors.text.primary,
                      bgcolor: `${colors.text.primary}05`,
                    },
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formik.values.imageUrl ? (
                    <Box>
                      <img 
                        src={formik.values.imageUrl} 
                        alt="Preview" 
                        style={{ maxHeight: '200px', maxWidth: '100%', marginBottom: '16px' }}
                      />
                      <Typography sx={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
                        Click to change image
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography sx={{ color: colors.text.secondary, mb: 1, fontSize: '1rem' }}>
                        📁
                      </Typography>
                      <Typography sx={{ color: colors.text.primary, fontWeight: 500, mb: 0.5 }}>
                        Select a file or drag and drop here
                      </Typography>
                      <Typography sx={{ color: colors.text.secondary, fontSize: '0.875rem' }}>
                        JPG, PNG, GIF up to 50MB
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          mt: 2,
                          borderColor: colors.border.default,
                          color: colors.text.primary,
                          '&:hover': {
                            borderColor: colors.text.primary,
                          },
                        }}
                      >
                        SELECT FILE
                      </Button>
                    </Box>
                  )}
                </Box>
                {formik.touched.imageUrl && formik.errors.imageUrl && (
                  <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.imageUrl}
                  </Typography>
                )}
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
                  {formik.isSubmitting ? 'Saving...' : 'Save product'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default AddProduct
import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import { colors } from '../../theme'
import { useStockStore } from '../../store/useStockStore'
import type { AddStockFormData, StockItem } from '../../types/Admin'

// Validation Schema
const addStockValidationSchema = Yup.object().shape({
  productName: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .required('Product Name is required'),
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
    .required('Image is required'),
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

const AddStock: React.FC = () => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { addStockItem, getNextStockItemId } = useStockStore()

  const formik = useFormik<AddStockFormData>({
    initialValues: {
      productName: '',
      color: '',
      size: '',
      quantity: '',
      price: '',
      imageUrl: '',
    },
    validationSchema: addStockValidationSchema,
    onSubmit: async (values) => {
      setSubmitError(null)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Create new stock item
        const newStockItem: StockItem = {
          id: getNextStockItemId(),
          itemId: getNextStockItemId(),
          productName: values.productName,
          color: values.color,
          size: values.size,
          quantity: parseFloat(values.quantity),
          price: parseFloat(values.price),
          imageUrl: values.imageUrl,
        }

        // Add to store
        addStockItem(newStockItem)
        console.log('Stock item added:', newStockItem)

        // Navigate back
        navigate('/admin/stock')
      } catch (error) {
        setSubmitError('Failed to save stock item. Please try again.')
        console.error('Error saving stock item:', error)
      }
    },
  })

  const handleTextChange = (field: keyof AddStockFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <AdminSidebar activeMenu="stock" />
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
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            Add Item
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

                {/* Color */}
                <TextField
                  fullWidth
                  label="Color"
                  value={formik.values.color}
                  onChange={handleTextChange('color')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.color && Boolean(formik.errors.color)}
                  helperText={formik.touched.color && formik.errors.color}
                  variant="outlined"
                  size="small"
                  sx={{ ...fieldSx, mb: { xs: 1.5, sm: 2 } }}
                />

                {/* Size and Quantity Row */}
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
                    label="Size"
                    value={formik.values.size}
                    onChange={handleTextChange('size')}
                    onBlur={formik.handleBlur}
                    error={formik.touched.size && Boolean(formik.errors.size)}
                    helperText={formik.touched.size && formik.errors.size}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                  />
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
                    inputProps={{ step: '1', min: '0' }}
                    sx={fieldSx}
                  />
                </Box>

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

              {/* Image Upload Section */}
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
                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
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
                  {formik.isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default AddStock

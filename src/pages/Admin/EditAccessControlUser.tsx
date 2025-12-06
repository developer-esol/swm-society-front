import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert, Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { colors } from '../../theme'
import { accessControlService } from '../../api/services/admin/accessControlService'
import type { AccessControlUser } from '../../types/Admin/accessControl'

// Validation Schema
const editAccessControlUserValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  role: Yup.string()
    .required('Role is required'),
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

const selectSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: colors.input.bg,
  },
  '& .MuiInputBase-input': {
    color: `${colors.text.primary} !important`,
  },
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

const EditAccessControlUser: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [user, setUser] = useState<AccessControlUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock: Get user by ID (in real app, would fetch from API)
  React.useEffect(() => {
    if (userId) {
      // Simulate fetching user
      const allUsers = accessControlService.getAll()
      Promise.resolve(allUsers).then((users) => {
        const foundUser = users.find((u) => u.id === userId)
        if (foundUser) {
          setUser(foundUser)
        }
        setLoading(false)
      })
    }
  }, [userId])

  const formik = useFormik({
    initialValues: {
      id: user?.id || '',
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
    },
    validationSchema: editAccessControlUserValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSubmitError(null)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Update user in service
        const updatedUser: AccessControlUser = {
          id: values.id,
          name: values.name,
          email: values.email,
          role: values.role,
        }

        console.log('User updated:', updatedUser)

        // Navigate back
        navigate('/admin/access-control')
      } catch (error) {
        setSubmitError('Failed to update user. Please try again.')
        console.error('Error updating user:', error)
      }
    },
  })

  const handleTextChange = (field: keyof typeof formik.values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(field, e.target.value)
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    formik.setFieldValue('role', e.target.value)
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>User not found</Typography>
      </Box>
    )
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
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Edit User
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
            {/* User Information Section */}
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
                User Information
              </Typography>

              {/* User ID (Read-only) */}
              <TextField
                fullWidth
                label="User ID"
                value={formik.values.id}
                disabled
                variant="outlined"
                size="small"
                sx={{ ...fieldSx, mb: { xs: 1.5, sm: 2 } }}
              />

              {/* Full Name */}
              <TextField
                fullWidth
                label="Full Name"
                value={formik.values.name}
                onChange={handleTextChange('name')}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                size="small"
                sx={{ ...fieldSx, mb: { xs: 1.5, sm: 2 } }}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formik.values.email}
                onChange={handleTextChange('email')}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                variant="outlined"
                size="small"
                sx={fieldSx}
              />
            </Box>

            {/* Role Assignment Section */}
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
                Role Assignment
              </Typography>

              {/* Role Dropdown */}
              <FormControl fullWidth size="small">
                <InputLabel>Select Role</InputLabel>
                <Select
                  value={formik.values.role}
                  onChange={handleSelectChange}
                  onBlur={formik.handleBlur}
                  label="Select Role"
                  sx={selectSx}
                >
                  <MenuItem value="">
                    <em>Select Role</em>
                  </MenuItem>
                  <MenuItem value="Super Admin">Super Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Select>
              </FormControl>
              {formik.touched.role && formik.errors.role && (
                <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                  {formik.errors.role}
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 1.5, sm: 2 },
                justifyContent: 'flex-end',
                mt: { xs: 3, sm: 3.5 },
                pt: { xs: 2.5, sm: 3 },
                borderTop: `1px solid ${colors.border.default}`,
                flexDirection: 'row',
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/access-control')}
                sx={{
                  borderColor: colors.border.default,
                  color: colors.text.primary,
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
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
                type="submit"
                disabled={formik.isSubmitting}
                sx={{
                  backgroundColor: colors.button.primary,
                  color: 'white',
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  '&:hover': {
                    backgroundColor: colors.button.primaryHover,
                  },
                  '&:disabled': {
                    backgroundColor: colors.border.default,
                  },
                }}
              >
                {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default EditAccessControlUser

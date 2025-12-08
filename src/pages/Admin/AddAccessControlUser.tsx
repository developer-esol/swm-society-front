import React, { useState } from 'react'
import { Box, Typography, TextField, Button, Alert, Container, Select, MenuItem, FormControl, InputLabel, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import type { SelectChangeEvent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { colors } from '../../theme'
import { accessControlService } from '../../api/services/admin/accessControlService'
import type { AddAccessControlUserFormData, AccessControlUser } from '../../types/Admin/accessControl'

// Validation Schema
const addAccessControlUserValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain a special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
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

const AddAccessControlUser: React.FC = () => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const formik = useFormik<AddAccessControlUserFormData>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    validationSchema: addAccessControlUserValidationSchema,
    onSubmit: async (values) => {
      setSubmitError(null)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Create new user
        const maxId = 999
        const newUser: AccessControlUser = {
          id: String(maxId + 1).padStart(3, '0'),
          name: values.fullName,
          email: values.email,
          role: values.role,
        }

        // Add to service
        const createdUser = await accessControlService.addUser(newUser)
        console.log('User added:', createdUser)

        // Clear form automatically
        formik.resetForm()

        // Navigate back
        navigate('/admin/access-control')
      } catch (error) {
        setSubmitError('Failed to save user. Please try again.')
        console.error('Error saving user:', error)
      }
    },
  })

  const handleTextChange = (field: keyof AddAccessControlUserFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.setFieldValue(field, e.target.value)
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    formik.setFieldValue('role', e.target.value)
  }

  // Password requirement helpers
  const passwordRequirements = {
    minLength: formik.values.password.length >= 8,
    hasUpperLower: /[A-Z]/.test(formik.values.password) && /[a-z]/.test(formik.values.password),
    hasNumber: /[0-9]/.test(formik.values.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formik.values.password),
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
          Add User
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

                {/* Full Name */}
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formik.values.fullName}
                  onChange={handleTextChange('fullName')}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
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

              {/* Security Section */}
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
                  Security
                </Typography>

                {/* Password and Confirm Password Row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 2.5 } }}>
                  {/* Password */}
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={handleTextChange('password')}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                            sx={{ color: colors.text.primary }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Confirm Password */}
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={handleTextChange('confirmPassword')}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    variant="outlined"
                    size="small"
                    sx={fieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                            sx={{ color: colors.text.primary }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Password Requirements Checklist */}
                <Box sx={{ 
                  bgcolor: `${colors.text.primary}08`, 
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: '8px', 
                  p: 2.5, 
                  mt: { xs: 2.5, sm: 3 },
                  mb: { xs: 2, sm: 2.5 }
                }}>
                  <Typography
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      mb: 1.5,
                      color: colors.text.primary,
                    }}
                  >
                    Password Requirements:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        color: passwordRequirements.minLength ? '#10b981' : '#999999',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: passwordRequirements.minLength ? 600 : 400,
                      }}
                    >
                      <span>{passwordRequirements.minLength ? '✓' : '✗'}</span>
                      At least 8 characters long
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        color: passwordRequirements.hasUpperLower ? '#10b981' : '#999999',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: passwordRequirements.hasUpperLower ? 600 : 400,
                      }}
                    >
                      <span>{passwordRequirements.hasUpperLower ? '✓' : '✗'}</span>
                      Contains uppercase and lowercase letters
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        color: passwordRequirements.hasNumber ? '#10b981' : '#999999',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: passwordRequirements.hasNumber ? 600 : 400,
                      }}
                    >
                      <span>{passwordRequirements.hasNumber ? '✓' : '✗'}</span>
                      Contains at least one number
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        color: passwordRequirements.hasSpecial ? '#10b981' : '#999999',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: passwordRequirements.hasSpecial ? 600 : 400,
                      }}
                    >
                      <span>{passwordRequirements.hasSpecial ? '✓' : '✗'}</span>
                      Contains at least one special character
                    </Typography>
                  </Box>
                </Box>
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
                  onClick={() => formik.resetForm()}
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
                  Clear
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
                  {formik.isSubmitting ? 'Creating User...' : '+ Create User'}
                </Button>
              </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default AddAccessControlUser

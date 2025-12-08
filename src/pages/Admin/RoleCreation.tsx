import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import type { SelectChangeEvent } from '@mui/material'
import { rolesService, mockPermissions } from '../../api/services/admin/rolesService'
import { colors } from '../../theme'

const roleCreationValidationSchema = Yup.object().shape({
  name: Yup.string().required('Role name is required').min(3, 'Role name must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  status: Yup.string().required('Status is required'),
})

type RoleFormData = {
  name: string
  description: string
  status: string
}

// Field styling matching AddProduct
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

const RoleCreation = () => {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  // Use mock permissions data from service
  const allPermissions = mockPermissions

  const categories = useMemo(() => {
    const cats = new Set(allPermissions.map((p) => p.category))
    return Array.from(cats)
  }, [allPermissions])

  const handleSelectChange = (field: keyof RoleFormData) => (e: SelectChangeEvent<string>) => {
    formik.setFieldValue(field, e.target.value)
  }

  const handleTextChange = (field: keyof RoleFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.setFieldValue(field, e.target.value)
  }

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleSelectAll = (category: string) => {
    const categoryPermissions = allPermissions
      .filter((p) => p.category === category)
      .map((p) => p.id)
    const allSelected = categoryPermissions.every((id) => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !categoryPermissions.includes(id)))
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...categoryPermissions])])
    }
  }

  const formik = useFormik<RoleFormData>({
    initialValues: {
      name: '',
      description: '',
      status: 'Active',
    },
    validationSchema: roleCreationValidationSchema,
    onSubmit: async (values) => {
      setSubmitError(null)

      if (selectedPermissions.length === 0) {
        setSubmitError('Please select at least one permission')
        return
      }

      const newRole = {
        name: values.name,
        description: values.description,
        icon: '🔘',
        usersCount: 0,
        permissionsCount: selectedPermissions.length,
        status: values.status,
        permissions: allPermissions.filter((p) => selectedPermissions.includes(p.id)),
      }

      try {
        await rolesService.create(newRole)
        navigate('/admin/roles')
      } catch (error) {
        setSubmitError('Failed to create role. Please try again.')
        console.error('Failed to create role:', error)
      }
    },
  })

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
          Create Role
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
            {/* Role Information Section */}
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
                Role Information
              </Typography>

              {/* Role Name */}
              <TextField
                fullWidth
                label="Role Name"
                value={formik.values.name}
                onChange={handleTextChange('name')}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                variant="outlined"
                size="small"
                sx={{ ...fieldSx, mb: { xs: 1.5, sm: 2 } }}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                value={formik.values.description}
                onChange={handleTextChange('description')}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                placeholder="Enter role description"
                multiline
                rows={4}
                variant="outlined"
                size="small"
                sx={{ ...fieldSx, mb: { xs: 1.5, sm: 2 } }}
              />

              {/* Status */}
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formik.values.status}
                  onChange={handleSelectChange('status')}
                  label="Status"
                  sx={selectSx}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                >
                  <MenuItem value="">
                    <em>Select Status</em>
                  </MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <Typography sx={{ color: colors.status.error, fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.status}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Permissions Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: colors.text.primary,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  }}
                >
                  Assign Permissions
                </Typography>
                <Typography
                  onClick={() => setSelectedPermissions(allPermissions.map((p) => p.id))}
                  sx={{
                    color: colors.button.primary,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  Select All
                </Typography>
              </Box>

              {/* Permissions Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 3,
                }}
              >
                {categories.map((category) => {
                  const categoryPermissions = allPermissions.filter((p) => p.category === category)
                  const allSelected = categoryPermissions.every((id) => selectedPermissions.includes(id.id))

                  return (
                    <Box
                      key={category}
                      sx={{
                        p: 3,
                        border: `1px solid ${colors.border.default}`,
                        borderRadius: '8px',
                        bgcolor: colors.background.default,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box
                          sx={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            bgcolor: '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                          }}
                        >
                          📋
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: colors.text.primary, flex: 1 }}>
                          {category}
                        </Typography>
                        <Checkbox
                          checked={allSelected}
                          onChange={() => handleSelectAll(category)}
                          sx={{
                            '&.Mui-checked': {
                              color: colors.button.primary,
                            },
                          }}
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {categoryPermissions.map((permission) => (
                          <FormControlLabel
                            key={permission.id}
                            control={
                              <Checkbox
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => handlePermissionChange(permission.id)}
                                sx={{
                                  '&.Mui-checked': {
                                    color: colors.button.primary,
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: '0.95rem', color: colors.text.primary }}>
                                {permission.name}
                              </Typography>
                            }
                          />
                        ))}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                pt: 2,
                borderTop: `1px solid ${colors.border.default}`,
              }}
            >
              <Button
                onClick={() => navigate('/admin/roles')}
                sx={{
                  color: colors.text.primary,
                  border: `1px solid ${colors.border.default}`,
                  px: 3,
                  py: 1.2,
                  borderRadius: '6px',
                  '&:hover': {
                    bgcolor: colors.background.lighter,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: colors.button.primary,
                  color: 'white',
                  px: 3,
                  py: 1.2,
                  borderRadius: '6px',
                  '&:hover': {
                    bgcolor: colors.button.primaryHover,
                  },
                }}
              >
                Create Role
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default RoleCreation

import { Box, Container, Typography, Button, Checkbox, FormControlLabel, Divider } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { rolesService } from '../../api/services/admin/rolesService'
import { colors } from '../../theme'
import type { Role, Permission } from '../../types/Admin/roles'

const PermissionLevels = () => {
  const { roleId } = useParams<{ roleId: string }>()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock permissions for all categories
  const allPermissions: Permission[] = useMemo(
    () => [
      // Dashboard
      { id: '1', name: 'View Dashboard Analytics', category: 'Dashboard', enabled: true },
      { id: '2', name: 'User Top Selling Products', category: 'Dashboard', enabled: true },
      // Products Management
      { id: '3', name: 'Search Products', category: 'Products Management', enabled: true },
      { id: '4', name: 'Create new products', category: 'Products Management', enabled: true },
      { id: '5', name: 'Update existing products', category: 'Products Management', enabled: true },
      { id: '6', name: 'Remove existing products', category: 'Products Management', enabled: true },
      // Stock Management
      { id: '7', name: 'View available stock', category: 'Stock Management', enabled: true },
      { id: '8', name: 'Change stock price', category: 'Stock Management', enabled: true },
      { id: '9', name: 'Remove existing stock', category: 'Stock Management', enabled: true },
      { id: '10', name: 'Change stock quantity', category: 'Stock Management', enabled: true },
      { id: '11', name: 'Add new stock', category: 'Stock Management', enabled: true },
      // Loyalty Points Management
      { id: '12', name: 'Adjust loyalty points of customers', category: 'Loyalty Points Management', enabled: true },
      // Sales
      { id: '13', name: 'View Sales Information', category: 'Sales', enabled: true },
      { id: '14', name: 'Update delivery status', category: 'Sales', enabled: true },
      // Users
      { id: '15', name: 'View existing customers', category: 'Users', enabled: true },
      { id: '16', name: 'Deactivate Accounts', category: 'Users', enabled: true },
    ],
    []
  )

  const categories = useMemo(() => {
    const cats = new Set(allPermissions.map((p) => p.category))
    return Array.from(cats)
  }, [allPermissions])

  useEffect(() => {
    const loadRole = async () => {
      setIsLoading(true)
      try {
        if (roleId) {
          const foundRole = await rolesService.getById(roleId)
          if (foundRole) {
            setRole(foundRole)
            setSelectedPermissions(foundRole.permissions.map((p) => p.id))
          }
        }
      } catch (error) {
        console.error('Failed to load role:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRole()
  }, [roleId])

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleSave = async () => {
    if (role && roleId) {
      const updatedPermissions = allPermissions.filter((p) => selectedPermissions.includes(p.id))
      await rolesService.update(roleId, {
        ...role,
        permissions: updatedPermissions,
        permissionsCount: updatedPermissions.length,
      })
      navigate('/admin/roles')
    }
  }

  if (isLoading) {
    return <Typography sx={{ textAlign: 'center', py: 4 }}>Loading...</Typography>
  }

  if (!role) {
    return <Typography sx={{ textAlign: 'center', py: 4 }}>Role not found</Typography>
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 4, md: 4 },
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            mb: 1,
          }}
        >
          Permission Levels
        </Typography>
        <Typography sx={{ color: colors.text.secondary, mb: 4 }}>
          {role.name}
        </Typography>

        {/* Permissions Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          {categories.map((category) => {
            const categoryPermissions = allPermissions.filter((p) => p.category === category)
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
                  <Typography sx={{ fontWeight: 600, color: colors.text.primary }}>
                    {category}
                  </Typography>
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

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'flex-end',
            pt: 3,
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
            onClick={handleSave}
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
            Save Changes
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default PermissionLevels

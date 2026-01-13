import { Box, Container, Typography, Button, Checkbox, FormControlLabel, Divider, CircularProgress, TextField, IconButton } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import { rolesService } from '../../api/services/admin/rolesService'
import { colors } from '../../theme'
import type { Role, Permission } from '../../types/Admin/roles'

const PermissionLevels = () => {
  const { roleId } = useParams<{ roleId: string }>()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role | null>(null)
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    const cats = new Set(allPermissions.map((p) => p.resource))
    return Array.from(cats)
  }, [allPermissions])

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const query = searchQuery.toLowerCase()
    return categories.filter((category) => {
      const categoryPermissions = allPermissions.filter((p) => p.resource === category)
      return (
        category.toLowerCase().includes(query) ||
        categoryPermissions.some((p) => p.name.toLowerCase().includes(query))
      )
    })
  }, [categories, allPermissions, searchQuery])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load permissions
        const permissions = await rolesService.getAllPermissions()
        setAllPermissions(permissions)

        // Load role if roleId exists
        if (roleId) {
          const foundRole = await rolesService.getById(roleId)
          if (foundRole) {
            setRole(foundRole)
            setSelectedPermissions(foundRole.permissions.map((p) => p.id))
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [roleId])

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    )
  }

  const handleSelectAll = (category: string) => {
    const categoryPermissions = allPermissions
      .filter((p) => p.resource === category)
      .map((p) => p.id)
    const allSelected = categoryPermissions.every((id) => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !categoryPermissions.includes(id)))
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...categoryPermissions])])
    }
  }

  const handleSave = async () => {
    if (role && roleId) {
      try {
        await rolesService.update(roleId, {
          name: role.name,
          description: role.description,
          permissionIds: selectedPermissions,
        })
        navigate('/admin/roles')
      } catch (error) {
        console.error('Failed to update role:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
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

        {/* Search Bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              placeholder="Search Permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                width: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: colors.background.default,
                },
              }}
            />
            <IconButton
              sx={{
                bgcolor: colors.button.new,
                color: colors.text.secondary,
                borderRadius: 1,
                p: 1,
                '&:hover': { bgcolor: colors.button.dark },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Permissions Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          {filteredCategories.map((category) => {
            const categoryPermissions = allPermissions.filter((p) => p.resource === category)
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
                      bgcolor: colors.danger.background,
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

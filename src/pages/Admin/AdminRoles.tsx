import { Box, Container, Typography, Button, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminBreadcrumbs from '../../components/AdminBreadcrumbs'
import { RoleCard, RolesHeader } from '../../features/Admin/roles'
import { useAdminRoles } from '../../hooks/admin'
import { ConfirmDeleteDialog } from '../../components'
import { colors } from '../../theme'
import type { Role } from '../../types/Admin/roles'

const AdminRoles = () => {
  const navigate = useNavigate()
  const { roles: displayRoles, searchQuery, handleSearch, handleDeleteRole, isLoading } = useAdminRoles()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  // Debug logging
  console.log('AdminRoles - isLoading:', isLoading)
  console.log('AdminRoles - displayRoles:', displayRoles)
  console.log('AdminRoles - displayRoles.length:', displayRoles.length)

  const handleDeleteClick = (role: Role) => {
    // Do not allow deleting Super Admin role
    if ((role.name || '').toLowerCase().trim().includes('super admin')) {
      console.warn('Attempt to delete Super Admin role blocked')
      return
    }
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (roleToDelete) {
      await handleDeleteRole(roleToDelete.id)
      setDeleteDialogOpen(false)
      setRoleToDelete(null)
    }
  }

  const handleEditRole = (role: Role) => {
    navigate(`/admin/permission-levels/${role.id}`)
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
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
          <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Roles', to: '/admin/roles' }]} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.text.primary,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            Roles and Permission Management
          </Typography>
        </Box>

        {/* Search Bar and Create Button aligned */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <RolesHeader
            searchQuery={searchQuery}
            onSearch={handleSearch}
          />
          <Button
            variant="contained"
            onClick={() => navigate('/admin/role-creation')}
            sx={{
              bgcolor: colors.button.primary,
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              py: 1,
              borderRadius: 1,
              minWidth: 140,
              boxShadow: 1,
              '&:hover': {
                bgcolor: colors.button.primaryHover,
              },
            }}
          >
            Create New Role
          </Button>
        </Box>

        {/* Roles List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : displayRoles.length > 0 ? (
            <Box>
              <Typography sx={{ fontWeight: 600, color: colors.text.primary, mb: 3 }}>System Roles</Typography>
              {displayRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={handleEditRole}
                  onDelete={handleDeleteClick}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={{ textAlign: 'center', color: colors.text.secondary, py: 4 }}>
              No roles found
            </Typography>
          )}
        </Box>
      </Container>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone.`}
        onConfirm={async () => {
          if (!roleToDelete) return
          await handleDeleteRole(roleToDelete.id)
          setDeleteDialogOpen(false)
          setRoleToDelete(null)
        }}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setRoleToDelete(null)
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  )
}

export default AdminRoles

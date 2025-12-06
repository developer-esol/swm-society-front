import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoleCard, RolesHeader } from '../../features/Admin/roles'
import { useAdminRoles } from '../../hooks/admin'
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
              '&:hover': {
                bgcolor: colors.button.primaryHover,
              },
            }}
          >
            Create New Role
          </Button>
        </Box>

        {/* Search Header */}
        <RolesHeader searchQuery={searchQuery} onSearch={handleSearch} />

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: colors.text.primary }}>Delete Role</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ color: colors.text.primary }}>
            Are you sure you want to delete the role "{roleToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: colors.text.primary }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: '#dc2626',
              color: 'white',
              '&:hover': {
                bgcolor: '#b91c1c',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminRoles

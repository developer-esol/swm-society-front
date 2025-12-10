import { Box, Container, Typography, Pagination, Stack, TextField, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { useState, useEffect } from 'react'
import { Search as SearchIcon } from '@mui/icons-material'
import AdminBreadcrumbs from '../../components/AdminBreadcrumbs'
import { UsersTable } from '../../features/Admin/users'
import { userService } from '../../api/services/admin/userService'
import { rolesService } from '../../api/services/admin/rolesService'
import { ConfirmDeleteDialog } from '../../components'
import { colors } from '../../theme'
import type { AdminUser } from '../../types/Admin/users'

const ITEMS_PER_PAGE = 5

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [rolesList, setRolesList] = useState<{ id: string; name: string }[]>([])
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)

  // Fetch users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const allUsers = await userService.getAll()
        // fetch roles and map roleId -> role name
        const roles = await rolesService.getAll()
        setRolesList(roles.map((r) => ({ id: r.id, name: r.name })))
        const roleMap = new Map<string, string>()
        roles.forEach((r) => roleMap.set(r.id, r.name))

        const usersWithRoleNames = allUsers.map((u) => ({
          ...u,
          // if u.role contains an id, map to name; otherwise keep as-is
          role: roleMap.get(u.role) || u.role || '—',
        }))

        setUsers(usersWithRoleNames)
        setFilteredUsers(usersWithRoleNames)
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Handle search filter
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    applyFilters(query, selectedRole)
  }

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId)
    setCurrentPage(1)
    applyFilters(searchQuery, roleId)
  }

  const applyFilters = (query: string, roleId: string) => {
    let result = users
    const lowerQuery = query.trim().toLowerCase()

    if (lowerQuery) {
      result = result.filter((user) =>
        user.id.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.status.toLowerCase().includes(lowerQuery) ||
        (user.role || '').toLowerCase().includes(lowerQuery)
      )
    }

    if (roleId && roleId !== 'all') {
      const roleName = rolesList.find((r) => r.id === roleId)?.name || roleId
      result = result.filter((user) => (user.role || '').toLowerCase() === roleName.toLowerCase())
    }

    setFilteredUsers(result)
  }

  // Prepare delete dialog
  const handleRequestDelete = (userId: string) => {
    const user = users.find((u) => u.id === userId) || null
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  // Confirm delete user
  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    try {
      const success = await userService.removeUser(userToDelete.id)
      if (success) {
        const updatedUsers = users.filter((u) => u.id !== userToDelete.id)
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)
        setCurrentPage(1)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  // Handle edit user
  const handleEditUser = (user: AdminUser) => {
    // TODO: Implement user edit functionality
    console.log('Edit user:', user)
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading users...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 4, md: 4 },
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%'
        }}
      >
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Users', to: '/admin/users' }]} />
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Users
        </Typography>

        {/* Search + Role Filter Row */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search Users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
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
                bgcolor: '#C62C2B',
                color: 'white',
                borderRadius: 1,
                p: 1,
                '&:hover': { bgcolor: '#A82421' },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>

          <Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="role-filter-label">Role</InputLabel>
              <Select
                labelId="role-filter-label"
                value={selectedRole}
                label="Role"
                onChange={(e) => handleRoleChange(e.target.value as string)}
                sx={{ bgcolor: colors.background.paper }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                {rolesList.map((r) => (
                  <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <UsersTable
          users={paginatedUsers}
          onEdit={handleEditUser}
          onDelete={handleRequestDelete}
        />

        {filteredUsers.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
              {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </Typography>
            <Stack spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="standard"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: colors.text.primary,
                    fontSize: '0.9rem'
                  },
                  '& .MuiPaginationItem-page.Mui-selected': {
                    bgcolor: colors.button.primary,
                    color: 'white'
                  }
                }}
              />
            </Stack>
          </Box>
        )}
      </Container>
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.email || userToDelete?.id}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Box>
  )
}

export default AdminUsers

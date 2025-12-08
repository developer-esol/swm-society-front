import { Box, Container, Typography, Button, Pagination, Stack } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccessControlTable, AccessControlHeader, EditAccessControlUserModal } from '../../features/Admin/accessControl'
import { useAccessControl } from '../../hooks/admin'
import { colors } from '../../theme'
import type { AccessControlUser } from '../../types/Admin/accessControl'

const ITEMS_PER_PAGE = 5

const AdminAccessControl = () => {
  const navigate = useNavigate()
  const { users: filteredUsers, searchQuery, handleSearch, handleDeleteUser, handleUpdateUser } = useAccessControl()
  const [currentPage, setCurrentPage] = useState(1)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AccessControlUser | null>(null)

  // Handle edit user
  const handleEditUser = (user: AccessControlUser) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedUser(null)
  }

  // Handle save edit
  const handleSaveEdit = (updatedUser: AccessControlUser) => {
    handleUpdateUser(updatedUser)
    handleCloseEditModal()
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.text.primary,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Access Control
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/add-access-control-user')}
            sx={{
              bgcolor: colors.button.primary,
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                bgcolor: colors.button.primaryHover,
              }
            }}
          >
            + Add User
          </Button>
        </Box>

        <AccessControlHeader
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />

        <AccessControlTable
          users={paginatedUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
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

      <EditAccessControlUserModal
        open={editModalOpen}
        user={selectedUser}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
      />
    </Box>
  )
}

export default AdminAccessControl

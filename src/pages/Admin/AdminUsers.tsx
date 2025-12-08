import { Box, Container, Typography, Pagination, Stack } from '@mui/material'
import { useState, useEffect } from 'react'
import { UsersTable, UserTableHeader } from '../../features/Admin/users'
import { userService } from '../../api/services/admin/userService'
import { colors } from '../../theme'
import type { AdminUser } from '../../types/Admin/users'

const ITEMS_PER_PAGE = 5

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const allUsers = await userService.getAll()
        setUsers(allUsers)
        setFilteredUsers(allUsers)
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

    if (query.trim() === '') {
      setFilteredUsers(users)
    } else {
      const lowerQuery = query.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.id.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery) ||
          user.status.toLowerCase().includes(lowerQuery)
      )
      setFilteredUsers(filtered)
    }
  }

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.removeUser(userId)
      const updatedUsers = users.filter((u) => u.id !== userId)
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
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
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, sm: 4 },
            fontWeight: 700,
            color: colors.text.primary,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          Users
        </Typography>

        <UserTableHeader
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />

        <UsersTable
          users={paginatedUsers}
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
    </Box>
  )
}

export default AdminUsers

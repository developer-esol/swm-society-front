import { useState, useMemo, useCallback, useEffect } from 'react'
import { accessControlService } from '../../api/services/admin/accessControlService'
import type { AccessControlUser } from '../../types/Admin/accessControl'

export const useAccessControl = () => {
  const [users, setUsers] = useState<AccessControlUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await accessControlService.getAll()
      setUsers(allUsers)
    }
    loadUsers()
  }, [])

  const filteredUsers = useMemo(
    () => {
      if (searchQuery.trim() === '') {
        return users
      }

      const lowerQuery = searchQuery.toLowerCase()
      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery) ||
          user.role.toLowerCase().includes(lowerQuery)
      )
    },
    [searchQuery, users]
  )

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleDeleteUser = useCallback((id: string) => {
    accessControlService.deleteUser(id)
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id))
  }, [])

  const handleAddUser = useCallback(async (newUser: AccessControlUser) => {
    const createdUser = await accessControlService.addUser(newUser)
    setUsers((prevUsers) => [...prevUsers, createdUser])
  }, [])

  const handleUpdateUser = useCallback((updatedUser: AccessControlUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    )
  }, [])

  return {
    users: filteredUsers,
    allUsers: users,
    searchQuery,
    handleSearch,
    handleDeleteUser,
    handleAddUser,
    handleUpdateUser,
  }
}

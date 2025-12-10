import { useState, useCallback, useEffect, useMemo } from 'react'
import { rolesService } from '../../api/services/admin/rolesService'
import { userService } from '../../api/services/admin/userService'
import type { Role } from '../../types/Admin/roles'

export const useAdminRoles = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 5

  // Load roles on mount
  useEffect(() => {
    const loadRoles = async () => {
      setIsLoading(true)
      try {
        const allRoles = await rolesService.getAll()
        // fetch users to compute usersCount per role
        let users = [] as Array<{ id: string; role?: string }>
        try {
          const fetched = await userService.getAll()
          // userService returns AdminUser with `role` set to roleId (per implementation)
          users = fetched.map((u) => ({ id: u.id, role: u.role }))
        } catch (err) {
          console.warn('useAdminRoles - failed to fetch users for role counts', err)
        }

        // compute usersCount for each role using role.id matching user.role
        const rolesWithCounts = allRoles.map((role) => {
          const count = users.filter((u) => (u.role || '').toString() === role.id.toString()).length
          return { ...role, usersCount: count }
        })

        console.log('useAdminRoles - loaded allRoles with counts:', rolesWithCounts)
        setRoles(rolesWithCounts)
      } catch (error) {
        console.error('Failed to load roles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRoles()
  }, [])

  // Filter roles by search query
  const filteredRoles = useMemo(
    () => {
      if (searchQuery.trim() === '') {
        return roles
      }
      return roles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    },
    [searchQuery, roles]
  )

  // Paginate roles
  const totalPages = Math.ceil(filteredRoles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }, [])

  const handleDeleteRole = useCallback(async (id: string) => {
    try {
      const success = await rolesService.delete(id)
      if (success) {
        setRoles((prev) => prev.filter((role) => role.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete role:', error)
    }
  }, [])

  const handleUpdateRole = useCallback(async (id: string, updatedRole: Partial<Role>) => {
    try {
      const updated = await rolesService.update(id, updatedRole)
      if (updated) {
        setRoles((prev) => prev.map((role) => (role.id === id ? updated : role)))
      }
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }, [])

  const handleCreateRole = useCallback(async (newRole: Omit<Role, 'id'>) => {
    try {
      const created = await rolesService.create(newRole)
      setRoles((prev) => [...prev, created])
      return created
    } catch (error) {
      console.error('Failed to create role:', error)
    }
  }, [])

  return {
    roles: paginatedRoles,
    filteredRoles,
    currentPage,
    totalPages,
    searchQuery,
    isLoading,
    handleSearch,
    handlePageChange,
    handleDeleteRole,
    handleUpdateRole,
    handleCreateRole,
  }
}

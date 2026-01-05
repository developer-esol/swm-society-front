import type { Role, Permission, CreateRoleRequest } from '../../../types/Admin/roles'
import { authApiClient } from '../../apiClient'

class RolesService {
  /**
   * Get all permissions from backend
   */
  async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await authApiClient.get<any>('/api/admin/permissions')
      console.log('[RolesService] Fetched permissions:', response)
      // If response has data property, unwrap it
      if (response && typeof response === 'object' && 'data' in response) {
        return Array.isArray(response.data) ? response.data : []
      }
      // If response is already an array, return it
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error('[RolesService] Error fetching permissions:', error)
      throw error
    }
  }

  /**
   * Get all roles from backend
   */
  async getAll(): Promise<Role[]> {
    try {
      const response = await authApiClient.get<any>('/api/admin/roles')
      console.log('[RolesService] Fetched roles:', response)
      // If response has data property, unwrap it
      if (response && typeof response === 'object' && 'data' in response) {
        return Array.isArray(response.data) ? response.data : []
      }
      // If response is already an array, return it
      return Array.isArray(response) ? response : []
    } catch (error) {
      console.error('[RolesService] Error fetching roles:', error)
      throw error
    }
  }

  /**
   * Get role by ID
   */
  async getById(id: string): Promise<Role | null> {
    try {
      const response = await authApiClient.get<any>(`/api/admin/roles/${id}`)
      console.log('[RolesService] Fetched role by ID:', response)
      // If response has data property, unwrap it
      if (response && typeof response === 'object' && 'data' in response) {
        return response.data || null
      }
      // If response is the role object itself, return it
      return response || null
    } catch (error) {
      console.error('[RolesService] Error fetching role:', error)
      return null
    }
  }

  /**
   * Create a new role
   */
  async create(data: CreateRoleRequest): Promise<Role> {
    try {
      const response = await authApiClient.post<{ success: boolean; message: string; data: Role }>(
        '/api/admin/roles',
        data
      )
      console.log('[RolesService] Role created:', response)
      return response.data
    } catch (error) {
      console.error('[RolesService] Error creating role:', error)
      throw error
    }
  }

  /**
   * Update an existing role
   */
  async update(id: string, data: Partial<CreateRoleRequest>): Promise<Role> {
    try {
      const response = await authApiClient.put<{ success: boolean; message: string; data: Role }>(
        `/api/admin/roles/${id}`,
        data
      )
      console.log('[RolesService] Role updated:', response)
      return response.data
    } catch (error) {
      console.error('[RolesService] Error updating role:', error)
      throw error
    }
  }

  /**
   * Delete a role
   */
  async delete(id: string): Promise<boolean> {
    try {
      await authApiClient.delete(`/api/admin/roles/${id}`)
      console.log('[RolesService] Role deleted:', id)
      return true
    } catch (error) {
      console.error('[RolesService] Error deleting role:', error)
      return false
    }
  }
}

export const rolesService = new RolesService()
export { rolesService as default }

import { apiClient, authApiClient } from '../../apiClient'
import type { AdminUser } from '../../../types/Admin/users'

type UserApi = {
  id: number // Database primary key (bigint)
  email: string
  emailVerified: boolean
  fullName: string | null
  isActive: boolean
  lastLogin: string | null
  provider: string
  createdAt: string
  role?: {
    id: number
    name: string
    description?: string
    permissions?: any[]
  } | null
}

class UserService {
  /**
   * Get all users from the Spring Boot backend API (port 8080)
   * @returns Promise with array of users
   */
  async getAll(): Promise<AdminUser[]> {
    try {
      const response = await authApiClient.get<any>('/api/users')
      console.log('[UserService] Raw response:', response)
      
      // Unwrap response if needed
      const data = response?.data ? response.data : response
      const users = Array.isArray(data) ? data : []
      
      return users.map((user: UserApi) => {
        const roleId = user.role?.id
        const roleName = user.role?.name || '—'
        return {
          id: String(user.id), // Convert numeric ID to string for display
          numericId: user.id, // Store numeric ID for API calls
          email: user.email,
          status: user.isActive ? 'Active' : 'Inactive',
          role: roleName,
          roleId: roleId,
        }
      })
    } catch (error) {
      console.error('[UserService] Error fetching users:', error)
      return []
    }
  }

  /**
   * Get a single user by id. Uses a small in-memory cache to avoid repeated calls.
   */
  private userCache: Record<string, { id: string; name?: string; email?: string }> = {}

  async getById(userId: string): Promise<{ id: string; name?: string; email?: string } | null> {
    if (!userId) return null
    if (this.userCache[userId]) return this.userCache[userId]

    try {
      const response = await authApiClient.get<any>(`/api/users/${userId}`)
      const user = response?.data || response
      const result = { id: String(user.id), name: user.fullName || user.name || user.email, email: user.email }
      this.userCache[userId] = result
      return result
    } catch (err) {
      console.error('userService.getById error:', err)
      return null
    }
  }

  /**
   * Remove a user by ID
   */
  async removeUser(userId: string): Promise<boolean> {
    try {
      // Use numeric ID if possible
      const numericId = isNaN(Number(userId)) ? userId : Number(userId)
      await authApiClient.delete(`/api/users/${numericId}`)
      return true
    } catch (err) {
      console.error('Failed to remove user:', err)
      return false
    }
  }

  /**
   * Update user's role
   * @param userId - The ID of the user (string for display)
   * @param roleId - The new role ID (number)
   * @param numericId - The numeric ID from database (required)
   * @returns Promise with success status
   */
  async updateUserRole(userId: string, roleId: number, numericId?: number): Promise<boolean> {
    try {
      // Use numericId if provided, otherwise try to parse userId
      const userIdToUse = numericId !== undefined ? numericId : (isNaN(Number(userId)) ? userId : Number(userId))
      
      console.log('[UserService] Updating role for user:', userIdToUse, 'to role:', roleId)
      
      const response = await authApiClient.put<any>(
        `/api/admin/users/${userIdToUse}/role`,
        { roleId }
      )
      console.log('[UserService] Updated user role:', response)
      return true
    } catch (err) {
      console.error('Failed to update user role:', err)
      throw err
    }
  }
}

export const userService = new UserService()

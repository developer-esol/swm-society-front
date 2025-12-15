import { apiClient } from '../../apiClient'
import type { AdminUser } from '../../../types/Admin/users'

type UserApi = {
  id: string
  email: string
  isActive: boolean
  roleId?: string
}

class UserService {
  /**
   * Get all users from the backend API
   * @returns Promise with array of users
   */
  async getAll(): Promise<AdminUser[]> {
    const data = await apiClient.get<UserApi[]>('/users', { limit: '100', page: '1' })
    return data.map((user) => ({
      id: user.id,
      email: user.email,
      status: user.isActive ? 'Active' : 'Inactive',
      role: user.roleId || '',
    }))
  }

  /**
   * Get a single user by id. Uses a small in-memory cache to avoid repeated calls.
   */
  private userCache: Record<string, { id: string; name?: string; email?: string }> = {}

  async getById(userId: string): Promise<{ id: string; name?: string; email?: string } | null> {
    if (!userId) return null
    if (this.userCache[userId]) return this.userCache[userId]

    try {
      const user = await apiClient.get<any>(`/users/${userId}`)
      const result = { id: user.id, name: user.name || user.fullName || user.email, email: user.email }
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
      await apiClient.delete(`/users/${userId}`)
      return true
    } catch (err) {
      console.error('Failed to remove user:', err)
      return false
    }
  }
}

export const userService = new UserService()

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

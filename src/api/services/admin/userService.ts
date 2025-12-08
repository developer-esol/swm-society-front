import type { AdminUser } from '../../../types/Admin/users'

class UserService {
  // Mock data - 15+ users matching the screenshot
  private mockUsers: AdminUser[] = [
    { id: '001', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '002', email: 'johndoe@gmail.com', status: 'Inactive' },
    { id: '003', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '004', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '005', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '006', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '007', email: 'johndoe@gmail.com', status: 'Inactive' },
    { id: '008', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '009', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '010', email: 'johndoe@gmail.com', status: 'Inactive' },
    { id: '011', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '012', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '013', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '014', email: 'johndoe@gmail.com', status: 'Inactive' },
    { id: '015', email: 'johndoe@gmail.com', status: 'Active' },
    { id: '016', email: 'johndoe@gmail.com', status: 'Active' },
  ]

  /**
   * Get all users
   * @returns Promise with array of users
   */
  async getAll(): Promise<AdminUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.mockUsers]), 500)
    })
  }

  /**
   * Remove a user by ID
   * @param userId - User ID to remove
   * @returns Promise with boolean success status
   */
  async removeUser(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockUsers = this.mockUsers.filter((u) => u.id !== userId)
        resolve(true)
      }, 300)
    })
  }

  /**
   * Search users by email or ID
   * @param query - Search query
   * @returns Promise with filtered users
   */
  async searchUsers(query: string): Promise<AdminUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase()
        const filtered = this.mockUsers.filter(
          (u) =>
            u.id.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        )
        resolve(filtered)
      }, 300)
    })
  }
}

export const userService = new UserService()

import type { AccessControlUser } from '../../../types/Admin/accessControl'

class AccessControlService {
  // Mock data
  private mockUsers: AccessControlUser[] = [
    { id: '001', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Super Admin' },
    { id: '002', name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'Manager' },
    { id: '003', name: 'Emily Davis', email: 'emily.davis@company.com', role: 'User' },
    { id: '004', name: 'David Wilson', email: 'david.wilson@company.com', role: 'Manager' },
    { id: '005', name: 'Lisa Brown', email: 'lisa.brown@company.com', role: 'User' },
    { id: '006', name: 'James Martinez', email: 'james.martinez@company.com', role: 'Super Admin' },
    { id: '007', name: 'Jessica Taylor', email: 'jessica.taylor@company.com', role: 'Manager' },
    { id: '008', name: 'Robert Anderson', email: 'robert.anderson@company.com', role: 'User' },
    { id: '009', name: 'Amanda White', email: 'amanda.white@company.com', role: 'Manager' },
    { id: '010', name: 'Christopher Lee', email: 'christopher.lee@company.com', role: 'User' },
  ]

  /**
   * Get all users with access control
   * @returns Promise with array of users
   */
  async getAll(): Promise<AccessControlUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.mockUsers]), 500)
    })
  }

  /**
   * Search users by name or email
   * @param query - Search query
   * @returns Promise with filtered users
   */
  async searchUsers(query: string): Promise<AccessControlUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase()
        const filtered = this.mockUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery) ||
            u.role.toLowerCase().includes(lowerQuery)
        )
        resolve(filtered)
      }, 300)
    })
  }

  /**
   * Delete a user
   * @param userId - User ID to delete
   * @returns Promise with boolean success status
   */
  async deleteUser(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockUsers = this.mockUsers.filter((u) => u.id !== userId)
        resolve(true)
      }, 300)
    })
  }

  /**
   * Add a new user
   * @param user - User object to add
   * @returns Promise with created user
   */
  async addUser(user: AccessControlUser): Promise<AccessControlUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockUsers.push(user)
        resolve(user)
      }, 300)
    })
  }
}

export const accessControlService = new AccessControlService()

import type { AdminProfile, UpdateProfileData } from '../../../types/Admin/profile'

class AdminProfileService {
  // Mock admin profile data
  private mockProfile: AdminProfile = {
    id: 'admin-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Administration',
    role: 'Super Admin',
    avatar: '/avatars/sarah-chen.jpg',
    joinDate: '2022-01-15',
    lastLogin: '2024-12-08T10:30:00Z',
    status: 'active',
    bio: 'Experienced administrator with expertise in system management and team leadership.',
    address: '123 Business Street',
    city: 'New York',
    country: 'United States',
  }

  /**
   * Get admin profile
   * @returns Promise with admin profile
   */
  async getProfile(): Promise<AdminProfile> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.mockProfile }), 300)
    })
  }

  /**
   * Update admin profile
   * @param data - Updated profile data
   * @returns Promise with updated profile
   */
  async updateProfile(data: UpdateProfileData): Promise<AdminProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockProfile = {
          ...this.mockProfile,
          ...data,
        }
        resolve({ ...this.mockProfile })
      }, 500)
    })
  }

  /**
   * Update profile picture
   * @param file - Image file
   * @returns Promise with updated profile
   */
  async updateProfilePicture(file: File): Promise<AdminProfile> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        this.mockProfile.avatar = reader.result as string
        setTimeout(() => resolve({ ...this.mockProfile }), 500)
      }
      reader.readAsDataURL(file)
    })
  }

  /**
   * Change password
   * @param currentPassword - Current password
   * @param _newPassword - New password
   * @returns Promise with success status
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate current password (mock validation)
        if (currentPassword === 'oldPassword123' && newPassword.length >= 8) {
          resolve(true)
        } else {
          resolve(false)
        }
      }, 500)
    })
  }
}

export const adminProfileService = new AdminProfileService()

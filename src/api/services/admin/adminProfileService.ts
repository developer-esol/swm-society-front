import type { AdminProfile, UpdateProfileData } from '../../../types/Admin/profile'
import { rolesService } from './rolesService'

class AdminProfileService {
  /**
   * Get admin profile from current user data
   * @returns Promise with admin profile
   */
  async getProfile(): Promise<AdminProfile> {
    // Get current user data from localStorage
    const userId = localStorage.getItem('userId') || 'unknown';
    const userName = localStorage.getItem('userName') || 'Admin User';
    const userEmail = localStorage.getItem('userEmail') || 'admin@company.com';
    const userRole = localStorage.getItem('userRole') || '1';
    
    // Fetch role name from backend
    let roleName = 'User';
    try {
      const roles = await rolesService.getAll();
      const role = roles.find(r => String(r.id) === String(userRole));
      if (role) {
        roleName = role.name;
      }
    } catch (error) {
      console.error('[AdminProfileService] Error fetching role name:', error);
      // Fallback to basic mapping if API call fails
      const roleNames: { [key: string]: string } = {
        '1': 'User',
        '2': 'Moderator',
        '3': 'Admin',
      };
      roleName = roleNames[userRole] || 'User';
    }
    
    // Split full name into first and last name
    const nameParts = userName.split(' ');
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'User';
    
    const profile: AdminProfile = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      phone: localStorage.getItem('userPhone') || '',
      department: 'Administration',
      role: roleName,
      avatar: localStorage.getItem('userAvatar') || '',
      joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString(),
      status: 'active',
      bio: localStorage.getItem('userBio') || '',
      address: localStorage.getItem('userAddress') || '',
      city: localStorage.getItem('userCity') || '',
      country: localStorage.getItem('userCountry') || '',
    };
    
    return profile;
  }

  /**
   * Update admin profile
   * @param data - Updated profile data
   * @returns Promise with updated profile
   */
  async updateProfile(data: UpdateProfileData): Promise<AdminProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store updated data in localStorage
        if (data.firstName || data.lastName) {
          const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          localStorage.setItem('userName', fullName);
        }
        if (data.phone) localStorage.setItem('userPhone', data.phone);
        if (data.bio) localStorage.setItem('userBio', data.bio);
        if (data.address) localStorage.setItem('userAddress', data.address);
        if (data.city) localStorage.setItem('userCity', data.city);
        if (data.country) localStorage.setItem('userCountry', data.country);
        
        // Return updated profile
        this.getProfile().then(resolve);
      }, 500);
    });
  }

  /**
   * Update profile picture
   * @param file - Image file
   * @returns Promise with updated profile
   */
  async updateProfilePicture(file: File): Promise<AdminProfile> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const avatar = reader.result as string;
        localStorage.setItem('userAvatar', avatar);
        setTimeout(() => {
          this.getProfile().then(resolve);
        }, 500);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Change password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise with success status
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation - in real app, this would call the backend
        if (currentPassword.length >= 8 && newPassword.length >= 8) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }
}

export const adminProfileService = new AdminProfileService();

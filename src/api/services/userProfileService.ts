import type { UserProfile, UpdateUserProfileData } from '../../types/profile'

class UserProfileService {
  /**
   * Get user profile from current user data
   * @returns Promise with user profile
   */
  async getProfile(): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get current user data from localStorage
        const userId = localStorage.getItem('userId') || 'unknown';
        const userName = localStorage.getItem('userName') || 'User';
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        
        // Split full name into first and last name
        const nameParts = userName.split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const profile: UserProfile = {
          id: userId,
          firstName: firstName,
          lastName: lastName,
          email: userEmail,
          phone: localStorage.getItem('userPhone') || '',
          avatar: localStorage.getItem('userAvatar') || '',
          joinDate: localStorage.getItem('userJoinDate') || new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString(),
          bio: localStorage.getItem('userBio') || '',
          address: localStorage.getItem('userAddress') || '',
          city: localStorage.getItem('userCity') || '',
          country: localStorage.getItem('userCountry') || '',
          postalCode: localStorage.getItem('userPostalCode') || '',
        };
        
        resolve(profile);
      }, 300);
    });
  }

  /**
   * Update user profile
   * @param data - Updated profile data
   * @returns Promise with updated profile
   */
  async updateProfile(data: UpdateUserProfileData): Promise<UserProfile> {
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
        if (data.postalCode) localStorage.setItem('userPostalCode', data.postalCode);
        
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
  async updateProfilePicture(file: File): Promise<UserProfile> {
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

export const userProfileService = new UserProfileService();

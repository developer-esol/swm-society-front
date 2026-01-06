import { authApiClient } from '../apiClient'
import type { Permission } from '../../types/Admin/roles'

class UserPermissionsService {
  /**
   * Get permissions for the logged-in user's role
   * Uses the existing /api/admin/roles/{roleId} endpoint
   */
  async getMyPermissions(): Promise<Permission[]> {
    try {
      // Get the current user's role ID from localStorage
      const userRoleId = localStorage.getItem('userRole');
      
      if (!userRoleId) {
        console.warn('[UserPermissionsService] No role ID found in localStorage');
        return [];
      }
      
      const endpoint = `/api/admin/roles/${userRoleId}`;
      console.log('[UserPermissionsService] Fetching role with permissions from', endpoint);
      
      const response = await authApiClient.get<any>(endpoint);
      console.log('[UserPermissionsService] Raw response:', response);
      
      // Extract permissions from the role object
      let permissions: Permission[] = [];
      
      if (response && typeof response === 'object') {
        // Check if response has data.permissions
        if (response.data && Array.isArray(response.data.permissions)) {
          permissions = response.data.permissions;
        } 
        // Check if response.permissions exists
        else if (Array.isArray(response.permissions)) {
          permissions = response.permissions;
        }
        // Check if response is wrapped in data
        else if (response.data && typeof response.data === 'object' && response.data.data) {
          const roleData = response.data.data;
          permissions = Array.isArray(roleData.permissions) ? roleData.permissions : [];
        }
      }
      
      console.log('[UserPermissionsService] ✅ Fetched', permissions.length, 'permissions');
      if (permissions.length > 0) {
        console.log('[UserPermissionsService] Permissions:', permissions.map(p => p.name).join(', '));
      }
      
      return permissions;
    } catch (error) {
      console.error('[UserPermissionsService] ❌ Error fetching user permissions:', error);
      console.warn('[UserPermissionsService] Returning empty permissions array due to error');
      return [];
    }
  }
}

export const userPermissionsService = new UserPermissionsService()

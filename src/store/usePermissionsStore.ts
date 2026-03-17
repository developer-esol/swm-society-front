import { create } from 'zustand';
import type { PermissionName } from '../configs/permissions';

export interface Permission {
  id: number;
  name: string;
  description?: string;
  resource?: string;
  action?: string;
}

interface PermissionsState {
  userPermissions: Permission[];
  
  // Actions
  setUserPermissions: (permissions: Permission[]) => void;
  clearPermissions: () => void;
  hasPermission: (permissionName: PermissionName) => boolean;
  hasAnyPermission: (permissionNames: PermissionName[]) => boolean;
  hasAllPermissions: (permissionNames: PermissionName[]) => boolean;
}

const PERMISSIONS_STORAGE_KEY = 'user_permissions';

// Load permissions from localStorage on initialization
const loadPersistedPermissions = (): Permission[] => {
  try {
    const stored = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    console.log('[PermissionsStore] 🔍 Checking localStorage for permissions...');
    console.log('[PermissionsStore] Raw stored data:', stored);
    if (stored) {
      const permissions = JSON.parse(stored);
      console.log('[PermissionsStore] 📦 Loaded', permissions.length, 'permissions from localStorage');
      console.log('[PermissionsStore] Permission names:', permissions.map((p: Permission) => p.name).join(', '));
      return permissions;
    }
    console.log('[PermissionsStore] ⚠️ No permissions found in localStorage');
  } catch (error) {
    console.error('[PermissionsStore] ❌ Failed to load persisted permissions:', error);
  }
  return [];
};

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  userPermissions: loadPersistedPermissions(),
  
  setUserPermissions: (permissions: Permission[]) => {
    console.log('[PermissionsStore] Setting user permissions:', permissions.length, 'permissions');
    set({ userPermissions: permissions });
    
    // Persist to localStorage
    try {
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissions));
      console.log('[PermissionsStore] 💾 Saved permissions to localStorage');
    } catch (error) {
      console.error('[PermissionsStore] ❌ Failed to persist permissions:', error);
    }
  },
  
  clearPermissions: () => {
    console.log('[PermissionsStore] Clearing permissions');
    set({ userPermissions: [] });
    
    // Clear from localStorage
    try {
      localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
      console.log('[PermissionsStore] 🗑️ Cleared permissions from localStorage');
    } catch (error) {
      console.error('[PermissionsStore] ❌ Failed to clear persisted permissions:', error);
    }
  },
  
  hasPermission: (permissionName: PermissionName): boolean => {
    const { userPermissions } = get();
    const has = userPermissions.some(p => p.name === permissionName);
    if (!has) {
      console.log(`[PermissionsStore] ❌ Missing permission "${permissionName}" - Have ${userPermissions.length} permissions:`, userPermissions.map(p => p.name));
    }
    return has;
  },
  
  hasAnyPermission: (permissionNames: PermissionName[]): boolean => {
    const { userPermissions } = get();
    const has = permissionNames.some(name => 
      userPermissions.some(p => p.name === name)
    );
    console.log(`[PermissionsStore] Check any permission`, permissionNames, ':', has);
    return has;
  },
  
  hasAllPermissions: (permissionNames: PermissionName[]): boolean => {
    const { userPermissions } = get();
    const has = permissionNames.every(name => 
      userPermissions.some(p => p.name === name)
    );
    console.log(`[PermissionsStore] Check all permissions`, permissionNames, ':', has);
    return has;
  },
}));

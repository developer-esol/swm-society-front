import React from 'react';
import { usePermissionsStore } from '../store/usePermissionsStore';
import { useAuthStore } from '../store/useAuthStore';
import type { PermissionName } from '../configs/permissions';

interface PermissionProps {
  /**
   * The permission(s) required to render children
   */
  permission?: PermissionName | PermissionName[];
  
  /**
   * If true, user must have ALL specified permissions (AND logic)
   * If false, user needs ANY of the specified permissions (OR logic)
   * Default: false (OR logic)
   */
  requireAll?: boolean;
  
  /**
   * The content to render if user has permission
   */
  children: React.ReactNode;
  
  /**
   * Optional fallback to render if user doesn't have permission
   */
  fallback?: React.ReactNode;
}

/**
 * Permission Component
 * 
 * Conditionally renders children based on user permissions.
 * Admin users (role === '3') always see all content.
 * 
 * @example
 * // Single permission
 * <Permission permission="CREATE_PRODUCTS">
 *   <Button>Create Product</Button>
 * </Permission>
 * 
 * @example
 * // Multiple permissions (OR logic - user needs ANY)
 * <Permission permission={["UPDATE_PRODUCTS", "DELETE_PRODUCTS"]}>
 *   <Button>Edit Product</Button>
 * </Permission>
 * 
 * @example
 * // Multiple permissions (AND logic - user needs ALL)
 * <Permission permission={["VIEW_PRODUCTS", "UPDATE_PRODUCTS"]} requireAll>
 *   <Button>Advanced Edit</Button>
 * </Permission>
 */
export const Permission: React.FC<PermissionProps> = ({ 
  permission, 
  requireAll = false, 
  children,
  fallback = null 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, userPermissions } = usePermissionsStore();
  const { user } = useAuthStore();
  
  // Admin (role === '3') always has all permissions
  const isAdmin = user?.role === '3';
  
  console.log('[Permission Component]', {
    permission,
    userRole: user?.role,
    isAdmin,
    totalPermissions: userPermissions.length,
    permissionsList: userPermissions.map(p => p.name).slice(0, 5)
  });
  
  if (isAdmin) {
    console.log('[Permission] ✅ Admin bypass - rendering children');
    return <>{children}</>;
  }
  
  // If no permission specified, render children
  if (!permission) {
    console.log('[Permission] ✅ No permission required - rendering children');
    return <>{children}</>;
  }
  
  // Check permissions
  let hasAccess = false;
  
  if (typeof permission === 'string') {
    hasAccess = hasPermission(permission);
    
    // Extra debugging for CREATE permissions
    if (permission.startsWith('CREATE_')) {
      console.log(`[Permission] 🔍 CREATE Permission Check:`, {
        permission,
        hasAccess,
        userRole: user?.role,
        isAdmin,
        totalPermissions: userPermissions.length,
        allPermissionNames: userPermissions.map(p => p.name)
      });
    } else {
      console.log(`[Permission] Check "${permission}": ${hasAccess}`);
    }
  } else if (Array.isArray(permission)) {
    hasAccess = requireAll 
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
    console.log(`[Permission] Check ${requireAll ? 'ALL' : 'ANY'} of [${permission.join(', ')}]: ${hasAccess}`);
  }
  
  if (!hasAccess) {
    console.log('[Permission] ❌ Access denied - hiding content');
  } else {
    console.log('[Permission] ✅ Access granted - showing content');
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

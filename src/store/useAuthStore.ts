import { create } from 'zustand';
import { authService } from '../api/services/authService';
import { usePermissionsStore } from './usePermissionsStore';
import { userPermissionsService } from '../api/services/userPermissionsService';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      console.log('[AuthStore] Attempting login for:', email);

      const response = await authService.login({ email, password });
      
      // Store credentials (this also clears old cache)
      authService.storeUserCredentials(response);

      // Update state from backend response (response.data.user)
      const user = response.data?.user;
      const newUser = {
        id: user?.id ? user.id.toString() : '',
        email: user?.email || '',
        name: user?.fullName || '',
        role: user?.role?.id ? user.role.id.toString() : '1',
      };
      
      set({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[AuthStore] ✅ Login successful! Current user:', newUser);
      
      // Extract permissions from login response (user.role.permissions)
      try {
        console.log('[AuthStore] ========================================');
        console.log('[AuthStore] Loading permissions from login response');
        console.log('[AuthStore] User role:', user?.role);
        
        const permissions = user?.role?.permissions;
        
        if (permissions && Array.isArray(permissions) && permissions.length > 0) {
          const { setUserPermissions } = usePermissionsStore.getState();
          setUserPermissions(permissions);
          console.log('[AuthStore] ✅ Loaded', permissions.length, 'permissions from login response');
          console.log('[AuthStore] Permissions:', permissions.map((p: any) => p.name).join(', '));
        } else {
          console.warn('[AuthStore] ⚠️ No permissions found in login response');
          console.log('[AuthStore] Attempting to fetch from API as fallback...');
          
          // Fallback: Try to fetch from API
          const fetchedPermissions = await userPermissionsService.getMyPermissions();
          if (fetchedPermissions && fetchedPermissions.length > 0) {
            const { setUserPermissions } = usePermissionsStore.getState();
            setUserPermissions(fetchedPermissions);
            console.log('[AuthStore] ✅ Loaded', fetchedPermissions.length, 'permissions from API');
          } else {
            console.warn('[AuthStore] ⚠️ No permissions available from any source');
          }
        }
        console.log('[AuthStore] ========================================');
      } catch (permError) {
        console.error('[AuthStore] ❌ Failed to load permissions:', permError);
        console.log('[AuthStore] ========================================');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      console.error('[AuthStore] ❌ Login failed:', errorMessage);
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw error; // Re-throw so the component can handle it
    }
  },

  logout: () => {
    console.log('AuthStore: Logging out user');
    
    // Clear permissions FIRST before clearing auth
    const { clearPermissions } = usePermissionsStore.getState();
    clearPermissions();
    
    authService.logout();
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  initializeAuth: async () => {
    console.log('[AuthStore] ========================================');
    console.log('[AuthStore] Checking user session...');
    
    const isAuth = authService.isAuthenticated();
    
    if (isAuth) {
      const currentUser = authService.getCurrentUser();
      
      console.log('[AuthStore] ✅ USER IS LOGGED IN:');
      console.log('  → User ID:', currentUser.id);
      console.log('  → User Name:', currentUser.name);
      console.log('  → User Email:', currentUser.email);
      console.log('  → User Role:', currentUser.role);
      console.log('[AuthStore] ========================================');
      
      if (currentUser.id && currentUser.email) {
        set({
          user: {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name || '',
            role: currentUser.role || '',
          },
          isAuthenticated: true,
        });
        
        console.log('[AuthStore] Auth state updated with user data');
        
        // Check if permissions are already loaded from localStorage
        const { userPermissions } = usePermissionsStore.getState();
        if (userPermissions && userPermissions.length > 0) {
          console.log('[AuthStore] ✅ Permissions already loaded from localStorage:', userPermissions.length);
        } else {
          // Try to fetch from API only if not in localStorage
          try {
            console.log('[AuthStore] Loading permissions from API after page refresh...');
            const fetchedPermissions = await userPermissionsService.getMyPermissions();
            if (fetchedPermissions && fetchedPermissions.length > 0) {
              const { setUserPermissions } = usePermissionsStore.getState();
              setUserPermissions(fetchedPermissions);
              console.log('[AuthStore] ✅ Reloaded', fetchedPermissions.length, 'permissions from API');
            } else {
              console.warn('[AuthStore] ⚠️ No permissions available after refresh');
            }
          } catch (permError) {
            console.error('[AuthStore] ❌ Failed to reload permissions from API:', permError);
            console.log('[AuthStore] This is expected for moderators until backend is updated');
          }
        }
      } else {
        // Token exists but user data is missing, clear everything
        console.log('[AuthStore] ⚠️ Invalid stored credentials, clearing session');
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    } else {
      console.log('[AuthStore] ❌ No active session found');
      console.log('[AuthStore] ========================================');
      set({
        user: null,
        isAuthenticated: false,
      });
      
      console.log('AuthStore: No stored credentials found');
    }
  },
}));

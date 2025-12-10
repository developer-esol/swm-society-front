import { create } from 'zustand';
import { authService } from '../api/services/authService';

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
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      console.log('AuthStore: Attempting login for:', email);

      const response = await authService.login({ email, password });
      
      // Store credentials
      authService.storeUserCredentials(response);

      // Update state
      set({
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.roleId,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('AuthStore: Login successful');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      console.error('AuthStore: Login failed:', errorMessage);
      
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

  initializeAuth: () => {
    console.log('AuthStore: Initializing authentication state');
    
    const isAuth = authService.isAuthenticated();
    
    if (isAuth) {
      const currentUser = authService.getCurrentUser();
      
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
        
        console.log('AuthStore: User restored from storage:', currentUser.email);
      } else {
        // Token exists but user data is missing, clear everything
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
        });
        
        console.log('AuthStore: Invalid stored credentials, cleared');
      }
    } else {
      set({
        user: null,
        isAuthenticated: false,
      });
      
      console.log('AuthStore: No stored credentials found');
    }
  },
}));

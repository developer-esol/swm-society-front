import { apiClient } from '../apiClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
    user?: {
      id?: number;
      email?: string;
      fullName?: string;
      role?: {
        id?: number;
        name?: string;
      };
    };
  };
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    console.log('Attempting login with:', { email: data.email });
    
    // Clear cart and wishlist cache BEFORE login to prevent showing previous user's data
    localStorage.removeItem('swm_cart');
    localStorage.removeItem('swm_wishlist');
    localStorage.removeItem('lastServerCartRaw');
    
    const AUTH_BASE = import.meta.env.VITE_AUTH_BASE || 'http://localhost:8080';

    const response = await apiClient.post<LoginResponse>(`${AUTH_BASE.replace(/\/$/, '')}/api/auth/login`, data);
    
    console.log('[AuthService] ===== LOGIN RESPONSE =====');
    console.log('[AuthService] Full Response:', response);
    console.log('[AuthService] Access Token:', response.data?.accessToken);
    console.log('[AuthService] User Data:', response.data?.user);
    console.log('[AuthService] User ID:', response.data?.user?.id);
    console.log('[AuthService] User Email:', response.data?.user?.email);
    console.log('[AuthService] User Name:', response.data?.user?.fullName);
    console.log('[AuthService] ============================');
    
    return response;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    console.log('Attempting registration with:', { fullName: data.fullName, email: data.email });
    const AUTH_BASE = import.meta.env.VITE_AUTH_BASE || 'http://localhost:8080';

    const response = await apiClient.post<RegisterResponse>(`${AUTH_BASE.replace(/\/$/, '')}/api/auth/register`, data);
    console.log('Registration successful:', response);
    return response;
  },

  logout: () => {
    // Clear all stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    // Clear cached wishlist and cart data
    localStorage.removeItem('swm_wishlist');
    localStorage.removeItem('swm_cart');
    console.log('User logged out, credentials and cached data cleared');
  },

  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const isAuth = !!token;
    console.log('Authentication check:', isAuth);
    return isAuth;
  },

  getCurrentUser: () => {
    return {
      id: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
    };
  },

  storeUserCredentials: (response: LoginResponse) => {
    console.log('[AuthService] ===== STORING USER CREDENTIALS =====');
    console.log('[AuthService] Full login response data:', response.data);
    
    // Clear any cached wishlist/cart data from previous sessions
    localStorage.removeItem('swm_wishlist');
    localStorage.removeItem('swm_cart');
    console.log('[AuthService] Cleared previous user cache');

    // Store authentication token and user data for API operations
    const token = response.data?.accessToken || response.data?.token || '';
    const userId = response.data?.user?.id ? response.data.user.id.toString() : '';
    const email = response.data?.user?.email || '';
    const fullName = response.data?.user?.fullName || '';
    const roleId = response.data?.user?.role?.id ? response.data.user.role.id.toString() : '1';

    console.log('[AuthService] Extracted values:');
    console.log('  - Token:', token ? `${token.substring(0, 30)}... (${token.length} chars)` : 'MISSING!');
    console.log('  - UserId:', userId, '(Type:', typeof userId, ')');
    console.log('  - Email:', email);
    console.log('  - Name:', fullName);
    console.log('  - RoleId:', roleId);

    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userRole', roleId);

    console.log('[AuthService] ✅ Credentials stored in localStorage');
    console.log('[AuthService] ====================================');
  },
};

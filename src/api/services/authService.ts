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
    const AUTH_BASE = import.meta.env.VITE_AUTH_BASE || 'http://localhost:8080';

    const response = await apiClient.post<LoginResponse>(`${AUTH_BASE.replace(/\/$/, '')}/api/auth/login`, data);
    console.log('Login successful:', response);
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
    console.log('User logged out, credentials cleared');
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
    // Store authentication token and user data for API operations
    const token = response.data?.accessToken || response.data?.token || '';
    const userId = response.data?.user?.id ? response.data.user.id.toString() : '';
    const email = response.data?.user?.email || '';
    const fullName = response.data?.user?.fullName || '';
    const roleId = response.data?.user?.role?.id ? response.data.user.role.id.toString() : '1';

    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userRole', roleId);

    console.log('User credentials stored:', {
      userId,
      email,
      name: fullName,
      roleId
    });
  },
};

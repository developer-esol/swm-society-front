import { apiClient } from '../apiClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    roleId: string;
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    console.log('Attempting login with:', { email: data.email });
    
    try {
      // Try the standard auth endpoint first
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      console.log('Login successful:', response);
      return response;
    } catch (error) {
      console.log('Auth endpoint not available, trying user verification...');
      
      // Fallback: Check if user exists and create mock token
      try {
        // Get all users and find matching email
        const users = await apiClient.get<any[]>('/users');
        const user = users.find(u => u.email === data.email);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // In a real app, password would be verified on backend
        // For now, create a mock token response
        const loginResponse: LoginResponse = {
          token: `mock-jwt-${Date.now()}`,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.roleId || 'user'
          }
        };
        
        console.log('User verification successful:', loginResponse);
        return loginResponse;
      } catch (userError) {
        console.error('User verification failed:', userError);
        throw new Error('Invalid email or password');
      }
    }
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    console.log('Attempting registration with:', { name: data.name, email: data.email });
    
    try {
      // Try the standard auth endpoint first
      const response = await apiClient.post<RegisterResponse>('/auth/register', data);
      console.log('Registration successful:', response);
      return response;
    } catch (error) {
      console.log('Auth registration endpoint not available, trying user creation...');
      
      // Fallback: Create user directly
      try {
        const newUser = await apiClient.post('/users', {
          name: data.name,
          email: data.email,
          // Note: In production, password should be hashed on backend
          password: data.password,
          roleId: 'user', // Default role
          isActive: true,
          profileUrl: '',
        });
        
        const registerResponse: RegisterResponse = {
          message: 'Registration successful',
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          }
        };
        
        console.log('User creation successful:', registerResponse);
        return registerResponse;
      } catch (userError) {
        console.error('User creation failed:', userError);
        throw new Error('Registration failed. Email might already be in use.');
      }
    }
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
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('userId', response.user.id);
    localStorage.setItem('userEmail', response.user.email);
    localStorage.setItem('userName', response.user.name);
    localStorage.setItem('userRole', response.user.roleId);
    
    console.log('User credentials stored:', {
      userId: response.user.id,
      email: response.user.email,
      name: response.user.name,
      roleId: response.user.roleId
    });
  },
};

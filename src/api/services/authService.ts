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
    fullName: string;
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

interface MockUser {
  id: string;
  email: string;
  fullName: string;
  password: string;
}

// Mock database stored in localStorage (for development without backend)
const getMockUsers = (): MockUser[] => {
  const stored = localStorage.getItem('mock_users');
  return stored ? JSON.parse(stored) : [];
};

const saveMockUser = (user: MockUser): void => {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem('mock_users', JSON.stringify(users));
};

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      // Try to call backend API
      return await apiClient.post<LoginResponse>('/auth/login', data);
    } catch {
      // Fallback to mock authentication if backend is not available
      console.warn('Backend not available, using mock authentication');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check mock database
      const users = getMockUsers();
      const user = users.find((u: MockUser) => u.email === data.email);

      if (!user || user.password !== data.password) {
        throw new Error('Invalid email or password');
      }

      // Return mock response
      return {
        token: 'mock-jwt-' + Date.now(),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      };
    }
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      // Try to call backend API
      return await apiClient.post<RegisterResponse>('/auth/register', data);
    } catch {
      // Fallback to mock registration if backend is not available
      console.warn('Backend not available, using mock registration');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user already exists
      const users = getMockUsers();
      if (users.find((u: MockUser) => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser: MockUser = {
        id: 'user-' + Date.now(),
        email: data.email,
        fullName: data.fullName,
        password: data.password, // ⚠️ In production, this should be hashed on backend!
      };

      saveMockUser(newUser);

      return {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
        },
      };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  },

  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

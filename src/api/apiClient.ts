const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE || 'http://localhost:8080';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      console.log('[ApiClient] Refreshing access token...');
      
      const response = await fetch(`${AUTH_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      // Store new tokens
      if (data.data?.accessToken) {
        localStorage.setItem('authToken', data.data.accessToken);
      }
      if (data.data?.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      console.log('[ApiClient] ✅ Token refreshed successfully');
      return data.data.accessToken;
    } catch (error) {
      console.error('[ApiClient] ❌ Token refresh failed:', error);
      // Clear tokens and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<T> {
    // If endpoint is an absolute URL (starts with http), use it directly;
    // otherwise build with the configured base URL.
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    // Get auth token if available
    const token = this.getAuthToken();
    
    if (token) {
      console.log('[ApiClient] Request to', endpoint, 'with Authorization token');
    } else {
      console.log('[ApiClient] Request to', endpoint, 'WITHOUT token');
    }
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Remove undefined headers (like Content-Type for FormData)
    if (config.headers) {
      const headers = config.headers as Record<string, any>;
      Object.keys(headers).forEach(key => {
        if (headers[key] === undefined) {
          delete headers[key];
        }
      });
    }

    const response = await fetch(url, config);

    // Handle 401 Unauthorized - token expired
    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/')) {
      console.log('[ApiClient] 401 Unauthorized - attempting token refresh');
      
      try {
        // Use shared refresh promise to prevent multiple simultaneous refresh requests
        if (this.isRefreshing && this.refreshPromise) {
          await this.refreshPromise;
        } else {
          this.isRefreshing = true;
          this.refreshPromise = this.refreshAccessToken();
          await this.refreshPromise;
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
        
        // Retry the original request with new token
        return this.request<T>(endpoint, options, true);
      } catch (refreshError) {
        console.error('[ApiClient] Failed to refresh token, logging out');
        throw refreshError;
      }
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let body: any = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { message: text };
      }

      const errorMsg = body.message || body.error || `API Error: ${response.status} ${response.statusText}`;
      console.error('API Error:', { status: response.status, url, body });
      
      const err: any = new Error(errorMsg);
      err.status = response.status;
      err.statusText = response.statusText;
      err.body = body;
      throw err;
    }

    const json = await response.json().catch(() => ({}));
    return json as T;
  }

  private getAuthToken(): string | null {
    // Get token from localStorage using the correct key
    return localStorage.getItem('authToken');
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    // Check if data is FormData (for file uploads)
    const isFormData = data instanceof FormData;
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      ...(isFormData && {
        headers: {
          // Remove Content-Type header for FormData - browser will set it with boundary
          'Content-Type': undefined as any,
        },
      }),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export const authApiClient = new ApiClient(AUTH_BASE_URL);
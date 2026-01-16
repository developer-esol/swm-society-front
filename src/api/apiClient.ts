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

  private isTokenExpired(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('[ApiClient] No auth token found');
      return false; // No token means user is not logged in, don't try to refresh
    }

    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('[ApiClient] Invalid token format');
        return true;
      }

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token has expiration time
      if (!payload.exp) {
        console.log('[ApiClient] Token has no expiration');
        return false;
      }

      // Check if token is expired or will expire in the next 2 minutes (120 seconds)
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = 120; // 2 minutes buffer - refresh proactively
      const isExpired = payload.exp < (currentTime + bufferTime);
      
      if (isExpired) {
        const expiresIn = payload.exp - currentTime;
        console.log(`[ApiClient] ⏰ Token expired or expiring in ${expiresIn} seconds (${Math.floor(expiresIn / 60)} minutes)`);
      }
      
      return isExpired;
    } catch (error) {
      console.error('[ApiClient] Error checking token expiration:', error);
      return true; // Treat invalid tokens as expired
    }
  }

  private isRefreshTokenValid(): boolean {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('[ApiClient] No refresh token found');
      return false;
    }

    try {
      // Decode refresh token to check its expiration
      const parts = refreshToken.split('.');
      if (parts.length !== 3) {
        console.warn('[ApiClient] Invalid refresh token format');
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.exp) {
        console.log('[ApiClient] Refresh token has no expiration');
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const isValid = payload.exp > currentTime;
      
      if (!isValid) {
        console.error('[ApiClient] ❌ Refresh token is expired!');
      } else {
        const expiresIn = payload.exp - currentTime;
        console.log(`[ApiClient] ✅ Refresh token valid for ${Math.floor(expiresIn / 3600)} hours`);
      }
      
      return isValid;
    } catch (error) {
      console.error('[ApiClient] Error checking refresh token expiration:', error);
      return false;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.error('[ApiClient] ❌ No refresh token available');
      throw new Error('No refresh token available');
    }

    // Check if refresh token itself is valid before making the request
    if (!this.isRefreshTokenValid()) {
      console.error('[ApiClient] ❌ Refresh token is expired - cannot refresh');
      // Clear everything and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      console.log('[ApiClient] Redirecting to login page due to expired refresh token...');
      window.location.href = '/login';
      throw new Error('Refresh token expired');
    }

    try {
      console.log('[ApiClient] 🔄 Refreshing access token...');
      console.log('[ApiClient] Old refresh token (first 20 chars):', refreshToken.substring(0, 20) + '...');
      
      const response = await fetch(`${AUTH_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('[ApiClient] Refresh response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ApiClient] ❌ Refresh failed with status:', response.status, errorText);
        
        // Only clear and redirect if it's a 401/403 (token invalid) or 404 (endpoint issue)
        if (response.status === 401 || response.status === 403) {
          console.error('[ApiClient] ❌ Refresh token rejected by server - logging out');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
          console.log('[ApiClient] Redirecting to login page...');
          window.location.href = '/login';
        }
        
        throw new Error(`Failed to refresh token: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[ApiClient] Refresh response data structure:', {
        hasData: !!data.data,
        hasAccessToken: !!data.data?.accessToken,
        hasRefreshToken: !!data.data?.refreshToken,
        topLevelKeys: Object.keys(data)
      });
      
      // Handle different response structures
      const tokenData = data.data || data;
      
      // Store OLD tokens for comparison
      const oldAccessToken = localStorage.getItem('authToken');
      const oldRefreshToken = localStorage.getItem('refreshToken');
      
      // Store new tokens
      if (tokenData.accessToken) {
        localStorage.setItem('authToken', tokenData.accessToken);
        console.log('[ApiClient] ✅ New access token stored (first 30 chars):', tokenData.accessToken.substring(0, 30) + '...');
        console.log('[ApiClient] 🔄 Token changed:', oldAccessToken?.substring(0, 20) !== tokenData.accessToken.substring(0, 20) ? 'YES ✅' : 'NO ❌');
      } else {
        console.error('[ApiClient] ❌ No access token in response!');
        throw new Error('No access token in refresh response');
      }
      
      if (tokenData.refreshToken) {
        localStorage.setItem('refreshToken', tokenData.refreshToken);
        console.log('[ApiClient] ✅ New refresh token stored (first 20 chars):', tokenData.refreshToken.substring(0, 20) + '...');
        console.log('[ApiClient] 🔄 Refresh token changed:', oldRefreshToken?.substring(0, 20) !== tokenData.refreshToken.substring(0, 20) ? 'YES ✅' : 'NO ❌');
      } else {
        console.warn('[ApiClient] ⚠️ No new refresh token provided, keeping existing one');
      }

      console.log('[ApiClient] ✅ Token refresh completed successfully');
      console.log('[ApiClient] 🔐 Verification: Token from localStorage now (first 30 chars):', localStorage.getItem('authToken')?.substring(0, 30) + '...');
      return tokenData.accessToken;
    } catch (error) {
      console.error('[ApiClient] ❌ Token refresh failed with error:', error);
      // Don't automatically redirect here if it's a network error
      // Only redirect was already handled above for 401/403
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<T> {
    // Proactively refresh token if it's expired or about to expire (except for auth endpoints)
    const isAuthEndpoint = endpoint.includes('/auth/login') || 
                          endpoint.includes('/auth/register') || 
                          endpoint.includes('/auth/refresh') ||
                          endpoint.includes('/auth/password-reset') || // Exclude password reset endpoints
                          endpoint.includes('/password-reset'); // Also check without /auth prefix
    
    if (!isRetry && !isAuthEndpoint) {
      const hasAuthToken = !!localStorage.getItem('authToken');
      const hasRefreshToken = !!localStorage.getItem('refreshToken');
      
      // Only check expiration if user has tokens (is logged in)
      if (hasAuthToken && hasRefreshToken) {
        // First check if refresh token is valid
        if (!this.isRefreshTokenValid()) {
          console.error('[ApiClient] ❌ Refresh token expired - user must login again');
          localStorage.clear();
          window.location.href = '/login';
          throw new Error('Refresh token expired - please login again');
        }
        
        // Then check if access token needs refresh
        if (this.isTokenExpired()) {
          console.log('[ApiClient] 🔄 Token expired or expiring soon - refreshing proactively before request...');
          const oldToken = localStorage.getItem('authToken');
          console.log('[ApiClient] 📋 Old access token (first 30 chars):', oldToken?.substring(0, 30) + '...');
          
          try {
            // Use shared refresh promise to prevent multiple simultaneous refresh requests
            if (this.isRefreshing && this.refreshPromise) {
              console.log('[ApiClient] ⏳ Waiting for existing refresh operation...');
              await this.refreshPromise;
            } else {
              this.isRefreshing = true;
              this.refreshPromise = this.refreshAccessToken();
              const newToken = await this.refreshPromise;
              this.isRefreshing = false;
              this.refreshPromise = null;
              console.log('[ApiClient] ✅ Proactive token refresh successful');
              console.log('[ApiClient] 📋 New access token received (first 30 chars):', newToken.substring(0, 30) + '...');
              console.log('[ApiClient] 🔐 Token in localStorage now (first 30 chars):', localStorage.getItem('authToken')?.substring(0, 30) + '...');
              console.log('[ApiClient] ✅ Tokens match:', newToken === localStorage.getItem('authToken') ? 'YES ✅' : 'NO ❌');
            }
          } catch (refreshError: any) {
            console.error('[ApiClient] ❌ Proactive token refresh failed:', refreshError);
            this.isRefreshing = false;
            this.refreshPromise = null;
            
            // Only stop the request if refresh token is actually expired
            // If it's a network error, let the request proceed and it will fail naturally
            if (refreshError.message?.includes('Refresh token expired') || 
                refreshError.message?.includes('No refresh token')) {
              throw refreshError;
            }
            
            // For other errors, log but continue with the request
            console.warn('[ApiClient] ⚠️ Continuing with request despite refresh failure');
          }
        }
      }
    }

    // If endpoint is an absolute URL (starts with http), use it directly;
    // otherwise build with the configured base URL.
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    // Get auth token if available (this will get the NEW token after refresh)
    const token = this.getAuthToken();
    
    if (token) {
      console.log('[ApiClient] 📤 Making request to', endpoint);
      console.log('[ApiClient] 🔑 Using access token (first 30 chars):', token.substring(0, 30) + '...');
    } else {
      console.log('[ApiClient] 📤 Request to', endpoint, 'WITHOUT token');
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
    // Don't retry for password reset endpoints as they don't use regular auth tokens
    if (response.status === 401 && !isRetry && !isAuthEndpoint) {
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
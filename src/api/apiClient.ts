const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token if available
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let body: any = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { message: text };
      }

      const err: any = new Error(body.message || `API Error: ${response.status} ${response.statusText}`);
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
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
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
import { API_BASE_URL } from '../../constants/config';

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export const httpClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isAbsolute = endpoint.startsWith('http');
    let finalEndpoint = endpoint;

    if (!isAbsolute) {
      const isAuthRequest = endpoint.startsWith('/api/auth') || endpoint.startsWith('api/auth');
      const hasApiPrefix = endpoint.startsWith('/api/') || endpoint.startsWith('api/');

      if (!isAuthRequest && !hasApiPrefix) {
        finalEndpoint = `/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      }
    }

    const url = isAbsolute
      ? endpoint
      : `${API_BASE_URL}${finalEndpoint.startsWith('/') ? '' : '/'}${finalEndpoint}`;

    const token = localStorage.getItem('timee_pms_jwt_token');

    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !url.includes('/api/auth/login')) {
        localStorage.removeItem('timee_pms_jwt_token');
        localStorage.removeItem('timee_pms_auth_user');
        window.location.href = '/login';
        throw new Error('Session expired or unauthorized. Redirecting to login.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[HTTP Client Error] ${options.method || 'GET'} ${url}:`, error);
      throw error;
    }
  },

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  async getBlob(endpoint: string, options: RequestInit = {}): Promise<Blob> {
    const isAbsolute = endpoint.startsWith('http');
    let finalEndpoint = endpoint;

    if (!isAbsolute) {
      const isAuthRequest = endpoint.startsWith('/api/auth') || endpoint.startsWith('api/auth');
      const hasApiPrefix = endpoint.startsWith('/api/') || endpoint.startsWith('api/');

      if (!isAuthRequest && !hasApiPrefix) {
        finalEndpoint = `/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      }
    }

    const url = isAbsolute
      ? endpoint
      : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173'}${finalEndpoint.startsWith('/') ? '' : '/'}${finalEndpoint}`;

    const token = localStorage.getItem('timee_pms_jwt_token');

    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem('timee_pms_jwt_token');
      localStorage.removeItem('timee_pms_auth_user');
      window.location.href = '/login';
      throw new Error('Session expired or unauthorized. Redirecting to login.');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.blob();
  },
};

const BASE_URL = process.env.CONTROLHUB_URL || 'https://app.muuktest.com:8080';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions {
  method: HttpMethod;
  endpoint: string;
  token: string;
  body?: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Makes an API request to the ControlHub backend
 * @param options - The request options including method, endpoint, token, and optional body
 * @returns The API response with success flag and data/error
 */
export async function apiRequest<T = any>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
  const { method, endpoint, token, body } = options;
  
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      return {
        success: false,
        error: responseData.data || responseData.message || 'Request failed',
      };
    }

    return {
      success: true,
      data: responseData.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, token: string) => 
    apiRequest<T>({ method: 'GET', endpoint, token }),
  
  post: <T = any>(endpoint: string, token: string, body?: any) => 
    apiRequest<T>({ method: 'POST', endpoint, token, body }),
  
  put: <T = any>(endpoint: string, token: string, body?: any) => 
    apiRequest<T>({ method: 'PUT', endpoint, token, body }),
  
  delete: <T = any>(endpoint: string, token: string) => 
    apiRequest<T>({ method: 'DELETE', endpoint, token }),
};

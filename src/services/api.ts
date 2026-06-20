import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://checkclip-be-service.onrender.com';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { 
          _retry?: boolean;
          _skipAuthRefresh?: boolean;
        };

        // Skip auth refresh for the refresh token endpoint itself
        if (originalRequest._skipAuthRefresh) {
          return Promise.reject(error);
        }

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.subscribeTokenRefresh((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                this.client(originalRequest)
                  .then(resolve)
                  .catch(reject);
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            
            // Validate refresh token before attempting refresh
            if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
              console.log('Invalid refresh token detected, clearing auth');
              this.isRefreshing = false;
              this.clearTokensAndRedirect();
              return Promise.reject(error);
            }
            
            // Create a separate axios instance for refresh to avoid interceptor loop
            const refreshClient = axios.create({
              baseURL: API_BASE_URL,
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('Attempting token refresh with:', refreshToken.substring(0, 20) + '...');
            const response = await refreshClient.post('/auth/refresh-token', {
              refresh_token: refreshToken,
            });

            console.log('Refresh Response:', response.data);
            
            // Extract tokens from nested data structure
            const tokens = response.data.data;
            console.log('New Tokens:', tokens);
            
            // Validate new tokens
            if (!tokens?.access_token || !tokens?.refresh_token) {
              throw new Error('Invalid token response from refresh endpoint');
            }
            
            const access_token = tokens.access_token;
            const newRefreshToken = tokens.refresh_token;
              
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', newRefreshToken);

            this.onRefreshed(access_token);
            this.isRefreshing = false;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
              
            return this.client(originalRequest);
          } catch (refreshError) {
            console.log('Token refresh failed:', refreshError);
            this.isRefreshing = false;
            this.clearTokensAndRedirect();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private clearTokensAndRedirect() {
    console.log('Clearing auth tokens and redirecting to login');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Use window.location.replace to prevent back button issues
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.replace('/login');
    }
  }

  public async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
    });
    
    // Debug logging
    console.log('Login Response:', response.data);
    
    // Extract tokens from nested data structure
    const tokens = response.data.data;
    console.log('Extracted Tokens:', tokens);
    
    // Validate tokens before returning
    if (!tokens?.access_token || !tokens?.refresh_token) {
      throw new Error('Invalid token response from server');
    }
    
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    };
  }

  public async register(data: {
    full_name: string;
    email: string;
    password: string;
    job_title: string;
    department_unit: string;
    role: string;
    address?: string;
    phone_number?: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    
    // Debug logging
    console.log('Register Response:', response.data);
    
    // Extract tokens from nested data structure
    const tokens = response.data.data;
    console.log('Extracted Tokens:', tokens);
    
    // Validate tokens before returning
    if (!tokens?.access_token || !tokens?.refresh_token) {
      throw new Error('Invalid token response from server');
    }
    
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    };
  }

  public async refreshToken(refreshToken: string) {
    const response = await this.client.post('/auth/refresh-token', {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  public async getProfile() {
    const response = await this.client.get('/user/profile');
    return response.data;
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();

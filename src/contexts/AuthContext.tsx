'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { ProfileResponse } from '../types/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: ProfileResponse | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    
    // Validate token exists and is not undefined/null string
    if (token && token !== 'undefined' && token !== 'null') {
      try {
        const profile = await apiClient.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error) {
        // Token might be invalid, clear it
        console.log('Invalid token detected, clearing auth storage');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
      }
    } else {
      // Clear any invalid tokens
      if (token === 'undefined' || token === 'null') {
        console.log('Clearing invalid token from localStorage');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    
    console.log('Login response received:', response);
    console.log('Access Token (first 20 chars):', response.access_token.substring(0, 20));
    console.log('Refresh Token (first 20 chars):', response.refresh_token.substring(0, 20));
    
    // Validate tokens before storing
    if (!response.access_token || !response.refresh_token) {
      throw new Error('Invalid tokens received from login response');
    }
    
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    
    console.log('Tokens stored successfully');
    
    const profile = await apiClient.getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  };

  const register = async (data: any) => {
    const response = await apiClient.register(data);
    
    console.log('Register response received:', response);
    console.log('Access Token (first 20 chars):', response.access_token.substring(0, 20));
    console.log('Refresh Token (first 20 chars):', response.refresh_token.substring(0, 20));
    
    // Validate tokens before storing
    if (!response.access_token || !response.refresh_token) {
      throw new Error('Invalid tokens received from register response');
    }
    
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    
    console.log('Tokens stored successfully');
    
    const profile = await apiClient.getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

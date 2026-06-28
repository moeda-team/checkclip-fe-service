'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, ApiError } from '@/services/api';
import { persistTokens, clearTokens, getAccessToken } from '@/lib/cookies';
import type { ProfileResponse } from '@/types/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TokenResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

interface ProfileEnvelope {
  data: ProfileResponse;
}

interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  job_title: string;
  department_unit: string;
  role: string;
  address?: string;
  phone_number?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: ProfileResponse | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getAccessToken();

    if (token) {
      try {
        const envelope = await apiFetch<ProfileEnvelope>('/user/profile');
        setUser(envelope.data);
        setIsAuthenticated(true);
      } catch {
        clearTokens();
        setIsAuthenticated(false);
      }
    } else {
      clearTokens();
    }

    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const res = await apiFetch<TokenResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      skipAuth: true,
    });

    const { access_token, refresh_token } = res.data;
    if (!access_token || !refresh_token) {
      throw new ApiError('Invalid tokens received from login response', 500);
    }

    persistTokens(access_token, refresh_token);

    const envelope = await apiFetch<ProfileEnvelope>('/user/profile');
    setUser(envelope.data);
    setIsAuthenticated(true);
  };

  const register = async (data: RegisterPayload) => {
    const res = await apiFetch<TokenResponse>('/auth/register', {
      method: 'POST',
      body: data,
      skipAuth: true,
    });

    const { access_token, refresh_token } = res.data;
    if (!access_token || !refresh_token) {
      throw new ApiError('Invalid tokens received from register response', 500);
    }

    persistTokens(access_token, refresh_token);

    const envelope = await apiFetch<ProfileEnvelope>('/user/profile');
    setUser(envelope.data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

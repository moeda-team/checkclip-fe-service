'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginFormData, LoginFormErrors } from '../types';

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle ?error=session_expired — set by api.ts when refresh token fails,
  // matching the same pattern used in the aimos-frontend middleware.
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'session_expired') {
      setErrors({ general: 'Your session has expired. Please sign in again.' });
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const next: LoginFormErrors = {};
    if (!formData.email) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email';
    }
    if (!formData.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFieldChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);

      // Redirect to callbackUrl if present (set by middleware), else dashboard
      const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
      router.push(callbackUrl);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const messages: Record<number, string> = {
        401: 'Invalid email or password',
        404: 'User not found',
        400: 'Invalid login provider',
      };
      setErrors({ general: (status !== undefined ? messages[status] : undefined) ?? 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    handleFieldChange,
    handleSubmit,
  };
}

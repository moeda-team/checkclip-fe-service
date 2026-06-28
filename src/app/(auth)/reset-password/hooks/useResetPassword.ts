'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch, ApiError } from '@/services/api';
import { gooeyToast } from 'goey-toast';
import type { ResetPasswordFormData, ResetPasswordFormErrors } from '../types';

export function useResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      gooeyToast.error('Token reset tidak valid. Silakan minta link reset password baru.');
    }
  }, [token]);

  const validate = (): boolean => {
    const next: ResetPasswordFormErrors = {};
    if (!formData.new_password) {
      next.new_password = 'Password is required';
    } else if (formData.new_password.length < 8) {
      next.new_password = 'Password must be at least 8 characters';
    }
    if (!formData.confirm_password) {
      next.confirm_password = 'Please confirm your password';
    } else if (formData.new_password !== formData.confirm_password) {
      next.confirm_password = 'Passwords do not match';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFieldChange = (field: keyof ResetPasswordFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      gooeyToast.error('Token reset tidak valid. Silakan minta link reset password baru.');
      return;
    }
    if (!validate()) return;

    setIsLoading(true);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: {
          token,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        },
        skipAuth: true,
      });
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 || err.status === 404) {
          gooeyToast.error('Token tidak valid atau sudah kadaluarsa. Silakan minta link reset password baru.');
        } else {
          gooeyToast.error('Gagal mereset password. Silakan coba lagi.');
        }
      } else {
        gooeyToast.error('Gagal mereset password. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    isTokenValid,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleFieldChange,
    handleSubmit,
  };
}

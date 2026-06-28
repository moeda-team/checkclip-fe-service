'use client';

import { useState } from 'react';
import { apiFetch, ApiError } from '@/services/api';
import { gooeyToast } from 'goey-toast';
import type { ForgotPasswordFormData, ForgotPasswordFormErrors } from '../types';

export function useForgotPassword() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const next: ForgotPasswordFormErrors = {};
    if (!formData.email) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFieldChange = (field: keyof ForgotPasswordFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: { email: formData.email },
        skipAuth: true,
      });
      setIsSuccess(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          gooeyToast.error('Email tidak terdaftar. Silakan periksa kembali email Anda.');
        } else if (err.status === 400) {
          gooeyToast.error('Format email tidak valid. Silakan periksa kembali.');
        } else {
          gooeyToast.error('Gagal mengirim link reset. Silakan coba lagi.');
        }
      } else {
        gooeyToast.error('Gagal mengirim link reset. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, isLoading, isSuccess, handleFieldChange, handleSubmit };
}

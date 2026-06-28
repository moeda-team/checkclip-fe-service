'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterFormData, RegisterFormErrors } from '../types';

export function useRegister() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: '',
    email: '',
    password: '',
    job_title: '',
    department_unit: '',
    role: '',
    phone_number: '',
    address: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const next: RegisterFormErrors = {};
    if (!formData.full_name) {
      next.full_name = 'Full name is required';
    } else if (formData.full_name.length < 2) {
      next.full_name = 'Name must be at least 2 characters';
    }
    if (!formData.email) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      next.password = 'Password is required';
    } else if (formData.password.length < 6) {
      next.password = 'Password must be at least 6 characters';
    }
    if (!formData.job_title) next.job_title = 'Job title is required';
    if (!formData.department_unit) next.department_unit = 'Department is required';
    if (!formData.role) next.role = 'Role is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const normalizePhone = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.startsWith('62')) return digits.slice(2);
    if (digits.startsWith('0')) return digits.slice(1);
    return digits;
  };

  const handleFieldChange = (field: keyof RegisterFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const handlePhoneChange = (value: string) => {
    const normalized = normalizePhone(value);
    setFormData((prev) => ({ ...prev, phone_number: normalized }));
    if (errors.phone_number) {
      setErrors((prev) => ({ ...prev, phone_number: undefined, general: undefined }));
    }
  };

  /** Called once enums finish loading — pre-select the first option of each field */
  const setDefaultEnumValues = (defaults: {
    job_title: string;
    department_unit: string;
    role: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      job_title: prev.job_title || defaults.job_title,
      department_unit: prev.department_unit || defaults.department_unit,
      role: prev.role || defaults.role,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register({ ...formData, phone_number: `+62${formData.phone_number}` });
      router.push('/');
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const messages: Record<number, string> = {
        409: 'Email already registered',
        422: 'Validation failed. Please check your input.',
      };
      setErrors({
        general: (status && messages[status])?.toString() ?? 'Registration failed. Please try again.',
      });
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
    handlePhoneChange,
    handleSubmit,
    setDefaultEnumValues,
  };
}

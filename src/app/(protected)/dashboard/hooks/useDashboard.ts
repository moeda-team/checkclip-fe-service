'use client';

import { useAuth } from '@/contexts/AuthContext';

export function useDashboard() {
  const { user, loading } = useAuth();

  return { user, loading };
}

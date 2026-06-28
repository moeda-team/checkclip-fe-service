'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import type { EnumOption, EnumData } from '../types';

interface EnumEnvelope {
  data: EnumOption[];
}

export function useRegisterEnums() {
  const [enums, setEnums] = useState<EnumData>({
    jobTitles: [],
    departments: [],
    roles: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [jobRes, deptRes, roleRes] = await Promise.all([
          apiFetch<EnumEnvelope>('/enum/job-title', { skipAuth: true }),
          apiFetch<EnumEnvelope>('/enum/department-unit', { skipAuth: true }),
          apiFetch<EnumEnvelope>('/enum/system-role', { skipAuth: true }),
        ]);

        if (!cancelled) {
          setEnums({
            jobTitles: jobRes.data,
            departments: deptRes.data,
            roles: roleRes.data,
          });
        }
      } catch {
        if (!cancelled) setError('Failed to load options. Please refresh the page.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { enums, loading, error };
}

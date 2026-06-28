'use client';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Returns profile data for the sidebar.
 * Reads from AuthContext — no extra API call needed since
 * the profile is already fetched during login/checkAuth.
 */
export function useSidebarProfile() {
  const { user, loading } = useAuth();

  /** First letter of full name for avatar fallback */
  const initials = user?.full_name
    ? user.full_name.trim().charAt(0).toUpperCase()
    : '?';

  /** Human-readable job title from snake_case */
  const jobTitleLabel = user?.job_title
    ? user.job_title
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '';

  return {
    loading,
    fullName: user?.full_name ?? '',
    jobTitle: jobTitleLabel,
    profilePictureUrl: user?.profile_picture_url ?? null,
    initials,
  };
}

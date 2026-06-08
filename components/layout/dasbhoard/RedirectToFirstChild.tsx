"use client";

import { useRedirectToFirstChild } from "@/hooks/use-redirect-to-first-child";

type RedirectToFirstChildProps = {
  /** Optional explicit href. When omitted, the first child is resolved from the nav config. */
  to?: string;
  /** Rendered while the redirect is resolving / in flight. */
  fallback?: React.ReactNode;
};

/**
 * Drop-in page component for placeholder parent routes. It auto-redirects to
 * the first navigable child and renders an optional fallback meanwhile.
 *
 * @example
 * export default function CustomerDataPage() {
 *   return <RedirectToFirstChild />;
 * }
 */
export function RedirectToFirstChild({ to, fallback = null }: RedirectToFirstChildProps) {
  useRedirectToFirstChild(to);
  return <>{fallback}</>;
}

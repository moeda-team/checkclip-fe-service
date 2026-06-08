"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { findFirstChildHref } from "@/components/layout/dasbhoard/navigation";

/**
 * Redirects a placeholder parent route to its first navigable child.
 *
 * When the current path is a placeholder (a nav item that only has children,
 * no page of its own), this resolves the first leaf descendant from the
 * navigation config and replaces the current route with it.
 *
 * @param target Optional explicit href to redirect to. When omitted, the first
 *               child is resolved from the navigation tree based on the current
 *               pathname.
 * @returns The resolved redirect target (or `null` if none), useful for
 *          rendering a fallback while the redirect happens.
 */
export function useRedirectToFirstChild(target?: string): string | null {
  const router = useRouter();
  const pathname = usePathname();
  const destination = target ?? findFirstChildHref(pathname);

  useEffect(() => {
    if (destination && destination !== pathname) {
      router.replace(destination);
    }
  }, [destination, pathname, router]);

  return destination;
}

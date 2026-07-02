"use client";

// AttendanceMap.tsx
// Shell component — loads AttendanceMapInner dynamically (SSR disabled)
// because Leaflet accesses `window` on import.

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

// ─── Office config ────────────────────────────────────────────────────────────
// TODO: move to env vars or fetch from settings API when available
const OFFICE = {
  lat: -6.8566,       // Sumedang, Jawa Barat
  lng: 107.9215,
  name: "Head Office",
  city: "Sumedang",
  radiusMeters: 2_000, // 5 km
};

// ─── Dynamic import (no SSR) ──────────────────────────────────────────────────
const AttendanceMapInner = dynamic(() => import("./AttendanceMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl bg-gray-100 animate-pulse" style={{ height: 320 }} />
  ),
});

// ─── Props ────────────────────────────────────────────────────────────────────
export type AttendanceMapProps = {
  /** User check-in latitude — undefined if not yet checked in */
  latitude?: string | null;
  /** User check-in longitude — undefined if not yet checked in */
  longitude?: string | null;
  /** ISO timestamp of last check-in, shown in footer */
  lastUpdated?: string | null;
};

// ─── Component ────────────────────────────────────────────────────────────────
export function AttendanceMap({ latitude, longitude, lastUpdated }: AttendanceMapProps) {
  const userLat = latitude ? parseFloat(latitude) : undefined;
  const userLng = longitude ? parseFloat(longitude) : undefined;

  const hasValidUser =
    userLat !== undefined &&
    userLng !== undefined &&
    !isNaN(userLat) &&
    !isNaN(userLng) &&
    !(userLat === 0 && userLng === 0);

  // Format last-updated time for footer
  const formattedTime = lastUpdated
    ? new Date(`${lastUpdated}Z`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : undefined;

  return (
    <AttendanceMapInner
      officeLat={OFFICE.lat}
      officeLng={OFFICE.lng}
      officeName={OFFICE.name}
      officeCity={OFFICE.city}
      radiusMeters={OFFICE.radiusMeters}
      userLat={hasValidUser ? userLat : undefined}
      userLng={hasValidUser ? userLng : undefined}
      lastUpdated={formattedTime}
    />
  );
}

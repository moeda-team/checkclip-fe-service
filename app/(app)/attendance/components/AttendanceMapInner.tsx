"use client";

// AttendanceMapInner.tsx — loaded dynamically (no SSR) to avoid Leaflet window crash.

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Fix Leaflet default marker icon broken by webpack ────────────────────────
function useLeafletIconFix() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
}

// ─── Office marker (building icon) ───────────────────────────────────────────
const officeIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      background: white;
      border: 2px solid #0D9488;
      border-radius: 8px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 12px;
      font-weight: 600;
      color: #0F2132;
    ">
      <span style="font-size:14px">🏢</span>
      <div>
        <div style="font-weight:700;font-size:12px">Head Office</div>
        <div style="font-weight:400;font-size:10px;color:#64748b">Sumedang</div>
      </div>
    </div>
  `,
  iconSize: [140, 44],
  iconAnchor: [70, 44],
  popupAnchor: [0, -48],
});

// ─── User marker — green (within range) or gray (out of range) ────────────────
function makeUserIcon(withinRange: boolean) {
  const color = withinRange ? "#10B981" : "#94A3B8";
  return new L.DivIcon({
    className: "",
    html: `
      <div style="
        width: 20px; height: 20px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

// ─── Haversine distance (meters) ─────────────────────────────────────────────
function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Fly-to helper (re-centers map when office coords change) ─────────────────
function FlyToOffice({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const prevRef = useRef<string>("");
  useEffect(() => {
    const key = `${lat},${lng}`;
    if (key !== prevRef.current) {
      prevRef.current = key;
      map.setView([lat, lng], 13, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

// ─── Props ────────────────────────────────────────────────────────────────────
export type AttendanceMapInnerProps = {
  officeLat: number;
  officeLng: number;
  officeName: string;
  officeCity: string;
  radiusMeters: number;
  /** User's check-in position — undefined if not yet checked in */
  userLat?: number;
  userLng?: number;
  lastUpdated?: string;
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AttendanceMapInner({
  officeLat,
  officeLng,
  officeName,
  officeCity,
  radiusMeters,
  userLat,
  userLng,
  lastUpdated,
}: AttendanceMapInnerProps) {
  useLeafletIconFix();

  const hasUser = userLat !== undefined && userLng !== undefined;
  const distance = hasUser
    ? haversineMeters(officeLat, officeLng, userLat!, userLng!)
    : null;
  const withinRange = distance !== null && distance <= radiusMeters;

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white">
      {/* ── Header ── */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Location Validation</h3>
          <p className="text-[10px] text-gray-400">FR-009</p>
        </div>
        {hasUser && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              withinRange
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${withinRange ? "bg-emerald-500" : "bg-red-500"}`}
            />
            {withinRange ? "Within Office Radius" : "Outside Office Radius"}
          </span>
        )}
      </div>

      {/* ── Map ── */}
      <MapContainer
        center={[officeLat, officeLng]}
        zoom={13}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ width: "100%", height: "260px" }}
      >
        <FlyToOffice lat={officeLat} lng={officeLng} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Custom zoom control bottom-right */}
        {/* Office radius circle */}
        <Circle
          center={[officeLat, officeLng]}
          radius={radiusMeters}
          pathOptions={{
            color: "#0D9488",
            fillColor: "#0D9488",
            fillOpacity: 0.1,
            weight: 1.5,
            dashArray: "6 4",
          }}
        />

        {/* Office marker */}
        <Marker position={[officeLat, officeLng]} icon={officeIcon}>
          <Popup>
            <div className="text-xs text-center">
              <p className="font-bold">{officeName}</p>
              <p className="text-gray-500">{officeCity}</p>
              <p className="text-gray-400 mt-1">Radius: {(radiusMeters / 1000).toFixed(1)} km</p>
            </div>
          </Popup>
        </Marker>

        {/* User marker */}
        {hasUser && (
          <Marker
            position={[userLat!, userLng!]}
            icon={makeUserIcon(withinRange)}
          >
            <Popup>
              <div className="text-xs text-center">
                <p className="font-semibold">Your Location</p>
                <p className="text-gray-500 mt-0.5">
                  {distance !== null
                    ? distance < 1000
                      ? `${Math.round(distance)}m from office`
                      : `${(distance / 1000).toFixed(2)}km from office`
                    : ""}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* ── Legend + footer ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          {hasUser && (
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                  withinRange ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {withinRange ? "You (Within Range)" : "You (Out of Range)"}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
            Office Location
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-gray-400">
          {distance !== null && (
            <span>Accuracy: ~{Math.round(distance)}m</span>
          )}
          {lastUpdated && <span>Last updated: {lastUpdated}</span>}
        </div>
      </div>
    </div>
  );
}

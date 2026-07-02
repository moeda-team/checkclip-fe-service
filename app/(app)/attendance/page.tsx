"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { AttendanceHeader, type AttendanceStatus } from "./components/AttendanceHeader";
import { AttendanceAction } from "./components/AttendanceAction";
import {
  useGetAttendanceToday,
  useUploadAttendanceImage,
  useCheckIn,
  useCheckOut,
  useGetAttendanceHistory,
} from "./hooks/use-attendance";
import { AttendanceHistoryTable } from "./components/AttendanceHistoryTable";
import { CalculationDuration } from "@/lib/helper";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  // Backend returns NaiveDateTime without timezone — treat as local
  return iso + "z"

}



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const { data: todayData, isLoading: isFetchingToday } = useGetAttendanceToday();
  const { data: historyTable} = useGetAttendanceHistory();
  const uploadImage = useUploadAttendanceImage();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const today = todayData?.data ?? null;

  // Derive status from server data
  const status: AttendanceStatus = useMemo(() => {
    if (!today) return "not_started";
    if (today.check_out_at) return "checked_out";
    if (today.check_in_at) return "checked_in";
    return "not_started";
  }, [today]);

  const isLoading =
    isFetchingToday ||
    uploadImage.isPending ||
    checkInMutation.isPending ||
    checkOutMutation.isPending;

  // ── Get geolocation ────────────────────────────────────────────────────────

  const getLocation = (): Promise<{ latitude: string; longitude: string }> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: String(pos.coords.latitude),
            longitude: String(pos.coords.longitude),
          }),
        () => reject(new Error("Unable to retrieve your location")),
        { timeout: 10_000 },
      );
    });

  // ── Check-in handler ───────────────────────────────────────────────────────

  const handleCheckIn = async (opts: {
    faceVerification: boolean;
    photoCapture: boolean;
    photoDataUrl?: string;
  }) => {
    try {
      // 1. Get geolocation
      let coords: { latitude: string; longitude: string };
      try {
        coords = await getLocation();
      } catch {
        // Fallback: use 0,0 if location denied — backend still accepts it
        coords = { latitude: "0", longitude: "0" };
        toast.warning("Location unavailable — using default coordinates.");
      }

      // 2. Upload image if provided
      let imageIds: string[] = [];
      if (opts.photoDataUrl) {
        const uploaded = await uploadImage.mutateAsync({
          dataUrl: opts.photoDataUrl,
          filename: `checkin_${Date.now()}.jpg`,
        });
        imageIds = uploaded.data?.image_id ?? [];
      }

      // 3. Check-in
      await checkInMutation.mutateAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
        image_ids: imageIds,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Check-in failed";
      toast.error(msg);
    }
  };

  // ── Check-out handler ──────────────────────────────────────────────────────

  const handleCheckOut = async (opts: {
    faceVerification: boolean;
    photoCapture: boolean;
    photoDataUrl?: string;
  }) => {
    if (!today?.id) {
      toast.error("No active attendance session found.");
      return;
    }

    try {
      // Upload check-out photo if provided
      if (opts.photoDataUrl) {
        await uploadImage.mutateAsync({
          dataUrl: opts.photoDataUrl,
          filename: `checkout_${Date.now()}.jpg`,
        });
      }

      await checkOutMutation.mutateAsync(today.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Check-out failed";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <AttendanceHeader
        status={status}
        checkInTime={formatTime(today?.check_in_at?.toString())}
        checkOutTime={formatTime(today?.check_out_at?.toString())}
        workDuration={CalculationDuration(
          today?.check_in_at?.toString(),
          today?.check_out_at?.toString(),
        )}
        shiftName="Morning Shift"
        shiftStart="08:00 AM"
        shiftEnd="05:00 PM"
        shiftTarget="8h 0m target"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <AttendanceAction
            status={status}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isLoading={isLoading}
          />
        </div>

        {/* Placeholder for attendance log / map */}
        <div className="lg:col-span-1">
          <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
            <p className="text-sm text-gray-400">Attendance log — coming soon</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 lg:grid-cols-1 gap-8">
        <div className="lg:col-span-1">
          <AttendanceHistoryTable 
            attendanceHistory={historyTable?.data ?? []}
          />
        </div>
      </div>
    </div>
  );
}

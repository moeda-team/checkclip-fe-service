"use client";

// app/(app)/attendance/components/AttendanceAction.tsx
// Check-in / Check-out action panel with optional Face Verification & Photo Capture.

import { useState } from "react";
import { Clock, ScanFace, Camera, ShieldCheck, FingerprintPattern } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "./AttendanceHeader";
import { PhotoCaptureModal } from "./PhotoCaptureModal";


// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceActionProps = {
  status: AttendanceStatus;
  onCheckIn?: (opts: {
    faceVerification: boolean;
    photoCapture: boolean;
    photoDataUrl?: string;
  }) => void;
  onCheckOut?: (opts: {
    faceVerification: boolean;
    photoCapture: boolean;
    photoDataUrl?: string;
  }) => void;
  isLoading?: boolean;
};

// ─── Security option card ─────────────────────────────────────────────────────

function SecurityOption({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
        enabled
          ? "border-teal-200 bg-teal-50/50"
          : "border-gray-100 bg-white hover:border-gray-200",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          enabled ? "bg-teal-100" : "bg-gray-100",
        )}
      >
        <Icon
          className={cn("w-5 h-5", enabled ? "text-teal-600" : "text-gray-400")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 mt-2 text-[11px] font-semibold",
            enabled ? "text-teal-600" : "text-gray-400",
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              enabled ? "bg-teal-500" : "bg-gray-300",
            )}
          />
          Optional
        </span>
      </div>
    </button>
  );
}

function SecurityRequired({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
        enabled
          ? "border-teal-200 bg-teal-50/50"
          : "border-gray-100 bg-white hover:border-gray-200",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
          enabled ? "bg-teal-100" : "bg-gray-100",
        )}
      >
        <Icon
          className={cn("w-5 h-5", enabled ? "text-teal-600" : "text-gray-400")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 mt-2 text-[11px] font-semibold",
            enabled ? "text-teal-600" : "text-gray-400",
          )}
        >
        </span>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AttendanceAction({
  status,
  onCheckIn,
  onCheckOut,
  isLoading = false,
}: AttendanceActionProps) {
  const [faceVerification, setFaceVerification] = useState(false);
  const [photoCapture, setPhotoCapture] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  // Track whether the pending action is check-in or check-out
  const [pendingAction, setPendingAction] = useState<"check_in" | "check_out">(
    "check_in",
  );

  const isCheckedIn = status === "checked_in";
  const isCheckedOut = status === "checked_out";

  // When button pressed: if photoCapture is enabled, open modal first;
  // otherwise fire the callback directly.
  const handleAction = () => {
    if (isLoading || isCheckedOut) return;
    const action = isCheckedIn ? "check_out" : "check_in";
    if (photoCapture) {
      setPendingAction(action);
      setShowPhotoModal(true);
    } else {
      fireAction(action, undefined);
    }
  };

  const fireAction = (
    action: "check_in" | "check_out",
    photoDataUrl: string | undefined,
  ) => {
    const opts = { faceVerification, photoCapture, photoDataUrl };
    if (action === "check_in") {
      onCheckIn?.(opts);
    } else {
      onCheckOut?.(opts);
    }
  };

  const handlePhotoConfirm = (photoDataUrl: string) => {
    setShowPhotoModal(false);
    fireAction(pendingAction, photoDataUrl);
  };

  // ── Status description ────────────────────────────────────────────────────
  const statusConfig = {
    not_started: {
      label: "Status: Not Started",
      description: [
        "You haven't checked in yet.",
        "Please check in to start recording your attendance.",
      ],
      iconColor: "text-teal-500",
      iconBg: "bg-teal-50",
    },
    checked_in: {
      label: "Status: On Duty",
      description: [
        "You're currently checked in.",
        "Click Check Out when you're done for the day.",
      ],
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    checked_out: {
      label: "Status: Completed",
      description: [
        "You've completed your shift for today.",
        "Great work! See you tomorrow.",
      ],
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* ── Title ── */}
      <div>
        <h3 className="text-base font-bold text-gray-900">Attendance Action</h3>
        <p className="text-xs text-gray-400 mt-0.5">FR-007, FR-008</p>
      </div>

      {/* ── Status banner ── */}
      <div className="flex flex-col items-center gap-3 py-6 bg-gray-50 rounded-xl">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            config.iconBg,
          )}
        >
          <Clock className={cn("w-8 h-8", config.iconColor)} />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{config.label}</p>
          {config.description.map((line, i) => (
            <p key={i} className="text-sm text-gray-500 mt-0.5">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* ── Action button ── */}
      {!isCheckedOut && (
        <button
          type="button"
          onClick={handleAction}
          disabled={isLoading}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-1 py-5 rounded-xl transition-all",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            isCheckedIn
              ? "bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
              : "bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700",
          )}
        >
          <div className="flex items-center gap-3">
            <FingerprintPattern className="w-8 h-8 text-white/80" />
            <div className="text-left">
              <p className="text-lg font-bold text-white leading-none">
                {isLoading
                  ? "Processing…"
                  : isCheckedIn
                    ? "Check Out"
                    : "Check In"}
              </p>
              <p className="text-sm text-white/70 mt-0.5">
                {isLoading
                  ? "Please wait"
                  : isCheckedIn
                    ? "Click to check-out"
                    : "Click to check-in"}
              </p>
            </div>
          </div>
        </button>
      )}

      {/* ── Completed state ── */}
      {isCheckedOut && (
        <div className="flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <p className="text-sm font-semibold text-emerald-700">
            Attendance recorded for today
          </p>
        </div>
      )}

      {/* ── Enhance security ── */}
      {!isCheckedOut && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">
              Enhance security
            </p>
            <p className="text-xs text-gray-400">FR-010, FR-011</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SecurityRequired
              icon={Camera}
              title="Photo Capture"
              description="Capture your photo during check-in"
              enabled={true}
              onToggle={() => setPhotoCapture((p) => !p)}
            />
            <SecurityOption
              icon={ScanFace}
              title="Face Verification"
              description="Verify your face for secure check-in"
              enabled={faceVerification}
              onToggle={() => setFaceVerification((p) => !p)}
            />
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-600">
              These verification steps are optional and help maintain accurate
              attendance records.
            </p>
          </div>
        </div>
      )}

      {/* ── Photo capture modal ── */}
      <PhotoCaptureModal
        open={showPhotoModal}
        onConfirm={handlePhotoConfirm}
        onClose={() => setShowPhotoModal(false)}
      />
    </div>
  );
}

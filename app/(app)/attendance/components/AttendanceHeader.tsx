"use client";

// app/(app)/attendance/components/AttendanceHeader.tsx
// Greeting + today's shift info + 4 stat cards (Check In, Check Out, Work Duration, Status)

import { Calendar, Clock, RotateCcw, CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceStatus = "not_started" | "checked_in" | "checked_out";

export type AttendanceHeaderProps = {
  status: AttendanceStatus;
  checkInTime?: string;   // e.g. "08:03 AM"
  checkOutTime?: string;  // e.g. "05:12 PM"
  workDuration?: string;  // e.g. "8h 9m"
  shiftName?: string;     // e.g. "Morning Shift"
  shiftStart?: string;    // e.g. "08:00 AM"
  shiftEnd?: string;      // e.g. "05:00 PM"
  shiftTarget?: string;   // e.g. "8h 0m target"
  onViewShiftSchedule?: () => void;
};

// ─── Greeting helper ──────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "👋";
  if (hour < 17) return "☀️";
  return "🌙";
}

// ─── Stat card ────────────────────────────────────────────────────────────────

type StatCardProps = {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
};

function StatCard({ label, value, sub, icon, iconBg }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex-1 min-w-[160px]">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-base font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AttendanceHeader({
  status = "not_started",
  checkInTime,
  checkOutTime,
  workDuration = "0h 00m",
  shiftName = "Morning Shift",
  shiftStart = "08:00 AM",
  shiftEnd = "05:00 PM",
  shiftTarget = "8h 0m target",
  onViewShiftSchedule,
}: AttendanceHeaderProps) {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const statusLabel =
    status === "not_started"
      ? "Not Started"
      : status === "checked_in"
      ? "On Duty"
      : "Completed";

  const statusSub =
    status === "not_started"
      ? "Shift has not started"
      : status === "checked_in"
      ? "Currently working"
      : "Shift completed";

  return (
    <div className="space-y-4">
      {/* ── Top row: greeting + shift info ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        {/* Left: greeting */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {getGreeting()}, {firstName}! {getGreetingEmoji()}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Let&apos;s make today productive. Don&apos;t forget to check-in for your assigned shift.
          </p>
        </div>

        {/* Right: shift info */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Today's shift */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Today&apos;s Shift</p>
              <p className="text-sm font-bold text-gray-900">{shiftName}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-10 w-px bg-gray-100" />

          {/* Shift time */}
          <div>
            <p className="text-sm font-bold text-gray-900">
              {shiftStart} – {shiftEnd}
            </p>
            <p className="text-xs text-gray-400">{shiftTarget}</p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-10 w-px bg-gray-100" />

          {/* View schedule */}
          <button
            type="button"
            onClick={onViewShiftSchedule}
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 whitespace-nowrap transition-colors"
          >
            View Shift Schedule
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Check In */}
        <StatCard
          label="Check In"
          value={checkInTime ?? "Not Started"}
          sub={checkInTime ? `Checked in at ${checkInTime}` : "Please check-in to start your day"}
          icon={<Clock className="w-5 h-5 text-teal-500" />}
          iconBg="bg-teal-50"
        />

        {/* Check Out */}
        <StatCard
          label="Check Out"
          value={checkOutTime ?? "--:--"}
          sub={checkOutTime ? `Checked out at ${checkOutTime}` : "Not available yet"}
          icon={<RotateCcw className="w-5 h-5 text-purple-500" />}
          iconBg="bg-purple-50"
        />

        {/* Work Duration */}
        <StatCard
          label="Work Duration"
          value={workDuration}
          sub="Today"
          icon={<Clock className="w-5 h-5 text-orange-400" />}
          iconBg="bg-orange-50"
        />

        {/* Status */}
        <StatCard
          label="Status"
          value={statusLabel}
          sub={statusSub}
          icon={
            <CheckCircle2
              className={`w-5 h-5 ${
                status === "checked_out"
                  ? "text-emerald-500"
                  : status === "checked_in"
                  ? "text-blue-500"
                  : "text-gray-400"
              }`}
            />
          }
          iconBg={
            status === "checked_out"
              ? "bg-emerald-50"
              : status === "checked_in"
              ? "bg-blue-50"
              : "bg-gray-50"
          }
        />
      </div>
    </div>
  );
}

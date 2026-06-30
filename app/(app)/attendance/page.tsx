"use client";

import { useState } from "react";
import { AttendanceHeader, type AttendanceStatus } from "./components/AttendanceHeader";
import { AttendanceAction } from "./components/AttendanceAction";

export default function AttendancePage() {
  // Placeholder state — will be driven by API later
  const [status, setStatus] = useState<AttendanceStatus>("not_started");
  const [checkInTime, setCheckInTime] = useState<string | undefined>();
  const [checkOutTime, setCheckOutTime] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleCheckIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCheckInTime(formatTime());
      setStatus("checked_in");
      setIsLoading(false);
    }, 800);
  };

  const handleCheckOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCheckOutTime(formatTime());
      setStatus("checked_out");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6">
      <AttendanceHeader
        status={status}
        checkInTime={checkInTime}
        checkOutTime={checkOutTime}
        shiftName="Morning Shift"
        shiftStart="08:00 AM"
        shiftEnd="05:00 PM"
        shiftTarget="8h 0m target"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action panel — takes 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <AttendanceAction
            status={status}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isLoading={isLoading}
          />
        </div>

        {/* Placeholder for future content (attendance log table, map, etc.) */}
        {/* <div className="lg:col-span-2">
          <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
            <p className="text-sm text-gray-400">Attendance log — coming soon</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

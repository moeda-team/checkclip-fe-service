import { CalculationDuration, FormatTimeLocal } from "@/lib/helper";
import { HistoryTable } from "../types/history-table";
import { Calendar, EllipsisVertical, Filter } from "lucide-react";

export type AttendanceHistoryTableProps = {
  attendanceHistory: HistoryTable[];
};

export function AttendanceHistoryTable({
  attendanceHistory = [],
}: AttendanceHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
    <div className="flex items-baseline gap-2">
      <h2 className="text-lg font-bold text-slate-800">Attendance History</h2>
      <span className="text-xs font-medium text-slate-400">FR-014</span>
    </div>
    
    <div className="flex items-center gap-2">
      {/* Date Picker Button */}
      <button type="button" className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 transition">
        <span className="text-gray-400 text-xs">
            <Calendar size={16}/>
            </span>
        <span className="font-medium">Jun 18 - Jun 24, 2026</span>
        <span className="text-gray-400 text-xs">▼</span> {/* Ganti dengan <ChevronDown size={14} /> */}
      </button>

      <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-slate-600 hover:bg-gray-50 transition">
        <span className="text-gray-400 text-xs">
            <Filter size={14} />
            </span>
        <span className="font-medium">Filter</span>
      </button>
    </div>
  </div>
      <table className="min-w-full bg-white">
        <thead className="bg-[#F8F9F8]">
          <tr className="border-b">
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Shift</th>
            <th className="py-2 px-4 text-left">Check In</th>
            <th className="py-2 px-4 text-left">Check Out</th>
            <th className="py-2 px-4 text-left">Work Duration</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Location</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {attendanceHistory.map((record, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">
                {FormatTimeLocal(
                  new Date(record.check_in_at + "z")!,
                  "MMM dd, yyyy (eee)",
                )}
              </td>
              <td className="py-2 px-4">Shift Morning</td>
              <td className="py-2 px-4">
                {FormatTimeLocal(
                  new Date(record.check_in_at + "z"),
                  "HH:mm:ss",
                )}
              </td>
              <td className="py-2 px-4">
                {record?.check_out_at
                  ? FormatTimeLocal(
                      new Date(record.check_out_at! + "z"),
                      "HH:mm:ss",
                    )
                  : "-"}
              </td>
              <td className="py-2 px-4">
                {CalculationDuration(
                  record?.check_in_at?.toString(),
                  record?.check_out_at?.toString(),
                )}
              </td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">
                <button type="button" className="absolute -translate-y-1/2">
                    <EllipsisVertical />
                </button>
              </td>

            </tr>
          ))}
        </tbody>
        <tfoot>
            <tr>
                <td colSpan={8} className="py-2 px-4 text-center">
                    <button className="text-blue-500 hover:underline">
                        View All
                    </button>
                </td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
}

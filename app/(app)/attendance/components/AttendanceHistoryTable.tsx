import { CalculationDuration, FormatTimeLocal } from "@/lib/helper";
import { HistoryTable } from "../types/history-table";
import { EllipsisVertical } from "lucide-react";

export type AttendanceHistoryTableProps = {
  attendanceHistory: HistoryTable[];
};

export function AttendanceHistoryTable({
  attendanceHistory = [],
}: AttendanceHistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
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
      </table>
    </div>
  );
}

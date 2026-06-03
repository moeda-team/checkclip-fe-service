import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { CampaignBrief } from "@/app/(app)/campaign-brief/types";

const barColors = [
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-400",
  "bg-pink-500",
];

export function BudgetContent({ brief }: { brief: CampaignBrief }) {
  const b = brief.budget;

  if (!b) return <p className="text-sm text-gray-400">No budget data</p>;

  const startDate = b.start_date ? new Date(b.start_date) : null;
  const endDate = b.end_date ? new Date(b.end_date) : null;
  const breakdown = brief.result_ai?.budget_breakdown;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-gray-200 rounded-xl p-3.5">
          <p className="text-xs text-gray-500 mb-1">Budget Type</p>
          <p className="text-sm font-semibold text-gray-900 capitalize">{b.type || "—"}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3.5">
          <p className="text-xs text-gray-500 mb-1">Total Budget</p>
          <p className="text-sm font-semibold text-gray-900">
            {b.type ? `$ ${Number(b.amount).toLocaleString("en-US")}` : "—"}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3.5">
          <p className="text-xs text-gray-500 mb-1">Allocated Based on Budget</p>
          <p className="text-sm font-semibold text-gray-900">
            {breakdown
              ? `$ ${Number(breakdown.total_budget_usd).toLocaleString("en-US")}`
              : "—"}
          </p>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">Schedule</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Start Date</p>
            <p className="text-sm text-gray-900">
              {startDate ? format(startDate, "dd-MM-yyyy") : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Time</p>
            <p className="text-sm text-gray-900">
              {startDate ? format(startDate, "HH:mm") : "—"}
            </p>
          </div>
          {b.end_date != null && (
            <>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">End Date</p>
                <p className="text-sm text-gray-900">
                  {endDate ? format(endDate, "dd-MM-yyyy") : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Time</p>
                <p className="text-sm text-gray-900">
                  {endDate ? format(endDate, "HH:mm") : "—"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Breakdown */}
      {breakdown && breakdown.categories?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-3">Breakdown</p>

          {/* Bar chart rows */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
              <div className="w-[110px] shrink-0">
                Spend Category ({breakdown.categories.length})
              </div>
              <div className="flex-1" />
              <div className="w-24 shrink-0 text-right">Amount</div>
              <div className="w-20 shrink-0 text-right">% of Budget</div>
            </div>
            {breakdown.categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-[110px] shrink-0 px-2.5 py-1 rounded-full text-xs font-medium text-white truncate",
                    barColors[i % barColors.length]
                  )}
                  title={cat.creative_format}
                >
                  {cat.creative_format.length > 11
                    ? cat.creative_format.slice(0, 11) + "…"
                    : cat.creative_format}
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      barColors[i % barColors.length]
                    )}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>
                <div className="w-24 shrink-0 text-sm text-gray-700 text-right">
                  $ {Number(cat.amount_usd).toLocaleString("en-US")}
                </div>
                <div className="w-20 shrink-0 text-sm text-gray-700 text-right">
                  {cat.percentage}%
                </div>
              </div>
            ))}
          </div>

          {/* Detail table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Description</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">% of Budget</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.categories.map((cat, i) => (
                  <tr
                    key={i}
                    className={cn(
                      "border-b border-gray-100 last:border-0",
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                  >
                    <td className="px-4 py-3 text-gray-900 font-medium">{cat.creative_format}</td>
                    <td className="px-4 py-3 text-gray-600">{cat.description}</td>
                    <td className="px-4 py-3 text-gray-900">
                      $ {Number(cat.amount_usd).toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{cat.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

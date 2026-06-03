// app/(app)/campaigns/components/StatItem.tsx
// Single stat tile used in the campaigns stats header.

import { cn } from "@/lib/utils";

export function StatItem({
  label,
  value,
  sub,
  icon: Icon,
  iconBg
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          iconBg
        )}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

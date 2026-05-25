// components/ui/skeletons.tsx
// Centralized skeleton components for consistent loading states across all modules.
//
// USAGE:
//   import { TableSkeleton, CardStatSkeleton, DetailSkeleton, ... } from "@/components/ui/skeletons"
//
// VARIANTS:
//   <CardStatSkeleton />          — stat card (dashboard)
//   <TableSkeleton cols={5} />    — data table rows
//   <BriefListSkeleton />         — campaign brief sidebar list
//   <DetailSkeleton />            — 3-column detail panel (campaign brief)
//   <FormSkeleton />              — create/edit form wizard
//   <PageSkeleton />              — full page with header + content

import { Skeleton } from "@/components/ui/skeleton";

// ─── Stat Card ────────────────────────────────────────────────────────────────

export function CardStatSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function CardStatSkeletonGroup({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardStatSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Data Table ───────────────────────────────────────────────────────────────

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ cols = 5, rows = 5 }: { cols?: number; rows?: number }) {
  return (
    <div className="rounded-md border overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 flex-1" />
        ))}
      </div>
      {/* Rows */}
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Campaign Brief — sidebar list ───────────────────────────────────────────

export function BriefListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-2.5 px-1 py-3">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-2.5 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Campaign Brief — detail panel ───────────────────────────────────────────

export function DetailHeaderSkeleton() {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-white animate-pulse shrink-0">
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function DetailContentSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 rounded-lg" />
      <div className="flex gap-4 mt-4">
        <Skeleton className="w-32 h-20 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DetailHeaderSkeleton />
      <DetailContentSkeleton />
    </div>
  );
}

// ─── Form / Wizard ────────────────────────────────────────────────────────────

export function FormSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            {i < 2 && <Skeleton className="h-px w-12" />}
          </div>
        ))}
      </div>
      {/* Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}

// ─── Page-level (header + content block) ─────────────────────────────────────

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-9 w-28 rounded-lg" />
    </div>
  );
}

export function PageSkeleton({ tableRows = 5, tableCols = 5 }: { tableRows?: number; tableCols?: number }) {
  return (
    <div className="p-6 space-y-6">
      <PageHeaderSkeleton />
      {/* Filter bar */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-64 rounded-md" />
      </div>
      <TableSkeleton cols={tableCols} rows={tableRows} />
    </div>
  );
}

// ─── Dashboard chart card ─────────────────────────────────────────────────────

export function ChartCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-52 w-full rounded-lg mt-2" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <CardStatSkeletonGroup count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2.5 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

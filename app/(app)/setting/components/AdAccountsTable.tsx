"use client";

import { useState, useMemo, Key } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw, Search } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PaginationDto, PaginationFilter } from "@/types/api";

// ─── Mock data types ──────────────────────────────────────────────────────────

export type AdAccountPlatform = "google_ads" | "meta_ads";

export interface AdAccountRow {
  id: string;
  account_id: string;
  account_name: string;
  currency: string;
  timezone: string;
  status: "active" | "paused" | "inactive";
  platform: AdAccountPlatform;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: replace with real API call when backend is ready

const MOCK_GOOGLE: AdAccountRow[] = [];
const MOCK_META: AdAccountRow[] = [];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AdAccountRow["status"] }) {
  const map: Record<
    AdAccountRow["status"],
    { label: string; className: string }
  > = {
    active: {
      label: "Active",
      className:
        "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
    },
    paused: {
      label: "Paused",
      className:
        "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
    },
    inactive: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100"
    }
  };

  const { label, className } = map[status];
  return <Badge className={`text-xs font-medium ${className}`}>{label}</Badge>;
}

// ─── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<AdAccountRow, unknown>[] = [
  {
    accessorKey: "account_id",
    header: "Ad Account ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-700">
        {row.original.account_id}
      </span>
    )
  },
  {
    accessorKey: "account_name",
    header: "Account Name",
    cell: ({ row }) => (
      <span className="text-sm text-gray-900">{row.original.account_name}</span>
    )
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.currency}</span>
    )
  },
  {
    accessorKey: "timezone",
    header: "Timezone",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">{row.original.timezone}</span>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />
  }
];

// ─── Per-tab table ────────────────────────────────────────────────────────────

interface AdAccountTabTableProps {
  data: AdAccountRow[];
  onSync: () => void;
  isSyncing: boolean;
}

function AdAccountTabTable({
  data,
  onSync,
  isSyncing
}: AdAccountTabTableProps) {
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [paginationFilter, setPaginationFilter] = useState<PaginationFilter>({
    offset: 0,
    limit: 5
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (r) =>
        r.account_id.toLowerCase().includes(q) ||
        r.account_name.toLowerCase().includes(q) ||
        r.currency.toLowerCase().includes(q) ||
        r.timezone.toLowerCase().includes(q)
    );
  }, [data, search]);

  // Client-side pagination over filtered data
  const totalItems = filtered.length;
  const limit = paginationFilter.limit ?? 10;
  const offset = paginationFilter.offset ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const pageStart = offset;
  const pageData = filtered.slice(pageStart, pageStart + limit);

  const paginationDto: PaginationDto = {
    total: totalItems,
    total_pages: totalPages,
    current_page: Math.floor(offset / limit) + 1,
    per_page: limit
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // reset to page 1 on new search
              setPaginationFilter((p) => ({ ...p, offset: 0 }));
            }}
            className="pl-9 h-9 text-sm bg-white border-gray-200"
          />
        </div>

        <Button
          size="sm"
          className="bg-gray-900 hover:bg-gray-800 text-white gap-2 h-9 px-4 text-sm"
          onClick={onSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          Sync Accounts
        </Button>
      </div>

      {/* Table */}
      <DataTable<AdAccountRow>
        columns={columns}
        data={pageData}
        emptyText="No items found"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          getRowKey: (row) => row.id
        }}
        pagination={{
          paginationDto,
          paginationFilter,
          setPaginationFilter,
          setSelectedRowKeys
        }}
      />

      {/* Footer row count */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1 -mt-2">
        <span>
          {selectedRowKeys.length} of {totalItems} Row(s) Selected.
        </span>
      </div>
    </div>
  );
}

// ─── AdAccountsTable ──────────────────────────────────────────────────────────

interface AdAccountsTableProps {
  onSyncGoogle: () => void;
  onSyncMeta: () => void;
  isSyncingGoogle?: boolean;
  isSyncingMeta?: boolean;
}

export function AdAccountsTable({
  onSyncGoogle,
  onSyncMeta,
  isSyncingGoogle = false,
  isSyncingMeta = false
}: AdAccountsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      <h3 className="text-base font-semibold text-gray-900">
        Connected Ad Accounts
      </h3>

      <Tabs defaultValue="google_ads">
        <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-2 justify-start gap-0">
          <TabsTrigger
            value="google_ads"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-purple-600 "
          >
            <span className="text-base font-light text-gray-500">
              Google Ads
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="meta_ads"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-purple-600 "
          >
            <span className="text-base font-light text-gray-500">Meta Ads</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google_ads" className="pt-4">
          <AdAccountTabTable
            data={MOCK_GOOGLE}
            onSync={onSyncGoogle}
            isSyncing={isSyncingGoogle}
          />
        </TabsContent>

        <TabsContent value="meta_ads" className="pt-4">
          <AdAccountTabTable
            data={MOCK_META}
            onSync={onSyncMeta}
            isSyncing={isSyncingMeta}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState, useMemo, Key } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetStrategyPlanners,
  useDeleteStrategyPlanner,
} from "./hooks/useStrategyPlanner";
import type { StrategyPlannerFilter, StrategyPlannerTableRow } from "./types";
import type { ApiResponsePagination, PaginationFilter } from "@/types/api";

export default function StrategyPlannerPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [filter, setFilter] = useState<StrategyPlannerFilter>({
    page: 1,
    limit: 5,
    search: "",
  });

  const { data, isLoading } = useGetStrategyPlanners(filter);
  const deleteMutation = useDeleteStrategyPlanner();

  const apiData = data as
    | ApiResponsePagination<StrategyPlannerTableRow[]>
    | undefined;
  const rows = useMemo(() => apiData?.data ?? [], [apiData]);

  const paginationFilter: PaginationFilter = useMemo(
    () => ({
      page: filter.page ?? 1,
      perPage: filter.limit ?? 5,
      search: filter.search,
    }),
    [filter],
  );

  const paginationDto = useMemo(
    () => ({
      total: apiData?.total ?? 0,
      current_page: filter.page ?? 1,
      per_page: filter.limit ?? 5,
      total_pages: Math.ceil((apiData?.total ?? 0) / (filter.limit ?? 5)),
    }),
    [apiData?.total, filter],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilter((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns: ColumnDef<StrategyPlannerTableRow>[] = [
    {
      accessorKey: "title",
      header: "Campaign Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      id: "brand_name",
      header: "Brand Name",
      accessorFn: (row) => row.brand?.name ?? "-",
    },
    {
      accessorKey: "planner_type",
      header: "Objective",
    },
    {
      id: "total_budget",
      header: "Total Budget",
      accessorFn: (row) =>
        row.budget?.amount
          ? new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(row.budget.amount)
          : "-",
    },
    {
      id: "budget_type",
      header: "Budget Type",
      accessorFn: (row) =>
        row.budget?.type
          ? row.budget.type.charAt(0).toUpperCase() + row.budget.type.slice(1)
          : "-",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/strategy-planner/${row.original.id}/detail`)
              }
            >
              Detail
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() =>
                router.push(`/strategy-planner/${row.original.id}/edit`)
              }
            >
              Edit
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Strategy Planner</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 justify-between">
        <div className="flex items-center gap-4">
          <select
            className="h-10 px-3 rounded-md border bg-background text-sm"
            value={filter.limit}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                limit: Number(e.target.value),
                page: 1,
              }))
            }
          >
            <option value={5}>5 Rows</option>
            <option value={10}>10 Rows</option>
            <option value={25}>25 Rows</option>
            <option value={50}>50 Rows</option>
          </select>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 h-10"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedRowKeys.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                selectedRowKeys.forEach((id) => handleDelete(String(id)));
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedRowKeys.length})
            </Button>
          )}
          <Button
            onClick={() => router.push("/strategy-planner/create")}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={rows}
        columns={columns}
        isLoading={isLoading}
        enableSorting
        isStriped
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          paginationDto,
          paginationFilter,
          setPaginationFilter: (newFilter) =>
            setFilter((prev) => ({
              ...prev,
              page: newFilter.page,
              limit: newFilter.perPage,
              search: newFilter.search,
            })),
        }}
      />
    </div>
  );
}

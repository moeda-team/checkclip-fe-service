"use client";

import { useState, useRef, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search, Columns3 } from "lucide-react";
import { Key } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CustomerData {
  id: string;
  customerId: string;
  fullName: string;
  age: number;
  gender: string;
  companyName: string;
  jobTitle: string;
  email: string;
}

// ── Column definitions (all possible columns) ─────────────────────────────────

export const ALL_COLUMN_KEYS = [
  "customerId",
  "fullName",
  "age",
  "gender",
  "companyName",
  "jobTitle",
  "email"
] as const;

export type ColumnKey = (typeof ALL_COLUMN_KEYS)[number];

const COLUMN_LABELS: Record<ColumnKey, string> = {
  customerId: "Customer ID",
  fullName: "Full Name",
  age: "Age",
  gender: "Gender",
  companyName: "Company Name",
  jobTitle: "Job Title",
  email: "Email"
};

const DEFAULT_VISIBLE: ColumnKey[] = [
  "customerId",
  "fullName",
  "age",
  "gender",
  "companyName",
  "jobTitle",
  "email"
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface CustomerDataTableProps {
  data: CustomerData[];
  isLoading?: boolean;
  selectedRowKeys: Key[];
  onSelectionChange: (keys: Key[]) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (val: number) => void;
  pagination: {
    paginationDto: { total: number; total_pages: number };
    paginationFilter: { offset: number; limit: number };
    setPaginationFilter: (f: { offset: number; limit: number }) => void;
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CustomerDataTable({
  data,
  isLoading,
  selectedRowKeys,
  onSelectionChange,
  onDelete,
  onAddNew,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  rowsPerPage,
  onRowsPerPageChange,
  pagination
}: CustomerDataTableProps) {
  const [visibleColumns, setVisibleColumns] =
    useState<ColumnKey[]>(DEFAULT_VISIBLE);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inputVal, setInputVal] = useState(search);

  useEffect(() => {
    setInputVal(search);
  }, [search]);

  const handleSearchInput = (val: string) => {
    setInputVal(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearchChange(val), 400);
  };

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Build columns dynamically based on visibleColumns
  const columns: ColumnDef<CustomerData, unknown>[] = ALL_COLUMN_KEYS.filter(
    (key) => visibleColumns.includes(key)
  ).map((key) => {
    // if (key === "status") {
    //   return {
    //     accessorKey: key,
    //     header: COLUMN_LABELS[key],
    //     cell: ({ getValue }) => {
    //       const val = getValue() as string;
    //       return (
    //         <Badge
    //           variant={val === "active" ? "default" : "secondary"}
    //           className={
    //             val === "active"
    //               ? "bg-green-100 text-green-700 hover:bg-green-100"
    //               : "bg-gray-100 text-gray-500 hover:bg-gray-100"
    //           }
    //         >
    //           {val.charAt(0).toUpperCase() + val.slice(1)}
    //         </Badge>
    //       );
    //     },
    //   };
    // }
    return {
      accessorKey: key,
      header: COLUMN_LABELS[key],
      enableSorting: true
    };
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left side */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Rows per page */}
          <Select
            value={String(rowsPerPage)}
            onValueChange={(v) => onRowsPerPageChange(Number(v))}
          >
            <SelectTrigger className="w-28 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} Rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-9 w-56"
              value={inputVal}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Column toggle */}
          <Popover>
            <PopoverContent className="w-52 p-3" align="end">
              <p className="text-sm font-medium mb-2">Toggle Columns</p>
              <div className="space-y-2">
                {ALL_COLUMN_KEYS.map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={visibleColumns.includes(key)}
                      onCheckedChange={() => toggleColumn(key)}
                    />
                    <span className="text-sm">{COLUMN_LABELS[key]}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Delete */}
          {selectedRowKeys.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="h-9"
              onClick={() =>
                selectedRowKeys.forEach((id) => onDelete(String(id)))
              }
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete ({selectedRowKeys.length})
            </Button>
          )}

          {/* Add New */}
          <Button
            size="sm"
            className="h-9 bg-gray-900 hover:bg-gray-800 text-white"
            onClick={onAddNew}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add New
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        enableSorting
        emptyText="No customer data found."
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => onSelectionChange(keys),
          getRowKey: (row) => row.id
        }}
        // pagination={pagination}
      />
    </div>
  );
}

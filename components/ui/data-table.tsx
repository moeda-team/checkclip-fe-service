/* eslint-disable react-hooks/incompatible-library */
"use client";

import { Key, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  RowSelectionState,
  getSortedRowModel,
  PaginationState,
  Updater
} from "@tanstack/react-table";
import { PaginationDto, PaginationFilter } from "@/types/api";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./table";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "./pagination";

export interface PaginationProps {
  paginationDto: PaginationDto;
  paginationFilter: PaginationFilter;
  setSelectedRowKeys?: (selectedRowKeys: Key[]) => void;
  setPaginationFilter: (paginationFilter: PaginationFilter) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  isStriped?: boolean;
  emptyText?: string;
  className?: string;
  enableSorting?: boolean;
  rowSelection?: {
    selectedRowKeys: Key[];
    onChange: (keys: Key[], rows: T[]) => void;
    getRowKey?: (row: T) => string;
    isRowSelectable?: (row: T) => boolean;
  };
  pagination?: PaginationProps;
  // Optional full-height element rendered flush against the right edge of the
  // table (e.g. an "add column" panel). The table border adapts when present.
  sidePanel?: React.ReactNode;
}

function DataTablePagination({ pagination }: { pagination: PaginationProps }) {
  const { paginationDto, paginationFilter, setPaginationFilter } = pagination;
  const limit = paginationFilter.limit ?? 10;
  const offset = paginationFilter.offset ?? 0;
  const currentPage = offset + 1;
  const totalPages = paginationDto.total_pages;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setPaginationFilter({
      ...paginationFilter,
      offset: page - 1
    });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => handlePageChange(page as number)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyText = "No data available",
  className = "",
  enableSorting = false,
  isStriped = false,
  rowSelection,
  pagination,
  sidePanel
}: DataTableProps<T>) {
  const getRowId =
    rowSelection?.getRowKey ??
    ((row: T) => {
      if (typeof row === "object" && row !== null) {
        const r = row as Record<string, unknown>;
        return String(r.id ?? r.key ?? "");
      }
      return "";
    });

  const isSelectable = (row: T): boolean =>
    rowSelection?.isRowSelectable ? rowSelection.isRowSelectable(row) : true;

  const rowSelectionState: RowSelectionState = rowSelection
    ? Object.fromEntries(
        rowSelection.selectedRowKeys.map((k) => [String(k), true])
      )
    : {};

  const table = useReactTable<T>({
    data,
    columns,
    getRowId,
    state: {
      rowSelection: rowSelectionState,
      pagination: pagination
        ? {
            pageIndex: pagination.paginationFilter.offset ?? 0,
            pageSize: pagination.paginationFilter.limit ?? 10
          }
        : undefined
    },
    enableRowSelection: (row) => isSelectable(row.original),
    onRowSelectionChange: (updater) => {
      if (!rowSelection) return;

      const next =
        typeof updater === "function" ? updater(rowSelectionState) : updater;

      const keys = Object.keys(next);
      const rows = data.filter((r) => keys.includes(getRowId(r)));

      rowSelection.onChange(keys, rows);
    },
    getCoreRowModel: getCoreRowModel(),
    enableSorting: enableSorting,
    enableMultiSort: true,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    rowCount: pagination ? pagination.paginationDto.total : undefined,
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const current = table.getState().pagination;
      const next = typeof updater === "function" ? updater(current) : updater;
      const page = next.pageIndex + 1;
      const pageSize = next.pageSize;

      pagination?.setPaginationFilter({
        ...pagination.paginationFilter,
        limit: pageSize,
        offset: page - 1
      });
    }
  });

  const selectableRows = table
    .getRowModel()
    .rows.filter((r) => isSelectable(r.original));
  const selectedCount = selectableRows.filter((r) => r.getIsSelected()).length;
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!rowSelection || !selectAllRef.current) return;

    const selectedCount = selectableRows.filter((r) =>
      r.getIsSelected()
    ).length;

    selectAllRef.current.indeterminate =
      selectedCount > 0 && selectedCount < selectableRows.length;
  }, [rowSelection?.selectedRowKeys, selectableRows.length, rowSelection]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-stretch">
        <div
          className={cn(
            "flex-1 overflow-auto rounded-md border",
            sidePanel && "rounded-r-none border-r-0"
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                {rowSelection && (
                  <TableHead className="w-12">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      disabled={selectableRows.length === 0}
                      checked={
                        selectableRows.length > 0 &&
                        selectableRows.every((r) => r.getIsSelected())
                      }
                      onChange={(e) =>
                        table.toggleAllRowsSelected(e.target.checked)
                      }
                      aria-label="Select all rows"
                      className="h-4 w-4 rounded border border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </TableHead>
                )}

                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      style={{
                        minWidth: (header.column.columnDef.meta as any)
                          ?.minWidth
                      }}
                    >
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {enableSorting && header.column.getCanSort() && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            {header.column.getIsSorted() === "asc" && (
                              <ArrowUp className="h-3.5 w-3.5" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ArrowDown className="h-3.5 w-3.5" />
                            )}
                            {header.column.getIsSorted() === false && (
                              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                    className="h-24"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <span className="text-muted-foreground text-sm">
                        Loading...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyText}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={`
                    ${
                      isStriped
                        ? index % 2 === 0
                          ? "bg-background"
                          : "bg-muted/30"
                        : ""
                    }
                  `}
                  >
                    {rowSelection && (
                      <TableCell>
                        <input
                          type="checkbox"
                          disabled={!isSelectable(row.original)}
                          checked={row.getIsSelected()}
                          onChange={(e) => row.toggleSelected(e.target.checked)}
                          aria-label="Select row"
                          className="h-4 w-4 rounded border border-primary disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </TableCell>
                    )}

                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {sidePanel}
      </div>

      <div className="flex items-center justify-between px-2">
        {rowSelection && selectableRows.length > 0 && (
          <div className="text-muted-foreground text-sm">
            {selectedCount} of {selectableRows.length} row(s) selected
          </div>
        )}

        {pagination &&
          pagination.paginationDto.total > 0 &&
          data.length > 0 && (
            <div
              className={
                rowSelection && selectableRows.length > 0 ? "" : "ml-auto"
              }
            >
              <DataTablePagination pagination={pagination} />
            </div>
          )}
      </div>
    </div>
  );
}

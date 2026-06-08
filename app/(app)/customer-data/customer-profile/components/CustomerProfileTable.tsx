"use client";

import { useMemo, useRef, useState, type Key } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  useGetCustomers,
  usePutCustomer,
  usePostCustomer,
  useDeleteCustomer
} from "../../hooks/useCustomers";
import { useGetCustomerFields } from "../../hooks/useCustomerFields";
import { AddCustomFieldDialog } from "./AddCustomFieldDialog";
import { EditableCell } from "./EditableCell";
import type {
  CustomerCustomFieldValue,
  CustomerDto,
  CustomerFieldDto,
  CustomerFieldType,
  CustomerFormDto
} from "@/types/type-customer";
import type {
  ApiResponsePagination,
  PaginationDto,
  PaginationFilter
} from "@/types/api";

// ─── Static (built-in) columns ─────────────────────────────────────────────────

type StaticColumn = {
  id: string;
  label: string;
  type: CustomerFieldType;
  editable?: boolean;
  accessor: (row: CustomerDto) => CustomerCustomFieldValue | undefined;
};

const STATIC_COLUMNS: StaticColumn[] = [
  {
    id: "id",
    label: "Customer id",
    type: "text",
    editable: false,
    accessor: (r) => r.id
  },
  {
    id: "full_name",
    label: "Full Name",
    type: "text",
    accessor: (r) => r.full_name
  },
  { id: "age", label: "Age", type: "number", accessor: (r) => r.age },
  { id: "gender", label: "Gender", type: "text", accessor: (r) => r.gender },
  {
    id: "company_name",
    label: "Company Name",
    type: "text",
    accessor: (r) => r.company_name
  },
  {
    id: "job_title",
    label: "Job Title",
    type: "text",
    accessor: (r) => r.job_title
  },
  { id: "email", label: "Email", type: "text", accessor: (r) => r.email }
];

// Customer IDs rendered on the frontend (not provided by the API).
// Generated dynamically from the row index, zero-padded to 3 digits.
function getStaticCustomerId(index: number): string {
  return String(index + 1).padStart(3, "0");
}

// Prefix used to identify rows that only exist locally (not yet persisted).
const DRAFT_ID_PREFIX = "draft-";

const isDraftRow = (customer: CustomerDto): boolean =>
  customer.id.startsWith(DRAFT_ID_PREFIX);

// Build a create payload from a (possibly partial) draft customer.
const buildCreateForm = (draft: CustomerDto): CustomerFormDto => ({
  full_name: draft.full_name ?? "",
  email: draft.email ?? "",
  age: draft.age,
  gender: draft.gender,
  company_name: draft.company_name,
  job_title: draft.job_title,
  custom_fields: draft.custom_fields ?? {}
});

export function CustomerProfileTable() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PaginationFilter>({
    page: 1,
    perPage: 10,
    search: ""
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  // Locally-added rows that have not been persisted to the API yet.
  const [draftRows, setDraftRows] = useState<CustomerDto[]>([]);
  // Guards against firing duplicate POSTs for the same draft while in flight.
  const pendingDraftIds = useRef<Set<string>>(new Set());

  const { data: customersData, isLoading: customersLoading } =
    useGetCustomers(filter);
  const { data: fieldsData, isLoading: fieldsLoading } = useGetCustomerFields();

  const apiData = customersData as
    | ApiResponsePagination<CustomerDto[]>
    | undefined;

  const serverRows = useMemo(() => apiData?.data ?? [], [apiData]);
  // Server rows first, local draft rows appended at the bottom.
  const rows = useMemo(
    () => [...serverRows, ...draftRows],
    [serverRows, draftRows]
  );

  const customFields = useMemo<CustomerFieldDto[]>(() => {
    const list = fieldsData?.data ?? [];
    return [...list].sort((a, b) => a.display_order - b.display_order);
  }, [fieldsData]);

  const total = apiData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filter.perPage));

  const { mutate: updateCustomer } = usePutCustomer();
  const { mutate: createCustomer, isPending: isCreating } = usePostCustomer();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  // Add a blank draft row locally; it is only POSTed once the user edits a cell.
  const handleAddRow = () => {
    const tempId = `${DRAFT_ID_PREFIX}${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    setDraftRows((prev) => [
      ...prev,
      {
        id: tempId,
        tenant_id: "",
        full_name: "",
        email: "",
        custom_fields: {}
      }
    ]);
  };

  // Delete each selected (persisted) customer via DELETE /crm/customer/{id}.
  const handleDeleteSelected = () => {
    selectedRowKeys
      .map(String)
      .filter((id) => !id.startsWith(DRAFT_ID_PREFIX))
      .forEach((id) => deleteCustomer(id));
    // Drop any selected draft rows locally.
    setDraftRows((prev) =>
      prev.filter((d) => !selectedRowKeys.map(String).includes(d.id))
    );
    setSelectedRowKeys([]);
  };

  // Persist a draft row via POST /crm/customer on first inline edit.
  const persistDraft = (draft: CustomerDto, updated: CustomerDto) => {
    // Reflect the edit locally so the input keeps its value while saving.
    setDraftRows((prev) => prev.map((d) => (d.id === draft.id ? updated : d)));

    if (pendingDraftIds.current.has(draft.id)) return;
    pendingDraftIds.current.add(draft.id);

    createCustomer(buildCreateForm(updated), {
      onSuccess: () => {
        setDraftRows((prev) => prev.filter((d) => d.id !== draft.id));
      },
      onSettled: () => {
        pendingDraftIds.current.delete(draft.id);
      }
    });
  };

  // Persist an edit to a built-in (top-level) customer field.
  const saveStaticValue = (
    customer: CustomerDto,
    key: string,
    value: CustomerCustomFieldValue
  ) => {
    if (isDraftRow(customer)) {
      persistDraft(customer, { ...customer, [key]: value } as CustomerDto);
      return;
    }
    updateCustomer({
      id: customer.id,
      form: { [key]: value } as Partial<CustomerFormDto>
    });
  };

  // Persist an edit to a dynamic custom field stored under custom_fields.
  const saveCustomValue = (
    customer: CustomerDto,
    fieldKey: string,
    value: CustomerCustomFieldValue
  ) => {
    const nextCustomFields = {
      ...(customer.custom_fields ?? {}),
      [fieldKey]: value
    };
    if (isDraftRow(customer)) {
      persistDraft(customer, { ...customer, custom_fields: nextCustomFields });
      return;
    }
    updateCustomer({
      id: customer.id,
      form: { custom_fields: nextCustomFields }
    });
  };

  // Build static + dynamic custom-field columns for the shared DataTable.
  const columns = useMemo<ColumnDef<CustomerDto, unknown>[]>(() => {
    // Frontend-only column with hard-coded customer IDs.
    const idColumn: ColumnDef<CustomerDto, unknown> = {
      id: "customer_id",
      header: "Customer id",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-medium">{getStaticCustomerId(row.index)}</span>
      )
    };

    const staticDefs: ColumnDef<CustomerDto, unknown>[] = STATIC_COLUMNS.filter(
      (col) => col.id !== "id"
    ).map((col) => ({
      id: col.id,
      header: col.label,
      accessorFn: (row) => col.accessor(row),
      cell: ({ row }) => (
        <div className={col.id === "full_name" ? "font-medium" : ""}>
          <EditableCell
            value={col.accessor(row.original)}
            fieldType={col.type}
            editable={col.editable ?? true}
            onSave={(value) => saveStaticValue(row.original, col.id, value)}
          />
        </div>
      )
    }));

    const customDefs: ColumnDef<CustomerDto, unknown>[] = customFields.map(
      (field) => ({
        id: field.field_key,
        header: field.field_label,
        accessorFn: (row) => row.custom_fields?.[field.field_key],
        cell: ({ row }) => (
          <EditableCell
            value={row.original.custom_fields?.[field.field_key]}
            fieldType={field.field_type}
            options={field.options}
            onSave={(value) =>
              saveCustomValue(row.original, field.field_key, value)
            }
          />
        )
      })
    );

    return [idColumn, ...staticDefs, ...customDefs];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customFields]);

  const paginationDto: PaginationDto = useMemo(
    () => ({
      total,
      current_page: filter.page,
      per_page: filter.perPage,
      total_pages: totalPages
    }),
    [total, filter.page, filter.perPage, totalPages]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilter((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const isLoading = customersLoading || fieldsLoading;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="h-10 px-3 rounded-md border bg-background text-sm"
            value={filter.perPage}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                perPage: Number(e.target.value),
                page: 1
              }))
            }
          >
            <option value={5}>5 Rows</option>
            <option value={10}>10 Rows</option>
            <option value={25}>25 Rows</option>
            <option value={50}>50 Rows</option>
          </select>
          <div className="relative w-72 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-10 h-10"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleAddRow}
            disabled={isCreating}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isCreating ? "Adding..." : "Add Row"}
          </Button>

          {selectedRowKeys.length > 0 && (
            <Button
              type="button"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-red-400 hover:bg-red-500 text-white"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {isDeleting
                ? "Deleting..."
                : `Delete (${selectedRowKeys.length})`}
            </Button>
          )}
        </div>
      </div>

      {/* Shared DataTable with dynamic columns + side add-column panel */}
      <DataTable<CustomerDto>
        data={rows}
        columns={columns}
        isLoading={isLoading}
        enableSorting
        emptyText="No customers found"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        pagination={{
          paginationDto,
          paginationFilter: filter,
          setPaginationFilter: (next) => setFilter(next)
        }}
        sidePanel={
          <AddCustomFieldDialog
            nextDisplayOrder={customFields.length}
            trigger={
              <button
                type="button"
                aria-label="Add custom field"
                className="flex w-16 shrink-0 items-center justify-center rounded-r-md border border-l-0 bg-primary-50 text-primary-600 transition-colors hover:bg-primary-100"
              >
                <Plus className="h-5 w-5" />
              </button>
            }
          />
        }
      />
    </div>
  );
}

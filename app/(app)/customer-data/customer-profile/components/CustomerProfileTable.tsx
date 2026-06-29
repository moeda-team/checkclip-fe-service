"use client";

import { useEffect, useMemo, useRef, useState, type Key } from "react";
import { Plus, PlusCircle, Search, Trash2, Columns2 } from "lucide-react";
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
import {
  useGetCustomerFields,
  usePutCustomerField,
  useDeleteCustomerField
} from "../../hooks/useCustomerFields";
import { AddCustomFieldDialog } from "./AddCustomFieldDialog";
import { TableSettings } from "./TableSettings";
import { EditableCell } from "./EditableCell";
import type {
  CustomerCustomFieldValue,
  CustomerDto,
  CustomerFieldDto,
  CustomerFieldFormDto,
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
  // {
  //   id: "id",
  //   label: "Customer id",
  //   type: "text",
  //   editable: false,
  //   accessor: (r) => r.id
  // },
  // {
  //   id: "full_name",
  //   label: "Full Name",
  //   type: "text",
  //   accessor: (r) => r.full_name
  // },
  // { id: "age", label: "Age", type: "number", accessor: (r) => r.age },
  // { id: "gender", label: "Gender", type: "text", accessor: (r) => r.gender },
  // {
  //   id: "company_name",
  //   label: "Company Name",
  //   type: "text",
  //   accessor: (r) => r.company_name
  // },
  // {
  //   id: "job_title",
  //   label: "Job Title",
  //   type: "text",
  //   accessor: (r) => r.job_title
  // },
  // { id: "email", label: "Email", type: "text", accessor: (r) => r.email }
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
    offset: 0,
    limit: 10,
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
  const limit = filter.limit ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const { mutate: updateCustomer } = usePutCustomer();
  const { mutate: createCustomer, isPending: isCreating } = usePostCustomer();
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
  const { mutate: updateField } = usePutCustomerField();
  const { mutate: deleteField } = useDeleteCustomerField();

  // Order and visibility of all columns (static + custom). Static columns are
  // always shown first in a fixed order; only custom-field order is synced to
  // the backend via PUT /customer-field/{id}.
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>([]);

  // Sync order/visibility with the fetched custom fields.
  useEffect(() => {
    // const staticIds = [
    //   "customer_id",
    //   "full_name",
    //   "age",
    //   "gender",
    //   "company_name",
    //   "job_title",
    //   "email"
    // ];
    const customIds = customFields.map((f) => f.field_key);
    const allIds = [...customIds];

    setColumnOrder((prev) => {
      const ordered = prev.filter((id) => allIds.includes(id));
      const newIds = allIds.filter((id) => !ordered.includes(id));
      return [...ordered, ...newIds];
    });

    setVisibleColumnIds((prev) => {
      if (prev.length === 0) return allIds;
      const existingVisible = prev.filter((id) => allIds.includes(id));
      const newIds = allIds.filter((id) => !prev.includes(id));
      return [...existingVisible, ...newIds];
    });
  }, [customFields]);

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

  // ─── Column builders ────────────────────────────────────────────────────────

  // const idColumn: ColumnDef<CustomerDto, unknown> = useMemo(
  //   () => ({
  //     id: "customer_id",
  //     header: "Customer id",
  //     enableSorting: false,
  //     cell: ({ row }) => (
  //       <span className="font-medium">{getStaticCustomerId(row.index)}</span>
  //     )
  //   }),
  //   []
  // );

  const buildStaticColumn = (
    col: StaticColumn
  ): ColumnDef<CustomerDto, unknown> => ({
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
  });

  const buildCustomColumn = (
    field: CustomerFieldDto
  ): ColumnDef<CustomerDto, unknown> => ({
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
  });

  // Reorderable metadata for all columns (static + custom). Used by the
  // TableSettings popover for drag-and-drop and visibility toggles.
  const columnItems = useMemo(() => {
    // const staticItems = STATIC_COLUMNS.filter((c) => c.id !== "id").map(
    //   (c) => ({
    //     id: c.id,
    //     label: c.label,
    //     source: "static" as const,
    //     staticColumn: c
    //   })
    // );
    // const staticIds = new Set(STATIC_COLUMNS.map((c) => c.id));
    const customItems = customFields
      // .filter((f) => !staticIds.has(f.field_key))
      .map((f) => ({
        id: f.field_key,
        label: f.field_label,
        source: "custom" as const,
        field: f
      }));
    return [
      // { id: "customer_id", label: "Customer id", source: "id" as const },
      // ...staticItems,
      ...customItems
    ];
  }, [customFields]);

  const orderedItems = useMemo(() => {
    if (columnOrder.length === 0) return columnItems;
    const orderMap = new Map(columnOrder.map((id, index) => [id, index]));
    return [...columnItems].sort((a, b) => {
      const orderA = orderMap.get(a.id) ?? Infinity;
      const orderB = orderMap.get(b.id) ?? Infinity;
      return orderA - orderB;
    });
  }, [columnItems, columnOrder]);

  // Final tanstack columns, filtered by visibility.
  const columns = useMemo<ColumnDef<CustomerDto, unknown>[]>(
    () =>
      orderedItems
        .filter((item) => visibleColumnIds.includes(item.id))
        .map((item) => {
          // if (item.source === "id") return idColumn;
          // if (item.source === "static")
          //   return buildStaticColumn(item.staticColumn);
          return buildCustomColumn(item.field);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderedItems, visibleColumnIds]
  );

  // Reorder handler: update local order and persist custom-field positions.
  //
  // Only custom fields are persisted (static columns are frontend-only). We use
  // the single PUT /customer-field/{id} endpoint, so we minimize calls by:
  //  1. Skipping entirely when the custom-field order did not change (e.g. only
  //     a static column moved, or a no-op drag).
  //  2. Reusing the backend's existing display_order values (preserving its
  //     numbering scheme) and only PUTting fields whose value actually changes.
  const handleReorder = (newOrder: string[]) => {
    setColumnOrder(newOrder);

    const fieldByKey = new Map(customFields.map((f) => [f.field_key, f]));

    // Custom fields in their new visual order.
    const nextCustomOrder = newOrder
      .filter((id) => fieldByKey.has(id))
      .map((id) => fieldByKey.get(id)!);

    // Custom fields in their currently persisted order.
    const currentCustomOrder = [...customFields].sort(
      (a, b) => a.display_order - b.display_order
    );

    // No change to the custom-field order → no API calls.
    const unchanged =
      nextCustomOrder.length === currentCustomOrder.length &&
      nextCustomOrder.every(
        (f, i) => f.field_key === currentCustomOrder[i]?.field_key
      );
    if (unchanged) return;

    // Keep the existing display_order values and just reassign them to the new
    // slots, so we don't care whether the backend is 0- or 1-based.
    const slotOrders = currentCustomOrder.map((f) => f.display_order);

    nextCustomOrder.forEach((field, index) => {
      const nextDisplayOrder = slotOrders[index];
      if (field.display_order === nextDisplayOrder) return;

      const form: CustomerFieldFormDto = {
        field_key: field.field_key,
        field_label: field.field_label,
        field_type: field.field_type,
        is_required: field.is_required,
        display_order: nextDisplayOrder,
        options: field.options
      };
      updateField({ id: field.id, form });
    });
  };

  // Rename a custom column via PUT /customer-field/{id} (custom columns only).
  const handleRenameColumn = (fieldKey: string, label: string) => {
    const field = customFields.find((f) => f.field_key === fieldKey);
    if (!field) return;

    const form: CustomerFieldFormDto = {
      field_key: field.field_key,
      field_label: label,
      field_type: field.field_type,
      is_required: field.is_required,
      display_order: field.display_order,
      options: field.options
    };
    updateField({ id: field.id, form });
  };

  // Delete a custom column via DELETE /customer-field/{id} (custom columns only).
  const handleDeleteColumn = (fieldKey: string) => {
    const field = customFields.find((f) => f.field_key === fieldKey);
    if (!field) return;
    deleteField(field.id);
    setColumnOrder((prev) => prev.filter((id) => id !== fieldKey));
    setVisibleColumnIds((prev) => prev.filter((id) => id !== fieldKey));
  };

  const paginationDto: PaginationDto = useMemo(
    () => ({
      total,
      current_page: Math.floor((filter.offset ?? 0) / limit) + 1,
      per_page: limit,
      total_pages: totalPages
    }),
    [total, filter.offset, limit, totalPages]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilter((prev) => ({ ...prev, search: value, offset: 0 }));
  };

  const isLoading = customersLoading || fieldsLoading;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="h-10 px-3 rounded-md border bg-background text-sm"
            value={filter.limit}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                limit: Number(e.target.value),
                offset: 0
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
          <TableSettings
            columns={orderedItems.map((item) => ({
              id: item.id,
              label: item.label,
              isCustom: item.source === "custom"
            }))}
            onReorder={handleReorder}
            onRenameColumn={handleRenameColumn}
            onDeleteColumn={handleDeleteColumn}
            addColumnTrigger={
              <AddCustomFieldDialog
                nextDisplayOrder={customFields.length}
                trigger={
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <span className="flex items-center gap-2">
                      <Columns2 className="h-4 w-4 text-muted-foreground" />
                      Add Column
                    </span>
                    <PlusCircle className="h-4 w-4 text-muted-foreground" />
                  </button>
                }
              />
            }
          />

          <Button
            type="button"
            onClick={handleAddRow}
            disabled={isCreating}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isCreating ? "Adding..." : "Add New"}
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

      {/* Shared DataTable with dynamic columns */}
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
      />
    </div>
  );
}

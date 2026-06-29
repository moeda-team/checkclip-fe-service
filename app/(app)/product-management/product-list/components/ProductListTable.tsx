"use client";

import { DataTable } from "@/components/ui/data-table";
import {
  useDeleteBulkProduct,
  useDeleteProduct,
  useGetProducts
} from "../../hooks/useProducts";
import { Key, useEffect, useMemo, useState } from "react";
import { ApiResponsePagination, PaginationFilter } from "@/types/api";
import { ColumnDef } from "@tanstack/react-table";
import { ProductDto } from "@/types/type-product";
import PerPageSelector from "@/components/table/PerPageSelector";
import { EyeIcon, Trash2 } from "lucide-react";
import AddRowButton from "@/components/table/AddRowButton";
import DeleteRowButton from "@/components/table/DeleteRowButton";
import { Button } from "@/components/ui/button";
import DeleteConfModal from "../../../../../components/modal/DeleteConfModal";
import StatusModal from "@/components/modal/StatusModal";
import SearchInput from "@/components/table/SearchInput";
import ProductFormModal from "./ProductFormModal";

export default function ProductListTable() {
  const [search, setSearch] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [filter, setFilter] = useState<PaginationFilter>({
    offset: 0,
    limit: 10,
    search: ""
  });
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [statusHandle, setStatusHandle] = useState<string>("");
  const [deleteMode, setDeleteMode] = useState<"single" | "bulk">("single");

  const { data, isLoading } = useGetProducts(filter);
  const { mutate: deleteMutate, isPending: deletePending } = useDeleteProduct();
  const { mutate: deleteBulkMutate, isPending: deleteBulkPending } =
    useDeleteBulkProduct();

  const columns: ColumnDef<ProductDto>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      meta: { minWidth: 200 }
    },
    {
      id: "product_category",
      header: "Product Category",
      meta: { minWidth: 200 },
      accessorFn: (row) => row.category?.name ?? "-"
    },
    {
      accessorKey: "brand",
      header: "Brand",
      meta: { minWidth: 200 }
    },
    {
      accessorKey: "description",
      header: "Product Description",
      meta: { minWidth: 200 }
    },
    {
      accessorKey: "",
      header: "Image",
      meta: { minWidth: 100 }
    },
    {
      accessorKey: "",
      header: "Video",
      meta: { minWidth: 100 }
    },
    {
      accessorKey: "price",
      header: "Price",
      meta: { minWidth: 200 }
    },
    {
      id: "tags",
      header: "Tags",
      meta: { minWidth: 200 },
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 px-1 max-w-50 overflow-x-scroll scroll-hidden">
            {row.original.tags.map((tag, index) => (
              <span
                key={typeof tag === "string" ? index : (tag as any).id}
                className="inline-flex items-center gap-0.5 rounded-full bg-[#1717171A] px-2 h-5 text-xs font-medium text-gray-800"
              >
                {typeof tag === "string" ? tag : (tag as any).tag}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: "",
      header: "Last Update",
      meta: { minWidth: 120 }
    },
    {
      id: "industry",
      header: "Industry",
      meta: { minWidth: 200 },
      accessorFn: (row) => row.industry?.name ?? "-"
    },
    {
      id: "actions",
      header: "Action",
      meta: { minWidth: 85 },
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex gap-2.5">
            <Button
              variant="dark"
              className="w-7 h-7 flex items-center justify-center rounded-md"
            >
              <EyeIcon size={16} color="white" />
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteId(id);
                setDeleteMode("single");
                setIsOpenDeleteModal(true);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-md"
            >
              <Trash2 size={16} color="white" />
            </Button>
          </div>
        );
      }
    }
  ];

  const apiData = data as ApiResponsePagination<ProductDto[]> | undefined;
  const rows = useMemo(() => apiData?.data ?? [], [apiData]);

  const paginationFilter: PaginationFilter = useMemo(
    () => ({
      offset: filter.offset ?? 0,
      limit: filter.limit ?? 10,
      search: filter.search
    }),
    [filter]
  );

  const paginationDto = useMemo(
    () => ({
      total: apiData?.total ?? 0,
      current_page: Math.floor((filter.offset ?? 0) / (filter.limit ?? 10)) + 1,
      per_page: filter.limit ?? 10,
      total_pages: Math.ceil((apiData?.total ?? 0) / (filter.limit ?? 10))
    }),
    [apiData?.total, filter]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilter((prev) => ({ ...prev, search: value, offset: 0 }));
  };

  const handleDelete = () => {
    const mutationOptions = {
      onSuccess: () => setStatusHandle("success-delete"),
      onError: () => setStatusHandle("error-delete"),
      onSettled: () => {
        setIsOpenDeleteModal(false);
        setDeleteId("");
      }
    };

    if (deleteMode === "bulk") {
      deleteBulkMutate({ product_ids: selectedRowKeys }, mutationOptions);
    } else if (deleteMode === "single" && deleteId) {
      deleteMutate(deleteId, mutationOptions);
    }
  };
  useEffect(() => {
    if (!isOpenDeleteModal) {
      setDeleteId("");
    }
  }, [isOpenDeleteModal]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-4 mb-4 h-9">
          <PerPageSelector filter={filter} setFilter={setFilter} />

          <div className="border-l border-border h-9" />

          <SearchInput search={search} handleSearch={handleSearch} />
        </div>

        <div className="space-x-4">
          <AddRowButton handleAddRow={() => setIsOpenAddModal(true)} />
          <DeleteRowButton
            disabled={selectedRowKeys.length === 0}
            handleDeleteRow={() => {
              setDeleteMode("bulk");
              setIsOpenDeleteModal(true);
            }}
          />
        </div>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        isLoading={isLoading}
        enableSorting
        isStriped
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        pagination={{
          paginationDto,
          paginationFilter,
          setPaginationFilter: (newFilter) =>
            setFilter((prev) => ({
              ...prev,
              offset: newFilter.offset,
              limit: newFilter.limit,
              search: newFilter.search
            }))
        }}
      />

      <ProductFormModal
        isOpen={isOpenAddModal}
        onClose={() => setIsOpenAddModal(false)}
        setStatusHandle={setStatusHandle}
      />

      <DeleteConfModal
        isOpen={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        handleDelete={handleDelete}
        isLoading={deletePending || deleteBulkPending}
      />

      <StatusModal
        isOpen={statusHandle === "success-delete"}
        variant="success"
        title="Product Deleted Successfully"
        description="The product has been deleted successfully."
        onClose={() => setStatusHandle("")}
      />

      <StatusModal
        isOpen={
          statusHandle === "error-delete" || statusHandle === "error-create"
        }
        variant="error"
        onClose={() => setStatusHandle("")}
      />

      <StatusModal
        isOpen={statusHandle === "success-create"}
        variant="success"
        title="Product Added Successfully"
        description="The product has been added successfully."
        onClose={() => setStatusHandle("")}
      />
    </div>
  );
}

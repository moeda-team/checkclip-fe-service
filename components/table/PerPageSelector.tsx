import { PaginationFilter } from "@/types/api";
import React, { SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function PerPageSelector({
  filter,
  setFilter,
}: {
  filter: PaginationFilter;
  setFilter: React.Dispatch<SetStateAction<PaginationFilter>>;
}) {
  return (
    <Select
      value={String(filter.limit)}
      onValueChange={(value) =>
        setFilter((prev) => ({
          ...prev,
          limit: Number(value),
          page: 1,
        }))
      }
    >
      <SelectTrigger className="w-28 border border-border shadow-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="5">5 Rows</SelectItem>
        <SelectItem value="10">10 Rows</SelectItem>
        <SelectItem value="25">25 Rows</SelectItem>
        <SelectItem value="50">50 Rows</SelectItem>
      </SelectContent>
    </Select>
  );
}

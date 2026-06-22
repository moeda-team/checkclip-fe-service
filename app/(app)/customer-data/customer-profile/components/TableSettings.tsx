"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GripVertical,
  Columns2,
  Search,
  Pencil,
  Trash2,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";

export type TableSettingsColumn = {
  id: string;
  label: string;
  isCustom: boolean;
};

type TableSettingsProps = {
  columns: TableSettingsColumn[];
  onReorder: (newOrder: string[]) => void;
  onRenameColumn: (id: string, label: string) => void;
  onDeleteColumn: (id: string) => void;
  addColumnTrigger: React.ReactNode;
};

export function TableSettings({
  columns,
  onReorder,
  onRenameColumn,
  onDeleteColumn,
  addColumnTrigger
}: TableSettingsProps) {
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [localColumns, setLocalColumns] = useState(columns);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TableSettingsColumn | null>(
    null
  );

  // Sync local order with props whenever the popover opens or columns change.
  useEffect(() => {
    setLocalColumns(columns);
  }, [columns, open]);

  // Filter by search. Dragging is only allowed when not filtering so indices
  // map correctly to the underlying order.
  const isSearching = search.trim().length > 0;
  const visibleRows = useMemo(() => {
    if (!isSearching) return localColumns;
    const q = search.trim().toLowerCase();
    return localColumns.filter((c) => c.label.toLowerCase().includes(q));
  }, [localColumns, search, isSearching]);

  const startRename = (column: TableSettingsColumn) => {
    setEditingId(column.id);
    setEditLabel(column.label);
  };

  const saveRename = () => {
    const trimmed = editLabel.trim();
    if (editingId && trimmed) onRenameColumn(editingId, trimmed);
    setEditingId(null);
  };

  const cancelRename = () => setEditingId(null);

  const confirmDelete = () => {
    if (deleteTarget) onDeleteColumn(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleDragStart = (index: number) => {
    if (!localColumns[index]?.isCustom) return;
    setDragIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    if (!localColumns[index]?.isCustom) return;

    setLocalColumns((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    if (dragIndex !== null) {
      onReorder(localColumns.map((c) => c.id));
    }
    setDragIndex(null);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-2 border-gray-200"
          >
            <Columns2 className="h-4 w-4" />
            Columns
            <Badge className="h-5 min-w-5 px-1.5 rounded-md text-xs bg-primary text-primary-foreground">
              {columns.length}
            </Badge>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="end">
          {/* Search */}
          <div className="p-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search columns"
                className="h-9 pl-8"
              />
            </div>
          </div>

          {/* Column list */}
          <div className="px-3 pb-3">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {visibleRows.map((column, index) => {
                const isEditing = editingId === column.id;
                return (
                  <div
                    key={column.id}
                    className={`flex items-center gap-2 rounded-md px-1 py-1.5 transition-opacity hover:bg-accent/50 ${
                      dragIndex === index ? "opacity-50" : ""
                    }`}
                    onDragOver={
                      !isSearching && column.isCustom
                        ? (e) => handleDragOver(e, index)
                        : undefined
                    }
                  >
                    {column.isCustom && (
                      <button
                        type="button"
                        draggable={!isSearching && !isEditing}
                        onDragStart={() => handleDragStart(index)}
                        onDragEnd={handleDragEnd}
                        className="flex h-7 w-5 shrink-0 cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing disabled:cursor-default disabled:opacity-30"
                        disabled={isSearching || isEditing}
                        aria-label={`Drag to reorder ${column.label}`}
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                    )}
                    {!column.isCustom && <div className="h-7 w-5 shrink-0" />}

                    {isEditing ? (
                      <>
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename();
                            if (e.key === "Escape") cancelRename();
                          }}
                          className="h-7 flex-1"
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={saveRename}
                          aria-label="Save"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={cancelRename}
                          aria-label="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span
                          className="text-sm flex-1 truncate"
                          title={column.label}
                        >
                          {column.label}
                        </span>

                        {column.isCustom && (
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              className="text-muted-foreground transition-colors hover:text-foreground"
                              onClick={() => startRename(column)}
                              aria-label={`Rename ${column.label}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              onClick={() => setDeleteTarget(column)}
                              aria-label={`Delete ${column.label}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {visibleRows.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">
                {isSearching
                  ? "No columns match your search."
                  : "No columns available."}
              </p>
            )}
          </div>
          <Separator />
          <div className="p-1">{addColumnTrigger}</div>
        </PopoverContent>
      </Popover>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete column?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This will permanently delete the "${deleteTarget?.label ?? ""}" column and its stored values. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

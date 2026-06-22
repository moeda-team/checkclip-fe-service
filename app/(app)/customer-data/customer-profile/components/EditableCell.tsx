"use client";

import { useRef, useState } from "react";
import { Upload, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/components/ui/utils";
import type {
  CustomerCustomFieldValue,
  CustomerFieldOption,
  CustomerFieldType
} from "@/types/type-customer";

// Format a value for read-only display, based on its field type.
export function formatFieldValue(
  fieldType: CustomerFieldType,
  value: CustomerCustomFieldValue | undefined,
  options?: CustomerFieldOption[]
): string {
  if (value === undefined || value === null || value === "") return "-";

  switch (fieldType) {
    case "dropdown": {
      if (options?.length) {
        const match = options.find((o) => o.value === String(value));
        if (match) return match.label;
      }
      return String(value);
    }
    case "boolean":
      return value === true || value === "true" ? "Yes" : "No";
    case "checkbox": {
      if (!options?.length) return String(value);
      const selected = String(value || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      const labels = selected
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[];
      return labels.length ? labels.join(", ") : "-";
    }
    case "date": {
      const date = new Date(String(value));
      return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString();
    }
    case "file": {
      const raw = String(value);
      return raw.split(/[/\\]/).pop() || raw;
    }
    default:
      return String(value);
  }
}

type EditableCellProps = {
  value: CustomerCustomFieldValue | undefined;
  fieldType: CustomerFieldType;
  options?: CustomerFieldOption[];
  editable?: boolean;
  onSave: (value: CustomerCustomFieldValue) => void;
};

// Normalize a draft string into the value shape expected for the field type.
function parseDraft(
  fieldType: CustomerFieldType,
  raw: string
): CustomerCustomFieldValue {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (fieldType === "number") {
    const n = Number(trimmed);
    return Number.isNaN(n) ? null : n;
  }
  return trimmed;
}

export function EditableCell({
  value,
  fieldType,
  options,
  editable = true,
  onSave
}: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Inline controls (always interactive) ───────────────────────────────────
  if (fieldType === "boolean") {
    const checked = value === true || value === "true";
    return (
      <Checkbox
        checked={checked}
        disabled={!editable}
        onCheckedChange={(c) => onSave(c === true)}
        aria-label="Toggle value"
      />
    );
  }

  if (fieldType === "checkbox") {
    const selected = String(value || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const selectedSet = new Set(selected);

    const toggle = (optionValue: string) => {
      const next = new Set(selectedSet);
      if (next.has(optionValue)) next.delete(optionValue);
      else next.add(optionValue);
      onSave(next.size ? Array.from(next).join(",") : null);
    };

    const selectedLabels =
      options?.filter((o) => selectedSet.has(o.value)).map((o) => o.label) ??
      [];

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={!editable}
            className={cn(
              "flex h-8 w-full items-center justify-between gap-1 rounded-md border border-input bg-transparent px-2 py-1 text-sm text-left",
              !editable && "opacity-50"
            )}
          >
            <span className="flex flex-1 flex-wrap gap-1 overflow-hidden">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="h-5 px-1.5 text-xs"
                  >
                    {label}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1" align="start">
          <div className="max-h-48 overflow-y-auto">
            {options?.map((o, index) => {
              const isSelected = selectedSet.has(o.value);
              return (
                <button
                  key={`${o.value}-${index}`}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={() => toggle(o.value)}
                >
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary">
                    {isSelected && <Check className="h-3 w-3 text-primary" />}
                  </div>
                  <span className="flex-1 text-left">{o.label}</span>
                </button>
              );
            })}
            {(!options || options.length === 0) && (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No options configured.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (fieldType === "file") {
    const fileName =
      value === undefined || value === null || value === ""
        ? ""
        : String(value).split(/[/\\]/).pop() || String(value);

    return (
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          disabled={!editable}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSave(file.name);
            e.target.value = "";
          }}
        />
        {fileName ? (
          <button
            type="button"
            disabled={!editable}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "truncate text-left text-sm text-primary underline-offset-2 hover:underline",
              !editable && "pointer-events-none text-foreground no-underline"
            )}
            title={fileName}
          >
            {fileName}
          </button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!editable}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 gap-2"
          >
            Upload File
            <Upload className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  if (fieldType === "dropdown") {
    return (
      <Select
        value={value != null && value !== "" ? String(value) : undefined}
        disabled={!editable}
        onValueChange={(v) => {
          if (v !== String(value ?? "")) onSave(v);
        }}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder="-" />
        </SelectTrigger>
        <SelectContent>
          {options?.map((o, index) => (
            <SelectItem key={`${o.value}-${index}`} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // ── Click-to-edit controls (text, number, date, etc.) ──────────────────────
  const startEdit = () => {
    if (!editable) return;
    setDraft(value === undefined || value === null ? "" : String(value));
    setEditing(true);
  };

  const commit = (raw: string) => {
    setEditing(false);
    const next = parseDraft(fieldType, raw);
    const current = value === undefined || value === null ? "" : String(value);
    if (String(next ?? "") !== current) onSave(next);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={startEdit}
        disabled={!editable}
        className={cn(
          "-mx-1 block w-full truncate rounded px-1 py-0.5 text-left",
          editable ? "cursor-text hover:bg-muted" : "cursor-default"
        )}
      >
        {formatFieldValue(fieldType, value, options)}
      </button>
    );
  }

  if (fieldType === "text_area") {
    return (
      <Textarea
        autoFocus
        defaultValue={draft}
        className="min-h-15"
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setEditing(false);
          }
        }}
      />
    );
  }

  const inputType =
    fieldType === "number" ? "number" : fieldType === "date" ? "date" : "text";

  // For date inputs the native control expects a yyyy-mm-dd value.
  let inputDefault = draft;
  if (fieldType === "date" && draft) {
    const d = new Date(draft);
    if (!Number.isNaN(d.getTime())) inputDefault = d.toISOString().slice(0, 10);
  }

  return (
    <Input
      autoFocus
      type={inputType}
      defaultValue={inputDefault}
      className="h-8"
      onBlur={(e) => commit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setEditing(false);
        }
      }}
    />
  );
}

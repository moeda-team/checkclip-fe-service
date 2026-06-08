"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
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
    case "checkbox":
      return value === true || value === "true" ? "Yes" : "No";
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

  // ── Inline controls (always interactive) ───────────────────────────────────
  if (fieldType === "boolean" || fieldType === "checkbox") {
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

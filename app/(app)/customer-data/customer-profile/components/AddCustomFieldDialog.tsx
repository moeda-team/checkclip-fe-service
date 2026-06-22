"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { usePostCustomerField } from "../../hooks/useCustomerFields";
import type {
  CustomerFieldFormDto,
  CustomerFieldOption,
  CustomerFieldType
} from "@/types/type-customer";

const FIELD_TYPES: { label: string; value: CustomerFieldType }[] = [
  { label: "Text", value: "text" },
  { label: "Text Area", value: "text_area" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Label", value: "label" },
  { label: "File", value: "file" },
  { label: "Yes / No", value: "boolean" }
];

// Convert a human label into a snake_case field key.
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

type AddCustomFieldDialogProps = {
  // Next display order, defaults to the count of existing fields.
  nextDisplayOrder?: number;
  trigger?: React.ReactNode;
};

const EMPTY_OPTION: CustomerFieldOption = { label: "", value: "" };

export function AddCustomFieldDialog({
  nextDisplayOrder = 0,
  trigger
}: AddCustomFieldDialogProps) {
  const [open, setOpen] = useState(false);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState<CustomerFieldType | "">("");
  const [options, setOptions] = useState<CustomerFieldOption[]>([
    { ...EMPTY_OPTION }
  ]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const { mutate: createField, isPending } = usePostCustomerField();

  const resetForm = () => {
    setFieldLabel("");
    setFieldType("");
    setOptions([{ ...EMPTY_OPTION }]);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  // Only the label is edited; the value mirrors the label.
  const updateOptionLabel = (index: number, label: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { label, value: label } : opt))
    );
  };

  const addOption = () => setOptions((prev) => [...prev, { ...EMPTY_OPTION }]);

  const removeOption = (index: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  // Reorder options via native drag-and-drop.
  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setOptions((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  // Both dropdown and checkbox columns are backed by a list of options.
  const isDropdown = fieldType === "dropdown";
  const isCheckbox = fieldType === "checkbox";
  const hasOptions = isDropdown || isCheckbox;
  const optionsLabel = isCheckbox ? "Checkbox options" : "Options";

  // Value mirrors label for the payload.
  const cleanedOptions: CustomerFieldOption[] = options
    .map((o) => o.label.trim())
    .filter((label) => label !== "")
    .map((label) => ({ label, value: label }));

  const isValid =
    fieldLabel.trim() !== "" &&
    fieldType !== "" &&
    (!hasOptions || cleanedOptions.length > 0);

  const handleSubmit = () => {
    if (!isValid) return;

    const payload: CustomerFieldFormDto = {
      field_label: fieldLabel.trim(),
      field_key: slugify(fieldLabel),
      field_type: fieldType,
      is_required: false,
      display_order: nextDisplayOrder,
      ...(hasOptions ? { options: cleanedOptions } : {})
    };

    createField(payload, {
      onSuccess: () => handleOpenChange(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:text-primary"
            aria-label="Add custom field"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-50 text-primary-600">
              <Plus className="h-4 w-4" />
            </span>
            <DialogTitle>Add New Column</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="column-type">
              Select Column Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={fieldType}
              onValueChange={(v) => setFieldType(v as CustomerFieldType)}
            >
              <SelectTrigger
                id="column-type"
                className="border border-gray-200"
              >
                <SelectValue placeholder="Select column type" />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-name">
              Field Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="field-name"
              placeholder="Type field name"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
            />
          </div>

          {hasOptions && (
            <div className="space-y-2">
              <Label>
                {optionsLabel} <span className="text-destructive">*</span>
              </Label>
              <div className="space-y-2">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-md ${
                      dragIndex === index ? "opacity-50" : ""
                    }`}
                    onDragOver={(e) => handleDragOver(e, index)}
                  >
                    <button
                      type="button"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnd={handleDragEnd}
                      className="flex h-9 w-6 shrink-0 cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing"
                      aria-label="Drag to reorder option"
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <Input
                      placeholder="Type options"
                      value={opt.label}
                      onChange={(e) => updateOptionLabel(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-muted-foreground"
                      onClick={() => removeOption(index)}
                      disabled={options.length === 1}
                      aria-label="Remove option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isPending}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

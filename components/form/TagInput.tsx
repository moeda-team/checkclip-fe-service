import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/input";

interface TagInputProps {
  label?: string;
  helperText?: string;
  placeholder?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({
  label = "Product Tags",
  helperText = "Add relevant tags to help categorize your product",
  placeholder = "Input tag",
  tags,
  onChange,
}: TagInputProps) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setValue("");
      return;
    }
    onChange([...tags, trimmed]);
    setValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && value === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="w-full">
      <label className="p-1 text-sm font-medium">{label}</label>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {/* Subtitle */}
      {helperText && (
        <p className="p-1 text-sm text-gray-400 mb-1.5">{helperText}</p>
      )}

      {/* Tags List Horizontal */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 rounded-full bg-[#1717171A] px-2 h-5 text-sm font-medium text-gray-800"
            >
              {tag}

              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                <X size={14} color="black" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

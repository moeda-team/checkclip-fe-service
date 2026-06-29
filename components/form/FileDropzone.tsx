import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { DragEvent } from "react";

interface FileDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  primaryLabel: string;
  helperLabel: string;
}

export default function FileDropzone({
  accept,
  multiple = true,
  onFilesSelected,
  primaryLabel,
  helperLabel,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    onFilesSelected(Array.from(fileList));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
        isDragOver
          ? "border-primary-400 bg-primary-50"
          : "border-border hover:border-muted-foreground/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
        <Upload size={16} className="text-muted-foreground" />
      </div>

      <div>
        <p className="text-sm">
          {primaryLabel.includes(" or ") ? (
            <>
              <span className="font-semibold">
                {primaryLabel.split(" or ")[0]}
              </span>
              <span className="text-muted-foreground">
                {" "}
                or {primaryLabel.split(" or ")[1]}
              </span>
            </>
          ) : (
            <span className="font-semibold">{primaryLabel}</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">{helperLabel}</p>
      </div>
    </div>
  );
}

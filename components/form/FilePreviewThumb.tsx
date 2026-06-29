import { X, Loader2, Play } from "lucide-react";

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadFile {
  id: string;
  file: File;
  previewUrl: string;
  status?: UploadStatus;
}

interface FilePreviewThumbProps {
  item: UploadFile;
  onRemove: (id: string) => void;
}

export default function FilePreviewThumb({
  item,
  onRemove,
}: FilePreviewThumbProps) {
  const isVideo = item.file.type.startsWith("video/");

  return (
    <div className="relative w-14 h-14 shrink-0">
      <div className="w-full h-full rounded-lg overflow-hidden border border-border">
        {isVideo ? (
          <video
            src={item.previewUrl}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.previewUrl}
            alt={item.file.name}
            className="w-full h-full object-cover"
          />
        )}

        {isVideo && item.status !== "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center">
              <Play size={10} className="text-foreground fill-current ml-0.5" />
            </div>
          </div>
        )}

        {item.status === "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 size={18} className="text-white animate-spin" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.file.name}`}
        className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-destructive flex items-center justify-center text-white shadow-sm"
      >
        <X size={10} strokeWidth={3} />
      </button>
    </div>
  );
}

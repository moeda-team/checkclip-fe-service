import { Loader2 } from "lucide-react";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeConfig: Record<SpinnerSize, { icon: number; text: string }> = {
  sm: { icon: 14, text: "text-xs" },
  md: { icon: 20, text: "text-sm" },
  lg: { icon: 28, text: "text-base" },
};

export default function LoadingSpinner({
  size = "md",
  className = "",
  label,
}: LoadingSpinnerProps) {
  const { icon, text } = sizeConfig[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2
        size={icon}
        className="animate-spin text-primary-500"
        aria-hidden="true"
      />
      {label && (
        <span className={`${text} text-muted-foreground`}>{label}</span>
      )}
      <span className="sr-only">Loading{label ? `: ${label}` : ""}</span>
    </div>
  );
}

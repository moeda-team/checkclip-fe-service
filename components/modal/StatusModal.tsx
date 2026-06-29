import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import Modal from "./Modal";

type StatusVariant = "success" | "error" | "warning";

interface StatusModalProps {
  isOpen: boolean;
  variant: StatusVariant;
  title?: string;
  description?: string;
  onClose: () => void;
  closeLabel?: string;
}

const variantConfig: Record<
  StatusVariant,
  { icon: typeof CheckCircle2; iconClass: string; bgClass: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-success",
    bgClass: "bg-success/10",
  },
  error: {
    icon: XCircle,
    iconClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500",
    bgClass: "bg-amber-50",
  },
};

export default function StatusModal({
  isOpen,
  variant,
  title = "Action Unsuccessful",
  description = "Something went wrong. Please try again.",
  onClose,
  closeLabel = "Close",
}: StatusModalProps) {
  const { icon: Icon, iconClass, bgClass } = variantConfig[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-75 p-4 flex flex-col items-center gap-4"
    >
      <div
        className={`w-9 h-9 rounded-full ${bgClass} flex items-center justify-center`}
      >
        <Icon size={24} className={iconClass} />
      </div>

      <div className="space-y-1.5 text-center">
        <h2 className="text-base font-medium">{title}</h2>
        <p className="text-xs text-muted-foreground ">{description}</p>
      </div>

      <Button variant="dark" className="w-full" onClick={onClose}>
        {closeLabel}
      </Button>
    </Modal>
  );
}

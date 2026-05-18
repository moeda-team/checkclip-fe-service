"use client";

import { Info, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalVariant = "confirm" | "success" | "failed";

type Props = {
  variant: ModalVariant;
  open: boolean;
  /** Only used when variant === "failed" */
  errorMessage?: string;
  onClose: () => void;
  /** Only used when variant === "confirm" */
  onContinue?: () => void;
};

// ─── Config per variant ───────────────────────────────────────────────────────

const config = {
  confirm: {
    iconBg: "bg-blue-100",
    icon: <Info className="w-6 h-6 text-blue-500" />,
    title: "Confirm Campaign Setup",
    description:
      "Please review your campaign details before proceeding. Make sure all required fields are filled correctly",
  },
  success: {
    iconBg: "bg-green-100",
    icon: <Check className="w-6 h-6 text-green-500" strokeWidth={2.5} />,
    title: "Success",
    description: "Successfully created campaign setup",
  },
  failed: {
    iconBg: "bg-red-100",
    icon: <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />,
    title: "Failed",
    description: "Failed to create campaign setup",
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export function CampaignAlertModal({
  variant,
  open,
  errorMessage,
  onClose,
  onContinue,
}: Props) {
  if (!open) return null;

  const { iconBg, icon, title, description } = config[variant];
  const desc = variant === "failed" && errorMessage ? errorMessage : description;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={variant !== "confirm" ? onClose : undefined}
    >
      {/* Modal card */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon circle */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>

        {/* Actions */}
        {variant === "confirm" ? (
          <div className="flex gap-3 w-full mt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border-gray-200 text-sm font-semibold"
            >
              Back
            </Button>
            <Button
              onClick={onContinue}
              className="flex-1 h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold"
            >
              Continue
            </Button>
          </div>
        ) : (
          <Button
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold mt-2"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
}

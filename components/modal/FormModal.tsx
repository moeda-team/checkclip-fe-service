import { X } from "lucide-react";
import { Button } from "../ui/button";
import { MouseEvent, useRef, type ReactNode } from "react";
import Modal from "./Modal";

interface FormModalProps {
  isOpen: boolean;
  title: string;
  icon: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  children: ReactNode;
}

export default function FormModal({
  isOpen,
  title,
  icon,
  onClose,
  onSubmit,
  submitLabel = "Save",
  children,
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-150">
      {/* Header */}
      <div className="flex items-center space-x-2.5 px-5 py-3.5 border-b">
        <div className="w-7 h-7 aspect-square rounded-md bg-primary-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="w-full font-semibold">{title}</span>
        <button
          onClick={onClose}
          className="w-4 h-4 flex items-center rounded-xs hover:border hover:shadow-sm"
        >
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="p-5 space-y-6 max-h-125 overflow-y-scroll">
        {children}
      </div>

      {/* Buttons */}
      <div className="p-3.5">
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="dark" onClick={onSubmit}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

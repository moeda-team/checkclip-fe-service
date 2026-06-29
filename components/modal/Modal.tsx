import { MouseEvent, ReactNode, useRef } from "react";
import { cn } from "../ui/utils";

export default function Modal({
  onClose,
  children,
  className,
  isOpen,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  if (!isOpen) return;
  return (
    <div
      onMouseDown={handleBackdropMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
    >
      <div
        ref={modalRef}
        className={cn(`bg-white shadow-md rounded-xl`, className)}
      >
        {children}
      </div>
    </div>
  );
}

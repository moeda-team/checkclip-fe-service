import Modal from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { FileExclamationPoint } from "lucide-react";

export default function DeleteConfModal({
  isOpen,
  onClose,
  handleDelete,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  handleDelete?: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="p-4 space-y-4 flex flex-col items-center w-75"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-destructive/10">
        <FileExclamationPoint size={24} className="text-destructive" />
      </div>

      <div className="text-center space-y-1.5">
        <h1 className="font-medium text-base">
          Are you sure you want to delete <br /> this item?
        </h1>
        <p className="text-xs text-muted-foreground">
          This action cannot be undone. Please confirm before proceeding.
        </p>
      </div>

      <div className="w-full flex flex-2 gap-2">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete} className="flex-1">
          Delete
        </Button>
      </div>
    </Modal>
  );
}

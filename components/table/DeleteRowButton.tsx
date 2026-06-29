import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DeleteRowButton({
  handleDeleteRow,
  disabled,
  isDeleting,
  selectedRow,
}: {
  handleDeleteRow?: () => void;
  disabled?: boolean;
  isDeleting?: boolean;
  selectedRow?: string[];
}) {
  return (
    <Button
      type="button"
      onClick={handleDeleteRow}
      disabled={disabled}
      className="bg-red-400 hover:bg-red-500 text-white font-medium text-sm"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isDeleting
        ? "Deleting..."
        : `Delete ${selectedRow?.length ? `(${selectedRow.length})` : ""}`}
    </Button>
  );
}

import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function AddRowButton({
  handleAddRow,
  isAdding,
}: {
  handleAddRow?: () => void;
  isAdding?: boolean;
}) {
  return (
    <Button
      type="button"
      onClick={handleAddRow}
      disabled={isAdding}
      className="bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm"
    >
      <Plus className="h-4 w-4 mr-1" />
      {isAdding ? "Adding..." : "Add New"}
    </Button>
  );
}

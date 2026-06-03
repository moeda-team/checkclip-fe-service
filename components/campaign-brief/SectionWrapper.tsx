import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionWrapperProps {
  id: string;
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isApproved: boolean;
}

export function SectionWrapper({
  id,
  label,
  icon: Icon,
  children,
  isApproved,
}: SectionWrapperProps) {
  return (
    <div
      id={id}
      className="scroll-mt-6 border border-violet-200 rounded-2xl p-6 space-y-4 bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">{label}</h2>
        </div>
        {!isApproved && (
          <Button
            variant="outline"
            className="h-8 text-xs bg-gray-900 hover:bg-gray-800 text-white gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

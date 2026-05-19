// components/layout/PageHeader.tsx
// Reusable page header with optional back button for feature pages

"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  showBackButton = true,
  backButtonLabel = "Back",
  onBack,
  actions
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-600 hover:text-gray-900"
            onClick={handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {backButtonLabel}
          </Button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

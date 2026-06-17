"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}

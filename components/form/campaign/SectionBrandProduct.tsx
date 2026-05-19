"use client";

import { Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BrandProductData } from "@/types/campaign";

type Props = {
  data: BrandProductData;
  onChange: (data: BrandProductData) => void;
};

export function SectionBrandProduct({ data, onChange }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <Package className="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Brand / Product
          </h2>
          <p className="text-xs text-gray-500">
            Identify the brand or product this campaign will promote.
          </p>
        </div>
      </div>

      {/* Fields */}
      <div>
        <Label
          htmlFor="brand-name"
          className="text-sm font-medium text-gray-700 mb-1.5 block"
        >
          Brand Name / Brand Type <span className="text-red-500">*</span>
        </Label>
        <Input
          id="brand-name"
          placeholder="Input brand name / brand type"
          value={data.brandName}
          onChange={(e) => onChange({ ...data, brandName: e.target.value })}
          className="h-10 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
        />
      </div>
    </section>
  );
}

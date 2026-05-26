// app/(app)/campaign-brief/create/page.tsx
// Campaign brief creation page — wraps CreateCampaign with custom submit logic.

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreateCampaignBrief } from "@/components/campaign-brief/CreateCampaign";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormSkeleton } from "@/components/ui/skeletons";
import { usePostStrategyBrief } from "../hooks/useCampaignBrief";
import type { AdsType, CampaignObjectiveKey } from "../types";
import type {
  AgeType,
  CampaignFormData,
  GenderType
} from "@/types/campaign-brief";

export default function CampaignBriefCreatePage() {
  const router = useRouter();
  const { submit, isSubmitting } = usePostStrategyBrief();

  const handleSubmit = useCallback(
    async (data: {
      campaignName: string;
      selectedAds: AdsType;
      selectedObjective: CampaignObjectiveKey;
      selectedSubtype: string;
      selectedConversionGoals: string[];
      formData: BriefFormData;
    }) => {
      const { formData } = data;

      // Build startDate with time component
      const [startHour = "0", startMinute = "0"] = (
        formData.budget.startTime ?? ""
      ).split(":");
      const startDate = new Date(formData.budget.startDate);
      startDate.setHours(Number(startHour), Number(startMinute), 0, 0);

      // Build endDate with time component (only if hasEndDate)
      let endDate: string | null = null;
      if (formData.budget.hasEndDate && formData.budget.endDate) {
        const [endHour = "0", endMinute = "0"] = (
          formData.budget.endTime ?? ""
        ).split(":");
        const ed = new Date(formData.budget.endDate);
        ed.setHours(Number(endHour), Number(endMinute), 0, 0);
        endDate = ed.toISOString();
      }

      await submit({
        title: data.campaignName,
        type_ads: data.selectedAds,
        objective_type: data.selectedObjective,
        sub_type: data.selectedSubtype,
        brand: {
          name: formData.brand.brandName,
          description: formData.brand.description ?? null
        },
        budget: {
          type:
            (formData.budget.budgetType as
              | "daily"
              | "weekly"
              | "monthly"
              | "lifetime") || null,
          amount: Number(formData.budget.budget) || 0,
          start_date: startDate.toISOString(),
          end_date: endDate
        },
        audience: {
          location: formData.audience.location || null,
          age: (formData.audience.age as AgeType) || null,
          language: formData.audience.language || null,
          gender: (formData.audience.gender as GenderType) || null,
          interest: formData.audience.interest?.join(",") || null,
          detail: formData.audience.detail || null
        }
      });
    },
    [submit]
  );

  const handleSuccess = useCallback(() => {
    router.push("/campaign-brief");
  }, [router]);

  const handleError = useCallback((err: Error) => {
    console.error("Campaign brief creation failed:", err);
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <PageHeader title="Create New Campaign Brief" showBackButton />
      <div className="flex-1 overflow-y-auto">
        {isSubmitting ? (
          <FormSkeleton />
        ) : (
          <CreateCampaignBrief
            onSubmit={handleSubmit}
            onSuccess={handleSuccess}
            onError={handleError}
            entityName="Campaign"
          />
        )}
      </div>
    </div>
  );
}

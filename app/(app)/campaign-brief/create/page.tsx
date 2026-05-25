// app/(app)/campaign-brief/create/page.tsx
// Campaign brief creation page — wraps CreateCampaign with custom submit logic.

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreateCampaign } from "@/components/campaign/CreateCampaign";
import { PageHeader } from "@/components/layout/PageHeader";
import type { AdsType, CampaignObjectiveKey } from "../types";
import type { CampaignFormData } from "@/types/campaign";
import { usePostStrategyBrief } from "../hooks/useCampaignBrief";

export default function CampaignBriefCreatePage() {
  const router = useRouter();
  const { submit } = usePostStrategyBrief();

  const handleSubmit = useCallback(
    async (data: {
      campaignName: string;
      selectedAds: AdsType;
      selectedObjective: CampaignObjectiveKey;
      selectedSubtype: string;
      selectedConversionGoals: string[];
      formData: CampaignFormData;
    }) => {
      // Map from CreateCampaign's CampaignFormData shape → campaign-brief API shape
      await submit({
        title: data.campaignName,
        type_ads: data.selectedAds,
        objective_type: data.selectedObjective,
        sub_type: data.selectedSubtype,
        form: {
          brand: {
            name: data.formData.brand.brandName,
            description: data.formData.brand.description ?? null
          },
          budget: {
            type:
              (data.formData.budget.budgetType as
                | "daily"
                | "weekly"
                | "monthly"
                | "lifetime") || null,
            amount: data.formData.budget.budget,
            startDate: data.formData.budget.startDate
              ? new Date(data.formData.budget.startDate)
              : new Date(),
            endDate:
              data.formData.budget.hasEndDate && data.formData.budget.endDate
                ? new Date(data.formData.budget.endDate)
                : null,
            hasEndDate: data.formData.budget.hasEndDate
          },
          audience: {
            location: data.formData.audience.location,
            age: (data.formData.audience.age as "18-24") || null,
            language: data.formData.audience.language,
            gender: data.formData.audience.gender,
            interest: data.formData.audience.interest
          }
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
        <CreateCampaign
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
          entityName="campaign brief"
        />
      </div>
    </div>
  );
}

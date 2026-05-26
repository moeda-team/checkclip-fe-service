// app/(app)/strategy-planner/create/page.tsx
// Strategy planner creation page — thin wrapper around reusable CreateCampaign.

"use client";

import { usePostStrategyPlanner } from "@/app/(app)/strategy-planner/hooks/useStrategyPlanner";
import type { CreateStrategyPlannerPayload } from "@/app/(app)/strategy-planner/types";
import { CreateCampaign } from "@/components/campaign/CreateCampaign";
import { PageHeader } from "@/components/layout/PageHeader";
import { StrategyPlannerGenerating } from "./StrategyPlannerGenerating";
import type {
  AdsType,
  CampaignFormData,
  CampaignObjectiveKey
} from "@/types/campaign";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

// Transform campaign form data to strategy planner payload
const buildStrategyPlannerPayload = (data: {
  campaignName: string;
  selectedAds: AdsType;
  selectedObjective: CampaignObjectiveKey;
  selectedSubtype: string;
  selectedConversionGoals: string[];
  formData: CampaignFormData;
}): CreateStrategyPlannerPayload => ({
  title: data.campaignName,
  planner_type: data.selectedObjective as
    | "awareness"
    | "traffic"
    | "sales"
    | "leads"
    | "app_detail",
  tenant_id: "",
  brand: {
    name: data.formData.brand.brandName,
    description: data.formData.brand.description ?? "",
    industry_vertical: data.formData.brand.industryVertical,
    competition_level: data.formData.brand.competitionLevel,
    product_average_price: Number(data.formData.brand.productAveragePrice) || 0,
    product_average_rating:
      Number(data.formData.brand.productAverageRating) || 0
  },
  budget: {
    type: data.formData.budget.budgetType,
    amount: Number(data.formData.budget.budget) || 0,
    start_date: data.formData.budget.startDate
      ? `${data.formData.budget.startDate}T${data.formData.budget.startTime ? data.formData.budget.startTime + ":00" : "00:00:00"}Z`
      : new Date().toISOString(),
    end_date:
      data.formData.budget.endDate && data.formData.budget.hasEndDate
        ? `${data.formData.budget.endDate}T${data.formData.budget.endTime ? data.formData.budget.endTime + ":00" : "23:59:59"}Z`
        : data.formData.budget.endDays
          ? new Date(
              Date.now() +
                parseInt(data.formData.budget.endDays) * 24 * 60 * 60 * 1000
            ).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  audience: {
    location: data.formData.audience.location,
    age: data.formData.audience.age || "all",
    language: data.formData.audience.language,
    gender: data.formData.audience.gender as "all" | "women" | "men",
    interest: data.formData.audience.audienceInterest.join(","),
    size: data.formData.audience.audienceSize,
    detail: data.formData.audience.detailAudience
  }
});

export default function StrategyPlannerCreatePage() {
  const router = useRouter();
  const { mutateAsync, isPending } = usePostStrategyPlanner();

  const handleOnSubmit = useCallback(
    async (data: {
      campaignName: string;
      selectedAds: AdsType;
      selectedObjective: CampaignObjectiveKey;
      selectedSubtype: string;
      selectedConversionGoals: string[];
      formData: CampaignFormData;
    }) => {
      const payload = buildStrategyPlannerPayload(data);
      const response = await mutateAsync(payload);

      // Redirect to detail page after successful creation
      if (response.data?.id) {
        router.push(`/strategy-planner/${response.data.id}/detail`);
      }
    },
    [mutateAsync, router]
  );

  // Show generating screen while strategy planner is being created
  if (isPending) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        <PageHeader title="Create New Strategy Planner" showBackButton />
        <StrategyPlannerGenerating />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <PageHeader title="Create New Strategy Planner" showBackButton />
      <div className="flex-1 overflow-y-auto">
        <CreateCampaign
          onSuccess={() => console.log("Strategy planner created successfully")}
          onError={(err: Error) =>
            console.error("Strategy planner creation failed:", err)
          }
          hideAdsType={true}
          entityName="strategy planner"
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
}

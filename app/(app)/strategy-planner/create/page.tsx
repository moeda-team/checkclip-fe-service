// app/(app)/strategy-planner/create/page.tsx
// Strategy planner creation page — thin wrapper around reusable CreateCampaign.

"use client";

import { usePostStrategyPlanner } from "@/app/(app)/strategy-planner/hooks/useStrategyPlanner";
import type { CreateStrategyPlannerPayload } from "@/app/(app)/strategy-planner/types";
import { CreateCampaign } from "@/components/campaign/CreateCampaign";
import { PageHeader } from "@/components/layout/PageHeader";
import type {
  AdsType,
  CampaignFormData,
  CampaignObjectiveKey
} from "@/types/campaign";
import { useCallback } from "react";

// Get timezone offset in format +HH:00 or -HH:00
const getTimezoneOffset = (): string => {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.abs(Math.floor(offset / 60));
  const sign = offset <= 0 ? "+" : "-";
  return `${sign}${String(hours).padStart(2, "0")}:00`;
};

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
  form: {
    brand: {
      name: data.formData.brand.brandName,
      description: data.formData.brand.description
    },
    budget: {
      type: data.formData.budget.budgetType,
      budget: Number(data.formData.budget.budget) || 0,
      start_date: data.formData.budget.startDate
        ? `${data.formData.budget.startDate}T${data.formData.budget.startTime ? data.formData.budget.startTime + ":00" : "00:00:00"}${getTimezoneOffset()}`
        : new Date().toISOString(),
      end_date:
        data.formData.budget.endDate && data.formData.budget.hasEndDate
          ? `${data.formData.budget.endDate}T${data.formData.budget.endTime ? data.formData.budget.endTime + ":00" : "23:59:59"}${getTimezoneOffset()}`
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
      detail_audience: data.formData.audience.interest
    }
  }
});

export default function StrategyPlannerCreatePage() {
  const { mutateAsync } = usePostStrategyPlanner();

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
      await mutateAsync(payload);
    },
    [mutateAsync]
  );

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

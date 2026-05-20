// app/(app)/campaign-brief/create/page.tsx
// Campaign brief creation page — thin wrapper around reusable CreateCampaign.

"use client";

import { useCallback } from "react";
import { CreateCampaign } from "@/components/campaign/CreateCampaign";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCampaignBrief } from "@/app/(app)/campaign-brief/hooks/useCampaignBrief";
import type {
  AdsType,
  CampaignFormData,
  CampaignObjectiveKey,
} from "@/types/campaign";

export default function CampaignBriefCreatePage() {
  const { submit } = useCampaignBrief();

  const campaignTypeMap: Record<CampaignObjectiveKey, string> = {
    awareness: "Reach · Video",
    traffic: "Search · Display",
    sales: "Performance Max",
    leads: "Performance Max",
    app_install: "App · App Installs",
  };

  const handleOnSubmit = useCallback(
    async (data: {
      campaignName: string;
      selectedAds: AdsType;
      selectedObjective: CampaignObjectiveKey;
      selectedSubtype: string;
      selectedConversionGoals: string[];
      formData: CampaignFormData;
    }) => {
      await submit({
        title: data.campaignName,
        type_ads: data.selectedAds,
        objective_type: data.selectedObjective,
        sub_type: data.selectedSubtype,
        form: data.formData,
      });
    },
    [submit],
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <PageHeader title="Create New Campaign Brief" showBackButton />
      <div className="flex-1 overflow-y-auto">
        <CreateCampaign
          onSuccess={() => console.log("Campaign created successfully")}
          onError={(err: Error) =>
            console.error("Campaign creation failed:", err)
          }
          onSubmit={handleOnSubmit}
        />
      </div>
    </div>
  );
}

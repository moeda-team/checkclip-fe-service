// app/campaign-brief/create/page.tsx
// Campaign brief creation page — thin wrapper around reusable CreateCampaign.

"use client";

import { CreateCampaign } from "@/components/campaign/CreateCampaign";

export default function CampaignBriefCreatePage() {
  return (
    <CreateCampaign
      onSuccess={() => console.log("Campaign created successfully")}
      onError={(err: Error) => console.error("Campaign creation failed:", err)}
    />
  );
}

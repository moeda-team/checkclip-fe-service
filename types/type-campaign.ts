// types/type-campaign.ts
// Campaign domain DTOs — mirrors the backend campaign shapes.

export type CampaignDto = {
  id: string;
  name: string;
  objective: string;
  status: "draft" | "active" | "paused" | "completed";
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

export type CampaignFormDto = {
  name: string;
  objective: string;
  budget: number;
  start_date: string;
  end_date: string;
};

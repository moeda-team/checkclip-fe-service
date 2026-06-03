// app/(app)/campaigns/components/campaign-types.ts
// Shared types for the campaigns page (backed by approved strategy briefs).

import type {
  AdsType,
  CampaignBrief,
  CampaignBriefStatus
} from "@/app/(app)/campaign-brief/types";

export type { AdsType, CampaignBrief, CampaignBriefStatus };

/** Tab filter value: any brief status or the "All" pseudo-filter. */
export type BriefFilter = CampaignBriefStatus | "All";

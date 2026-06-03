// app/(app)/campaigns/components/campaign-data.ts
// Status tab definitions for the campaigns (approved strategy briefs) page.

import type { BriefFilter } from "./campaign-types";

export const tabs: { label: string; filter: BriefFilter }[] = [
  { label: "All", filter: "All" },
  { label: "Approved", filter: "approved" },
  { label: "Pending", filter: "pending" },
  { label: "In Review", filter: "in_review" },
  { label: "Rejected", filter: "rejected" },
  { label: "Draft", filter: "draft" }
];

// app/(app)/campaigns/components/campaign-utils.ts
// Label + style helpers for the campaigns (approved strategy briefs) page.

import type { AdsType, CampaignBriefStatus } from "./campaign-types";

export const statusLabels: Record<CampaignBriefStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  in_review: "In Review",
  rejected: "Rejected",
  draft: "Draft"
};

export const adsTypeLabels: Record<AdsType, string> = {
  google: "Google",
  meta: "Meta",
  line: "LINE",
  yahoo: "Yahoo"
};

export function getStatusStyles(status: CampaignBriefStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "in_review":
      return "bg-blue-100 text-blue-700";
    case "rejected":
      return "bg-rose-100 text-rose-700";
    case "draft":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getAdsTypeStyles(type: AdsType) {
  switch (type) {
    case "google":
      return "bg-teal-100 text-teal-700";
    case "meta":
      return "bg-blue-100 text-blue-700";
    case "line":
      return "bg-emerald-100 text-emerald-700";
    case "yahoo":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

/** Title-case a snake_case / lowercase value, e.g. "app_install" -> "App Install". */
export function humanize(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

import { AgeType, GenderType } from "@/types/campaign-brief";

export type CampaignObjectiveKey =
  | "awareness"
  | "traffic"
  | "sales"
  | "leads"
  | "app_install";

export type AdsType = "google" | "meta" | "line" | "yahoo";

export type CampaignObjectiveType = {
  key: CampaignObjectiveKey;
  label: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: React.ReactNode;
};

export type SubtypeOption = {
  label: string;
  description: string;
};

// ─── Campaign Form Types ──────────────────────────────────────────────────────

export type BrandProductData = {
  name: string;
  description?: string | null;
};

export type BudgetScheduleData = {
  type: "daily" | "weekly" | "monthly" | "lifetime" | null;
  amount: string;
  startDate: Date;
  endDate?: Date | null;
  hasEndDate: boolean;
};

export type AudienceData = {
  location: string;
  age: AgeType | null;
  language: string;
  gender: GenderType;
  interest: string;
  detail: string;
};

export type CampaignFormData = {
  brand: BrandProductData;
  budget: BudgetScheduleData;
  audience: AudienceData;
};

// ─── API Response Types ───────────────────────────────────────────────────────

export type CampaignBriefStatus =
  | "in_review"
  | "approved"
  | "rejected"
  | "draft"
  | "pending";

export type CampaignBriefTenant = {
  id: string;
  code: string;
  name: string;
  domain: string;
};

export type CampaignBriefBudget = {
  type: string;
  amount: number;
  start_date: Date;
  end_date: Date;
};

export type CampaignBriefBrand = {
  name: string;
  description?: string;
};

export type CampaignBriefAudience = {
  location: string;
  age: string;
  language: string;
  interest: string;
  gender: string;
  detail: string;
};

export interface CampaignBrief {
  id: string;
  title: string;
  type_ads: AdsType;
  objective_type: CampaignObjectiveKey;
  sub_type: string;
  status: CampaignBriefStatus;
  tenant?: CampaignBriefTenant;
  brand?: CampaignBriefBrand;
  budget?: CampaignBriefBudget;
  audience?: CampaignBriefAudience;
  created_at?: string;
  updated_at?: string;
}

export type CampaignBriefDetailResponse = {
  status: boolean;
  code: number;
  message: string;
  data: CampaignBrief & {
    approved_at: string | null;
    approved_by: string | null;
  };
};

// ─── Request Payload Types ────────────────────────────────────────────────────

export interface CreateStrategyBriefBrand {
  name: string;
  description?: string | null;
}

export interface CreateStrategyBriefBudget {
  type: "daily" | "weekly" | "monthly" | "lifetime" | null;
  amount: number;
  start_date: string; // ISO 8601
  end_date?: string | null; // ISO 8601
}

export interface CreateStrategyBriefAudience {
  location?: string | null;
  age?: AgeType | null;
  language?: string | null;
  interest?: string | null;
  detail?: string | null;
  gender?: GenderType | null;
}

export interface CreateStrategyBriefPayload {
  title: string;
  type_ads: AdsType;
  objective_type: CampaignObjectiveKey;
  sub_type: string;
  brand?: CreateStrategyBriefBrand;
  budget?: CreateStrategyBriefBudget;
  audience?: CreateStrategyBriefAudience;
}

export interface CampaignBriefFilter {
  offset?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

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
};

export type BudgetScheduleData = {
  budgetType: string;
  budget: string;
  startDate: Date | string;
  endDate: Date | string;
  endDays: string;
  hasEndDate: boolean;
  breakdown: {
    category: string;
    description: string;
    amount: string;
  }[]
};

export type AudienceData = {
  location: string;
  age: string;
  language: string;
  gender: "all" | "men" | "women";
  interest: string;
};

export type ObjectiveKpi = {
  metric: string;
  target: string;
}

export type CampaignFormData = {
  brand: BrandProductData;
  budget: BudgetScheduleData;
  audience: AudienceData;
  objectiveKpi: ObjectiveKpi[]
};

// ─── API Response Types ───────────────────────────────────────────────────────

export type CampaignBriefStatus = "in_review" | "approved" | "rejected" | "draft" | "pending";

export type CampaignBriefTenant = {
  id: string;
  code: string;
  name: string;
  domain: string;
};

export interface CampaignBrief  {
  id: string;
  title: string;
  type_ads: AdsType;
  objective_type: CampaignObjectiveKey;
  sub_type: string;
  status: CampaignBriefStatus;
  tenant?: CampaignBriefTenant;
  form: CampaignFormData;
  created_at?: string;
  updated_at?: string;
};

export type CampaignBriefDetailResponse = {
  status: boolean;
  code: number;
  message: string;
  data: CampaignBrief & {
    approved_at: string | null;
    approved_by: string | null;
  };
};


export interface CampaignBriefFilter {
  offset?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

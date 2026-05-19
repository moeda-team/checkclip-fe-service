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
  brandName: string;
  description?: string;
};

export type BudgetScheduleData = {
  budgetType: string;
  budget: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  endDays: string;
  hasEndDate: boolean;
};

export type AudienceData = {
  location: string;
  age: string;
  language: string;
  gender: "all" | "men" | "women";
  interest: string;
};

export type CampaignFormData = {
  brand: BrandProductData;
  budget: BudgetScheduleData;
  audience: AudienceData;
};

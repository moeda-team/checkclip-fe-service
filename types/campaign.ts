export type CampaignObjectiveKey =
  | "awareness"
  | "traffic"
  | "sales"
  | "leads"
  | "app_install";

export type AdsType = "google" | "meta" | "line" | "yahoo";

export type AgeType = "18-24" | "25-34" | "35-44" | "45-54" | "55+" | "all"

export type GenderType = "all" | "men" | "women"

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
  industryVertical: string;
  competitionLevel: string;
  productAveragePrice: string;
  productAverageRating: string;
  totalReviews: string;
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
  age: AgeType | string;
  language: string;
  gender: GenderType | string;
  interest: string;
  audienceInterest: string[];
  audienceSize: string;
  detailAudience: string;
};

export type CampaignFormData = {
  brand: BrandProductData;
  budget: BudgetScheduleData;
  audience: AudienceData;
};


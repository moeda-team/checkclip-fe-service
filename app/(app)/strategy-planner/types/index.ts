// app/(app)/strategy-planner/types/index.ts
// Feature-specific types for Strategy Planner

export type StrategyPlannerType = "awareness" | "traffic" | "sales" | "leads" | "app_detail";

export interface StrategyPlannerBrand {
  planner_id?: string;
  name: string;
  description: string;
  industry_vertical: string;
  competition_level: string;
  product_average_price: number;
  product_average_rating: number;
}

export interface StrategyPlannerBudget {
  planner_id?: string;
  type: string;
  amount: number;
  start_date: string;
  end_date: string;
}

export interface StrategyPlannerAudience {
  planner_id?: string;
  location: string;
  age: string;
  language: string;
  gender: "all" | "male" | "female";
  interest: string;
  size: string;
  detail: string;
}

export interface StrategyPlannerForm {
  brand: StrategyPlannerBrand;
  budget: StrategyPlannerBudget;
  audience: StrategyPlannerAudience;
}

export interface StrategyPlannerDto {
  id: string;
  title: string;
  planner_type: StrategyPlannerType;
  brand: StrategyPlannerBrand;
  budget: StrategyPlannerBudget;
  audience: StrategyPlannerAudience;
  status?: "draft" | "active" | "completed" | "archived";
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  tenant?: {
    id: string;
    code: string;
    name: string;
    domain: string;
  };
  tenant_id?: string;
  result_ai?: StrategyPlannerResultAI[];
}

export interface StrategyPlannerResultAI {
  platform: string;
  result: {
    model_source: string;
    matched_interest: string;
    base_case: StrategyPlannerScenarioData;
    aggressive: StrategyPlannerScenarioData;
    conservative: StrategyPlannerScenarioData;
  };
}

export interface StrategyPlannerScenarioData {
  notes: string;
  confidence: string;
  predicted_cpm_usd: number;
  predicted_ctr_pct: number;
  predicted_cpc_usd?: number | null;
  predicted_cpi_usd?: number | null;
  predicted_cpl_usd?: number | null;
  predicted_cvr_pct?: number | null;
  predicted_install_rate_pct?: number | null;
  predicted_engagement_rate_pct?: number | null;
  platform_fit_score: number;
  roi: {
    roas?: number | null;
    roi_pct?: number | null;
    estimated_conversions?: number | null;
    estimated_revenue_usd?: number | null;
  };
  budget_simulation: {
    budget_usd: number;
    est_impressions: number;
    est_clicks: number;
    est_leads?: number | null;
    est_installs?: number | null;
    est_sessions?: number | null;
    est_video_views?: number | null;
    est_landing_page_views?: number | null;
    effective_cpc_usd?: number | null;
  };
}

export interface StrategyPlannerTableRow {
  id: string;
  title: string;
  planner_type: StrategyPlannerType;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id?: string;
    code?: string;
    name: string;
    domain?: string;
  };
  budget?: {
    type: string;
    amount: number;
  };
  brand?: {
    name: string;
  };
}

export interface CreateStrategyPlannerPayload {
  title: string;
  planner_type: StrategyPlannerType;
  tenant_id: string;
  brand: StrategyPlannerBrand;
  budget: StrategyPlannerBudget;
  audience: StrategyPlannerAudience;
}

export interface UpdateStrategyPlannerPayload {
  title?: string;
  planner_type?: StrategyPlannerType;
  brand?: Partial<StrategyPlannerBrand>;
  budget?: Partial<StrategyPlannerBudget>;
  audience?: Partial<StrategyPlannerAudience>;
  status?: "draft" | "active" | "completed" | "archived";
}

export type GenerateBriefScenario = "conservative" | "base_case" | "aggressive";

export interface GenerateBriefPayload {
  planner_id: string;
  platform: string;
  scenario: GenerateBriefScenario;
}

export interface StrategyPlannerFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

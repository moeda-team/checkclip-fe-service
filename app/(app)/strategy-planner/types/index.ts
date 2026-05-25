// app/(app)/strategy-planner/types/index.ts
// Feature-specific types for Strategy Planner

export type StrategyPlannerType = "awareness" | "traffic" | "sales" | "leads" | "app_detail";

export interface StrategyPlannerBrand {
  name: string;
  description: string;
  industry_vertical: string;
  competition_level: string;
  product_average_price: number;
  product_average_rating: number;
}

export interface StrategyPlannerBudget {
  type: string;
  amount: number;
  start_date: string;
  end_date: string;
}

export interface StrategyPlannerAudience {
  location: string;
  age: string;
  language: string;
  gender: "all" | "women" | "men";
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
  status: "draft" | "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tenant_id?: string;
}

export interface StrategyPlannerTableRow {
  id: string;
  title: string;
  planner_type: StrategyPlannerType;
  status: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    code: string;
    name: string;
    domain: string;
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

export interface StrategyPlannerFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

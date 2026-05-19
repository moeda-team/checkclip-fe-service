// app/(app)/strategy-planner/types/index.ts
// Feature-specific types for Strategy Planner

export type StrategyPlannerType = "awareness" | "traffic" | "sales" | "leads" | "app_detail";

export interface StrategyPlannerBrand {
  name: string;
  description?: string;
}

export interface StrategyPlannerBudget {
  type: string;
  budget: number;
  start_date: string;
  end_date: string;
}

export interface StrategyPlannerAudience {
  location: string;
  age: number;
  language: string;
  gender: "all" | "women" | "men";
  detail_audience: string;
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
  form: StrategyPlannerForm;
  status: "draft" | "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  tenant_id?: string;
}

export interface StrategyPlannerTableRow {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStrategyPlannerPayload {
  title: string;
  planner_type: StrategyPlannerType;
  form: StrategyPlannerForm;
}

export interface UpdateStrategyPlannerPayload {
  title?: string;
  planner_type?: StrategyPlannerType;
  form?: Partial<StrategyPlannerForm>;
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

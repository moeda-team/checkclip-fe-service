// API Types based on Swagger documentation
// https://checkclip-be-service.onrender.com/swagger-ui/

export const DepartmentUnit = {
  DESIGN_DEPARTMENT: 'design_department',
  ENGINEERING_DIVISION: 'engineering_division',
  HUMAN_RESOURCE: 'human_resource'
} as const;

export type DepartmentUnit = typeof DepartmentUnit[keyof typeof DepartmentUnit];

export const JobTitle = {
  JUNIOR_PRODUCT_DESIGN: 'junior_product_design',
  SENIOR_SOFTWARE_ENGINEERING: 'senior_software_engineering',
  LEAD_UI_UX: 'lead_u_i_u_x'
} as const;

export type JobTitle = typeof JobTitle[keyof typeof JobTitle];

export const SystemRole = {
  EMPLOYEE: 'employee',
  SUPERVISOR: 'supervisor',
  HUMAN_RESOURCE: 'human_resource',
  PAYROLL: 'payroll',
  FINANCE: 'finance',
  MANAGER: 'manager',
  ADMIN: 'admin'
} as const;

export type SystemRole = typeof SystemRole[keyof typeof SystemRole];

export interface LoginLocal {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface Register {
  full_name: string;
  email: string;
  password: string;
  job_title: string;
  department_unit: string;
  role: string;
  address?: string;
  phone_number?: string;
}

export interface ProfileResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  job_title: string;
  department_unit: string;
  address?: string;
  phone_number?: string;
}

export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  email?: string;
  role?: string;
}

export interface ApiError {
  message: string;
  detail?: string;
  status?: number;
}

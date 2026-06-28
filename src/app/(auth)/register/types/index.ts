export interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  job_title: string;
  department_unit: string;
  role: string;
  phone_number: string;
  address: string;
}

export interface RegisterFormErrors {
  full_name?: string;
  email?: string;
  password?: string;
  job_title?: string;
  department_unit?: string;
  role?: string;
  phone_number?: string;
  address?: string;
  general?: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
}

/** Shape of each item returned by /enum/* endpoints */
export interface EnumOption {
  label: string;
  value: string;
}

export interface EnumData {
  jobTitles: EnumOption[];
  departments: EnumOption[];
  roles: EnumOption[];
}

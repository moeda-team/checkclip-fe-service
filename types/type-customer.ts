// types/type-customer.ts
// Customer domain DTOs — mirrors the backend customer shapes.

// Supported custom field types
export type CustomerFieldType =
  | "text"
  | "text_area"
  | "number"
  | "date"
  | "dropdown"
  | "checkbox"
  | "label"
  | "file"
  | "boolean";

// Option entry for dropdown-type custom fields
export type CustomerFieldOption = {
  label: string;
  value: string;
};

// Customer Field (custom column) DTOs
export type CustomerFieldDto = {
  id: string;
  tenant_id: string;
  field_key: string;
  field_label: string;
  field_type: CustomerFieldType;
  is_required: boolean;
  display_order: number;
  options?: CustomerFieldOption[];
};

export type CustomerFieldFormDto = {
  field_key: string;
  field_label: string;
  field_type: CustomerFieldType;
  is_required: boolean;
  display_order: number;
  options?: CustomerFieldOption[];
};

// Tenant summary embedded on a customer
export type CustomerTenantDto = {
  id: string;
  code: string;
  name: string;
  domain: string;
};

// Value stored against a custom field key
export type CustomerCustomFieldValue = string | number | boolean | null;

// Customer DTOs
export type CustomerDto = {
  id: string;
  tenant_id: string;
  full_name: string;
  age?: number;
  gender?: string;
  company_name?: string;
  job_title?: string;
  email: string;
  custom_fields?: Record<string, CustomerCustomFieldValue>; // Dynamic custom fields keyed by field_key
  tenant?: CustomerTenantDto;
};

export type CustomerFormDto = {
  full_name: string;
  age?: number;
  gender?: string;
  company_name?: string;
  job_title?: string;
  email: string;
  custom_fields?: Record<string, CustomerCustomFieldValue>;
};

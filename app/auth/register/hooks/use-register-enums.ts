"use client";

// app/auth/register/hooks/use-register-enums.ts
// Fetches enum options from backend for the register form.
// Endpoints: GET /enum/department-unit | /enum/job-title | /enum/system-role
// Response shape: { status, code, message, data: { label, value }[] }

import { useQuery } from "@tanstack/react-query";
import { fetchConfig } from "@/lib/fetch";
import { env } from "@/lib/env";

// ─── Module-level axios instance ──────────────────────────────────────────────
const axios = fetchConfig(env.apiBaseUrl!);

// ─── Types ────────────────────────────────────────────────────────────────────

export type EnumOption = {
  label: string;
  value: string;
};

type EnumResponse = {
  status: boolean;
  code: number;
  message: string;
  data: EnumOption[];
};

// ─── Fetchers ─────────────────────────────────────────────────────────────────

const fetchDepartmentUnits = async (): Promise<EnumOption[]> => {
  const res = await axios.get<EnumResponse>("/enum/department-unit");
  return res.data;
};

const fetchJobTitles = async (): Promise<EnumOption[]> => {
  const res = await axios.get<EnumResponse>("/enum/job-title");
  return res.data;
};

const fetchSystemRoles = async (): Promise<EnumOption[]> => {
  const res = await axios.get<EnumResponse>("/enum/system-role");
  return res.data;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useDepartmentUnits = () =>
  useQuery<EnumOption[]>({
    queryKey: ["enum", "department-unit"],
    queryFn: fetchDepartmentUnits,
    staleTime: Infinity, // enums don't change at runtime
    meta: { errorMessage: "Failed to load department options" },
  });

export const useJobTitles = () =>
  useQuery<EnumOption[]>({
    queryKey: ["enum", "job-title"],
    queryFn: fetchJobTitles,
    staleTime: Infinity,
    meta: { errorMessage: "Failed to load job title options" },
  });

export const useSystemRoles = () =>
  useQuery<EnumOption[]>({
    queryKey: ["enum", "system-role"],
    queryFn: fetchSystemRoles,
    staleTime: Infinity,
    meta: { errorMessage: "Failed to load role options" },
  });

// ─── Composite hook — fetch all three in parallel ─────────────────────────────

export type RegisterEnums = {
  departmentUnits: EnumOption[];
  jobTitles: EnumOption[];
  systemRoles: EnumOption[];
  isLoading: boolean;
};

export function useRegisterEnums(): RegisterEnums {
  const { data: departmentUnits = [], isLoading: l1 } = useDepartmentUnits();
  const { data: jobTitles = [], isLoading: l2 } = useJobTitles();
  const { data: systemRoles = [], isLoading: l3 } = useSystemRoles();

  return {
    departmentUnits,
    jobTitles,
    systemRoles,
    isLoading: l1 || l2 || l3,
  };
}

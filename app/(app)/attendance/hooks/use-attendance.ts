"use client";

// app/(app)/attendance/hooks/use-attendance.ts
// All attendance-related hooks:
//   - useGetAttendanceToday   → GET /attendance/today
//   - useUploadAttendanceImage → POST /attendance/image (multipart)
//   - useCheckIn              → POST /attendance/check-in
//   - useCheckOut             → POST /attendance/{id}/check-out

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { env } from "@/lib/env";
import { fetchConfig } from "@/lib/fetch";
import type { ApiResponse } from "@/types/api";
import type { AttedanceToday } from "../types/attendance-today";
import { HistoryTable } from "../types/history-table";

const client = fetchConfig(env.apiBaseUrl);
const BASE = env.apiBaseUrl!;

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckInPayload = {
  latitude: string;
  longitude: string;
  image_ids: string[];
};

export type UploadImageResult = {
  image_id: string[];
};

// ─── Helper: multipart upload (fetch config doesn't support multipart) ────────

async function uploadImageMultipart(
  dataUrl: string,
  filename = "attendance.jpg",
): Promise<ApiResponse<UploadImageResult>> {
  const session = await getSession();

  // Convert base64 data-URL → Blob
  const [, base64] = dataUrl.split(",");
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "image/jpeg" });

  const form = new FormData();
  form.append("files", blob, filename);

  const res = await fetch(`${BASE}/attendance/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken ?? ""}`,
    },
    body: form,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? "Image upload failed");
  return json;
}

// ─── GET /attendance/today ────────────────────────────────────────────────────

export const useGetAttendanceToday = () =>
  useQuery({
    queryKey: ["getAttendanceToday"],
    queryFn: () => client.get<ApiResponse<AttedanceToday>>("/attendance/today"),
    staleTime: 30_000,
    meta: { errorMessage: "Failed to fetch today's attendance" },
  });

// ─── POST /attendance/image (multipart) ───────────────────────────────────────

export const useUploadAttendanceImage = () =>
  useMutation({
    mutationFn: ({
      dataUrl,
      filename,
    }: {
      dataUrl: string;
      filename?: string;
    }) => uploadImageMultipart(dataUrl, filename),
    meta: { errorMessage: "Failed to upload attendance image" },
  });

// ─── POST /attendance/check-in ────────────────────────────────────────────────

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckInPayload) =>
      client.post<ApiResponse<AttedanceToday>>("/attendance/check-in", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAttendanceToday"] });
    },
    meta: {
      errorMessage: "Check-in failed",
      successMessage: "Check-in successful!",
    },
  });
};

// ─── POST /attendance/{id}/check-out ─────────────────────────────────────────

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attendanceId: string) =>
      client.post<ApiResponse<AttedanceToday>>(
        `/attendance/${attendanceId}/check-out`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAttendanceToday"] });
    },
    meta: {
      errorMessage: "Check-out failed",
      successMessage: "Check-out successful!",
    },
  });
};

// ─── GET /attendance/my ────────────────────────────────────────────────────

export const useGetAttendanceHistory = () => {
  return useQuery({
    queryKey: ["getAttendanceHistory"],
    queryFn: () => client.get<ApiResponse<HistoryTable[]>>("/attendance/my?limit=5&offset=0"),
    meta: { errorMessage: "Failed to fetch history"}
  })
}
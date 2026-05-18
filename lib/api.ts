// lib/api.ts
import { getSession } from "next-auth/react";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function getAuthHeader(): Promise<string> {
  const session = await getSession();
  if (session?.accessToken) {
    return `Bearer ${session.accessToken}`;
  }
  return "";
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const authorization = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authorization && { Authorization: authorization }),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string): Promise<T> {
  const authorization = await getAuthHeader();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authorization && { Authorization: authorization }),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// hooks/use-campaign-brief-stream.ts
// Hook for campaign brief submission via SSE streaming endpoint.
// Provides real-time progress updates as the backend processes the request.

"use client";

import { useState, useRef, useCallback } from "react";
import { getSession } from "next-auth/react";
import { env } from "@/lib/env";
import type { AdsType, CampaignObjectiveKey, CampaignFormData } from "@/types/campaign";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CampaignBriefStreamPayload {
  title: string;
  type_ads: AdsType;
  objective_type: CampaignObjectiveKey;
  sub_type: string;
  form: CampaignFormData;
}

/** Shape of each SSE event from the backend */
export interface SSEProgressEvent {
  step: string;
  progress: number;   // -1 = failed, 0-99 = in progress, 100 = done
  data?: unknown;     // present only on the final success event
  error?: string;     // present only on the failure event
}

export interface UseCampaignBriefStreamOptions {
  onProgress?: (event: SSEProgressEvent) => void;
  onSuccess?: (result: unknown) => void;
  onError?: (error: Error) => void;
}

export interface UseCampaignBriefStreamReturn {
  submit: (payload: CampaignBriefStreamPayload) => Promise<void>;
  isSubmitting: boolean;
  progress: number;
  currentStep: string;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  result: unknown;
  reset: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCampaignBriefStream(
  options?: UseCampaignBriefStreamOptions
): UseCampaignBriefStreamReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [result, setResult] = useState<unknown>(undefined);

  // Keep a ref to the fetch abort controller so we can cancel if needed.
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setProgress(0);
    setCurrentStep("");
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage(undefined);
    setResult(undefined);
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const submit = useCallback(
    async (payload: CampaignBriefStreamPayload) => {
      reset();
      setIsSubmitting(true);

      const session = await getSession();
      const token = session?.accessToken;

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // SSE over POST — we use fetch + ReadableStream because EventSource
        // only supports GET requests.
        const response = await fetch(
          `${env.apiGatewayUrl}/campaign/strategy-brief/stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          }
        );

        if (!response.ok || !response.body) {
          const text = await response.text().catch(() => "Unknown error");
          throw new Error(`Request failed (${response.status}): ${text}`);
        }

        // Read the SSE stream line by line.
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by double newlines.
          const parts = buffer.split("\n\n");
          // The last element may be an incomplete event — keep it in the buffer.
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;

            const jsonStr = line.slice("data:".length).trim();
            let event: SSEProgressEvent;
            try {
              event = JSON.parse(jsonStr);
            } catch {
              continue; // skip malformed events
            }

            setProgress(event.progress);
            setCurrentStep(event.step);
            options?.onProgress?.(event);

            if (event.progress === 100) {
              setResult(event.data);
              setIsSuccess(true);
              setIsSubmitting(false);
              options?.onSuccess?.(event.data);
              return;
            }

            if (event.progress === -1) {
              const msg = event.error ?? "Strategy generation failed";
              throw new Error(msg);
            }
          }
        }

        // Stream ended without a done event — treat as success with whatever
        // result we have (edge case).
        setIsSuccess(true);
        setIsSubmitting(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // intentional cancel

        const msg = err instanceof Error ? err.message : "Failed to create campaign brief";
        setErrorMessage(msg);
        setIsError(true);
        setIsSubmitting(false);
        options?.onError?.(err instanceof Error ? err : new Error(msg));
      }
    },
    [options, reset]
  );

  return {
    submit,
    isSubmitting,
    progress,
    currentStep,
    isSuccess,
    isError,
    errorMessage,
    result,
    reset,
  };
}

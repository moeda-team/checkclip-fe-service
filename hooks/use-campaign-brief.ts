// hooks/use-campaign-brief.ts
// Hook for campaign brief submission with loading and error states.

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import type {
  AdsType,
  CampaignObjectiveKey,
  CampaignFormData
} from "@/types/campaign-brief";

const axios = axiosConfig(env.apiBaseUrl);

export interface CampaignBriefPayload {
  title: string;
  type_ads: AdsType;
  objective_type: CampaignObjectiveKey;
  sub_type: string;
  form: CampaignFormData;
}

export interface UseCampaignBriefOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCampaignBrief(options?: UseCampaignBriefOptions) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const mutation = useMutation({
    mutationFn: async (payload: CampaignBriefPayload) => {
      const response = await axios.post("/campaign/strategy-brief/", payload);
      return response.data;
    },
    onSuccess: () => {
      setErrorMessage(undefined);
      options?.onSuccess?.();
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "Failed to create campaign";
      setErrorMessage(message);
      options?.onError?.(err instanceof Error ? err : new Error(message));
    },
    meta: {
      errorMessage: "Failed to create campaign brief",
      successMessage: "Campaign brief created successfully"
    }
  });

  return {
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    errorMessage,
    reset: mutation.reset
  };
}

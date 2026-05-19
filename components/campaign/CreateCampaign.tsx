// components/campaign/CreateCampaign.tsx
// Reusable 3-step campaign creation wizard (Setup → Details → Review).

"use client";

import { useState } from "react";
import { CampaignSetupStep } from "./CampaignSetupStep";
import { CampaignDetailsStep } from "./CampaignDetailsStep";
import { CampaignReviewStep } from "./CampaignReviewStep";
import { useCampaignBrief } from "@/hooks/use-campaign-brief";
import type {
  AdsType,
  CampaignObjectiveKey,
  CampaignFormData
} from "@/types/campaign";

const defaultFormData: CampaignFormData = {
  brand: { brandName: "", description: "" },
  budget: {
    budgetType: "",
    budget: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    endDays: "",
    hasEndDate: false
  },
  audience: {
    location: "",
    age: "",
    language: "",
    gender: "all",
    interest: ""
  }
};

type ModalVariant = "confirm" | "success" | "failed";

interface CreateCampaignProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  hideAdsType?: boolean;
  entityName?: string;
  onSubmit?: (data: {
    campaignName: string;
    selectedAds: AdsType;
    selectedObjective: CampaignObjectiveKey;
    selectedSubtype: string;
    selectedConversionGoals: string[];
    formData: CampaignFormData;
  }) => Promise<void>;
}

export function CreateCampaign({
  onSuccess,
  onError,
  hideAdsType = false,
  entityName = "campaign",
  onSubmit
}: CreateCampaignProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [selectedAds, setSelectedAds] = useState<AdsType>("google");
  const [campaignName, setCampaignName] = useState("");
  const [selectedObjective, setSelectedObjective] =
    useState<CampaignObjectiveKey | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");
  const [selectedConversionGoals, setSelectedConversionGoals] = useState<
    string[]
  >([]);

  // Step 2 state
  const [formData, setFormData] = useState<CampaignFormData>(defaultFormData);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<ModalVariant>("confirm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const canProceed = !!selectedObjective && campaignName.trim().length > 0;

  const reset = () => {
    setErrorMessage(undefined);
  };

  const handleNext = () => {
    if (canProceed) setStep(2);
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
      reset();
    }
  };

  const handleObjectiveChange = (objective: CampaignObjectiveKey) => {
    setSelectedObjective(objective);
    setSelectedConversionGoals([]);
    setSelectedSubtype("");
  };

  const handleCreateClick = () => {
    setStep(3);
  };

  const handleConfirm = async () => {
    if (!selectedObjective) return;

    setModalOpen(false);
    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      if (onSubmit) {
        // Custom submit handler
        await onSubmit({
          campaignName,
          selectedAds,
          selectedObjective,
          selectedSubtype,
          selectedConversionGoals,
          formData
        });
      } else {
        // Default campaign brief submit
        const { submit } = useCampaignBrief({
          onSuccess: () => {
            setModalVariant("success");
            setModalOpen(true);
            onSuccess?.();
          },
          onError: (err) => {
            setModalVariant("failed");
            setModalOpen(true);
            onError?.(err);
          }
        });
        await submit({
          title: campaignName,
          type_ads: selectedAds,
          objective_type: selectedObjective,
          sub_type: selectedSubtype,
          form: formData
        });
        return;
      }

      setModalVariant("success");
      setModalOpen(true);
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create " + entityName;
      setErrorMessage(message);
      setModalVariant("failed");
      setModalOpen(true);
      onError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalVariant === "success") {
      // Reset to step 1 on success
      setStep(1);
      setCampaignName("");
      setSelectedObjective(null);
      setSelectedSubtype("");
      setSelectedConversionGoals([]);
      setFormData(defaultFormData);
    }
  };

  const handleReviewBack = () => {
    setStep(2);
  };

  if (step === 3 && selectedObjective) {
    return (
      <CampaignReviewStep
        campaignName={campaignName}
        selectedObjective={selectedObjective}
        selectedSubtype={selectedSubtype}
        selectedConversionGoals={selectedConversionGoals}
        formData={formData}
        onBack={handleReviewBack}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
        modalOpen={modalOpen}
        modalVariant={modalVariant}
        errorMessage={errorMessage}
        onModalClose={handleModalClose}
        entityName={entityName}
      />
    );
  }

  if (step === 2 && selectedObjective) {
    return (
      <CampaignDetailsStep
        selectedObjective={selectedObjective}
        formData={formData}
        onFormChange={setFormData}
        onBack={handleBack}
        onCreate={handleCreateClick}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <CampaignSetupStep
      selectedAds={selectedAds}
      onAdsChange={setSelectedAds}
      campaignName={campaignName}
      onNameChange={setCampaignName}
      selectedObjective={selectedObjective}
      onObjectiveChange={handleObjectiveChange}
      selectedSubtype={selectedSubtype}
      onSubtypeChange={setSelectedSubtype}
      selectedConversionGoals={selectedConversionGoals}
      onConversionGoalsChange={setSelectedConversionGoals}
      onNext={handleNext}
      canProceed={canProceed}
      hideAdsType={hideAdsType}
    />
  );
}

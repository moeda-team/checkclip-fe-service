// components/campaign/CreateCampaign.tsx
// Reusable 2-step campaign creation wizard (Setup → Details).

"use client";

import { useState } from "react";
import { CampaignSetupStep } from "./CampaignSetupStep";
import { CampaignDetailsStep } from "./CampaignDetailsStep";
import { CampaignAlertModal } from "@/components/modal/CampaignAlertModal";
import type {
  AdsType,
  AgeType,
  CampaignObjectiveKey,
  BriefFormData
} from "@/types/campaign-brief";

const defaultFormData: BriefFormData = {
  brand: {
    brandName: "",
    description: ""
  },
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
    age: "" as AgeType,
    language: "",
    gender: "all",
    interest: [],
    detail: ""
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
    formData: BriefFormData;
  }) => Promise<void>;
}

export function CreateCampaign({
  onSuccess,
  onError,
  hideAdsType = false,
  entityName = "Campaign",
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
  const [formData, setFormData] = useState<BriefFormData>(defaultFormData);

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
    // Show confirm modal before submitting
    setModalVariant("confirm");
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedObjective) return;

    // Ganti variant ke loading state — modal tetap terbuka
    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      if (onSubmit) {
        await onSubmit({
          campaignName,
          selectedAds,
          selectedObjective,
          selectedSubtype,
          selectedConversionGoals,
          formData
        });
      }

      // Langsung ganti variant ke success — modal sudah terbuka
      setModalVariant("success");
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create " + entityName;
      setErrorMessage(message);
      // Langsung ganti variant ke failed — modal sudah terbuka
      setModalVariant("failed");
      onError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalVariant === "success") {
      setStep(1);
      setCampaignName("");
      setSelectedObjective(null);
      setSelectedSubtype("");
      setSelectedConversionGoals([]);
      setFormData(defaultFormData);
    }
  };

  if (step === 2 && selectedObjective) {
    return (
      <>
        <CampaignDetailsStep
          selectedObjective={selectedObjective}
          formData={formData}
          onFormChange={setFormData}
          onBack={handleBack}
          onCreate={handleCreateClick}
          isSubmitting={isSubmitting}
        />

        {/* Confirm modal — shown before API call */}
        <CampaignAlertModal
          variant="confirm"
          open={modalOpen && modalVariant === "confirm"}
          onClose={isSubmitting ? undefined : handleModalClose}
          onContinue={handleConfirm}
          isLoading={isSubmitting}
          entityName={entityName}
        />

        {/* Success modal */}
        <CampaignAlertModal
          variant="success"
          open={modalOpen && modalVariant === "success"}
          onClose={handleModalClose}
          entityName={entityName}
        />

        {/* Failed modal */}
        <CampaignAlertModal
          variant="failed"
          open={modalOpen && modalVariant === "failed"}
          errorMessage={errorMessage}
          onClose={handleModalClose}
          entityName={entityName}
        />
      </>
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

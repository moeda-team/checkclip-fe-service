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
}

export function CreateCampaign({
  onSuccess,
  onError,
  hideAdsType = false
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

  const { submit, isSubmitting, errorMessage, reset } = useCampaignBrief({
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

  const canProceed = !!selectedObjective && campaignName.trim().length > 0;

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
    setSelectedConversionGoals([]); // Reset conversion goals when objective changes
    setSelectedSubtype("");
  };

  const handleCreateClick = () => {
    setStep(3);
  };

  const handleConfirm = async () => {
    if (!selectedObjective) return;

    setModalOpen(false);

    await submit({
      title: campaignName,
      type_ads: selectedAds,
      objective_type: selectedObjective,
      sub_type: selectedSubtype,
      form: formData
    });
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
        entityName="campaign"
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

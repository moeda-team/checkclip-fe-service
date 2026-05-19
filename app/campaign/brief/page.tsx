"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdsTypeSelector } from "@/components/card/AdsTypeSelector";
import {
  CampaignObjective,
  objectives
} from "@/components/card/CampaignObjective";
import { CampaignSubtype } from "@/components/card/CampaignSubtype";
import { CampaignFormByObjective } from "@/components/form/campaign/forms";
import { CampaignAlertModal } from "@/components/modal/CampaignAlertModal";
import { axiosConfig } from "@/lib/axios";
import { env } from "@/lib/env";
import type {
  AdsType,
  CampaignObjectiveKey,
  CampaignFormData
} from "@/types/campaign";

const axios = axiosConfig(env.apiBaseUrl);

// ─── Campaign type mapping ────────────────────────────────────────────────────

const campaignTypeMap: Record<CampaignObjectiveKey, string> = {
  awareness: "Reach · Video",
  traffic: "Search · Display",
  sales: "Performance Max",
  leads: "Performance Max",
  app_install: "App · App Installs"
};

// ─── Default form state ───────────────────────────────────────────────────────

const defaultFormData: CampaignFormData = {
  brand: { brandName: "" },
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignBriefPage() {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [selectedAds, setSelectedAds] = useState<AdsType>("google");
  const [campaignName, setCampaignName] = useState("");
  const [selectedObjective, setSelectedObjective] =
    useState<CampaignObjectiveKey | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");

  // Step 2 state
  const [formData, setFormData] = useState<CampaignFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal state
  type ModalState =
    | { open: false }
    | { open: true; variant: "confirm" }
    | { open: true; variant: "success" }
    | { open: true; variant: "failed"; errorMessage?: string };

  const [modal, setModal] = useState<ModalState>({ open: false });

  const handleObjectiveSelect = (key: CampaignObjectiveKey) => {
    setSelectedObjective(key);
    setSelectedSubtype("");
  };

  // Step 2 footer "Create" → show confirm modal first
  const handleCreateClick = () => {
    setModal({ open: true, variant: "confirm" });
  };

  // Confirm modal "Continue" → actually submit
  const handleConfirmedCreate = async () => {
    if (!selectedObjective) return;

    setModal({ open: false });
    setIsSubmitting(true);

    try {
      await axios.post("/campaign/strategy-brief/", {
        title: campaignName,
        type_ads: selectedAds,
        objective_type: selectedObjective,
        sub_type: selectedSubtype,
        form: formData
      });

      setModal({ open: true, variant: "success" });
    } catch (err) {
      setModal({
        open: true,
        variant: "failed",
        errorMessage: err instanceof Error ? err.message : undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModal({ open: false });
  };

  const canProceed = !!selectedObjective && campaignName.trim().length > 0;

  // ── Step 2 ──────────────────────────────────────────────────────────────────
  if (step === 2 && selectedObjective) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
          <CampaignFormByObjective
            objective={selectedObjective}
            data={formData}
            onChange={setFormData}
          />
        </div>

        <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={isSubmitting}
            className="px-8 h-10 rounded-lg text-sm font-medium border-gray-200"
          >
            Back
          </Button>
          <Button
            onClick={handleCreateClick}
            disabled={isSubmitting}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-10 rounded-lg text-sm font-medium"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>

        {/* Modals */}
        <CampaignAlertModal
          variant="confirm"
          open={modal.open && modal.variant === "confirm"}
          onClose={handleModalClose}
          onContinue={handleConfirmedCreate}
        />
        <CampaignAlertModal
          variant="success"
          open={modal.open && modal.variant === "success"}
          onClose={handleModalClose}
        />
        <CampaignAlertModal
          variant="failed"
          open={modal.open && modal.variant === "failed"}
          errorMessage={
            modal.open && modal.variant === "failed"
              ? modal.errorMessage
              : undefined
          }
          onClose={handleModalClose}
        />
      </div>
    );
  }

  // ── Step 1 ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Campaign Setup */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Campaign Setup
              </h2>
              <p className="text-xs text-gray-500">
                Configure the basic settings for your new marketing campaign.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Ads Type <span className="text-red-500">*</span>
              </Label>
              <AdsTypeSelector
                selected={selectedAds}
                onSelect={setSelectedAds}
              />
            </div>

            <div>
              <Label
                htmlFor="campaign-name"
                className="text-sm font-medium text-gray-700 mb-1.5 block"
              >
                Campaign Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="campaign-name"
                placeholder="Type here"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="h-10 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </section>

        {/* Campaign Objective */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Campaign Objective
              </h2>
              <p className="text-xs text-gray-500">
                Select one objective that best aligns with your campaign goals.
              </p>
            </div>
          </div>

          <CampaignObjective
            selected={selectedObjective}
            onSelect={handleObjectiveSelect}
          />
        </section>

        {/* Campaign Type & Subtype */}
        {selectedObjective && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Campaign Type
                </Label>
                <p className="text-xs text-purple-600 font-medium mb-1">
                  {campaignTypeMap[selectedObjective]}
                </p>
                <p className="text-xs text-gray-500">
                  {
                    objectives.find((o) => o.key === selectedObjective)
                      ?.description
                  }
                </p>
              </div>

              <CampaignSubtype
                objective={selectedObjective}
                value={selectedSubtype}
                onChange={setSelectedSubtype}
              />
            </div>
          </section>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white px-6 py-4 flex justify-end">
        <Button
          onClick={() => setStep(2)}
          disabled={!canProceed}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-10 rounded-lg text-sm font-medium"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

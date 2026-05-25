// components/campaign/CampaignSetupStep.tsx
// Step 1: Campaign setup (ads type, name, objective, subtype)

"use client";

import { Settings, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdsTypeSelector } from "@/components/card/AdsTypeSelector";
import {
  CampaignObjective,
  objectives
} from "@/components/card/CampaignObjective";
import { CampaignSubtype } from "@/components/card/CampaignSubtype";
import { ConversionGoalsSelector } from "@/components/card/ConversionGoalsSelector";
import type { AdsType, CampaignObjectiveKey } from "@/types/campaign";

const campaignTypeMap: Record<CampaignObjectiveKey, string> = {
  awareness: "Reach · Video",
  traffic: "Performance Max",
  sales: "Performance Max",
  leads: "Performance Max",
  app_install: "App · App Installs"
};

interface CampaignSetupStepProps {
  selectedAds: AdsType;
  onAdsChange: (ads: AdsType) => void;
  campaignName: string;
  onNameChange: (name: string) => void;
  selectedObjective: CampaignObjectiveKey | null;
  onObjectiveChange: (objective: CampaignObjectiveKey) => void;
  selectedSubtype: string;
  onSubtypeChange: (subtype: string) => void;
  selectedConversionGoals?: string[];
  onConversionGoalsChange?: (goals: string[]) => void;
  onNext: () => void;
  canProceed: boolean;
  hideAdsType?: boolean;
}

export function CampaignSetupStep({
  selectedAds,
  onAdsChange,
  campaignName,
  onNameChange,
  selectedObjective,
  onObjectiveChange,
  selectedSubtype,
  onSubtypeChange,
  selectedConversionGoals = [],
  onConversionGoalsChange,
  onNext,
  canProceed,
  hideAdsType = false
}: CampaignSetupStepProps) {
  const handleObjectiveSelect = (key: CampaignObjectiveKey) => {
    onObjectiveChange(key);
    onSubtypeChange("");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] pb-2">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 border rounded-xl">
        {/* Campaign Setup */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary-600" />
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
            {!hideAdsType && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ads Type <span className="text-red-500">*</span>
                </Label>
                <AdsTypeSelector
                  selected={selectedAds}
                  onSelect={onAdsChange}
                />
              </div>
            )}

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
                onChange={(e) => onNameChange(e.target.value)}
                className="h-10 border-gray-200 text-sm placeholder:text-gray-400 focus-visible:ring-primary-500"
              />
            </div>
          </div>
        </section>
        {/* Campaign Objective */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <LocateFixed className="w-4 h-4 text-primary-600" />
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

        {/* Conversion Goals for Performance Max, or Campaign Type & Subtype for others */}
        {selectedObjective && (
          <section>
            {campaignTypeMap[selectedObjective] === "Performance Max" ? (
              // Performance Max: Show only Conversion Goals
              <ConversionGoalsSelector
                objective={selectedObjective}
                selectedGoals={selectedConversionGoals}
                onChange={onConversionGoalsChange ?? (() => {})}
              />
            ) : (
              // Others: Show Campaign Type & Subtype
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Campaign Type
                  </Label>
                  <p className="text-xs text-primary-400 font-medium mb-1">
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
                  onChange={onSubtypeChange}
                />
              </div>
            )}
          </section>
        )}
        <div className="bg-white px-6 flex justify-end">
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-10 rounded-lg text-sm font-medium"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

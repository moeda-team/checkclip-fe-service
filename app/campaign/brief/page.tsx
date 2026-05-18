"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdsTypeSelector } from "@/components/card/AdsTypeSelector";
import { CampaignObjective, objectives } from "@/components/card/CampaignObjective";
import { CampaignSubtype, campaignSubtypeOptions } from "@/components/card/CampaignSubtype";
import type { AdsType, CampaignObjectiveKey } from "@/types/campaign";

// ─── Campaign type mapping ────────────────────────────────────────────────────

const campaignTypeMap: Record<CampaignObjectiveKey, string> = {
  awareness: "Reach · Video",
  traffic: "Search · Display",
  sales: "Performance Max",
  leads: "Performance Max",
  app_install: "App · App Installs",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignBriefPage() {
  const [selectedAds, setSelectedAds] = useState<AdsType>("google");
  const [campaignName, setCampaignName] = useState("");
  const [selectedObjective, setSelectedObjective] = useState<CampaignObjectiveKey | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");

  const handleObjectiveSelect = (key: CampaignObjectiveKey) => {
    setSelectedObjective(key);
    setSelectedSubtype("");
  };

  const handleNext = () => {
    console.log({ selectedAds, campaignName, selectedObjective, selectedSubtype });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* ── Campaign Setup ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Campaign Setup</h2>
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
              <AdsTypeSelector selected={selectedAds} onSelect={setSelectedAds} />
            </div>

            <div>
              <Label htmlFor="campaign-name" className="text-sm font-medium text-gray-700 mb-1.5 block">
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

        {/* ── Campaign Objective ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Campaign Objective</h2>
              <p className="text-xs text-gray-500">
                Select one objective that best aligns with your campaign goals.
              </p>
            </div>
          </div>

          <CampaignObjective selected={selectedObjective} onSelect={handleObjectiveSelect} />
        </section>

        {/* ── Campaign Type & Subtype ────────────────────────────────────── */}
        {selectedObjective && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Type (read-only) */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Campaign Type
                </Label>
                <p className="text-xs text-purple-600 font-medium mb-1">
                  {campaignTypeMap[selectedObjective]}
                </p>
                <p className="text-xs text-gray-500">
                  {objectives.find((o) => o.key === selectedObjective)?.description}
                </p>
              </div>

              {/* Campaign Subtype */}
              <CampaignSubtype
                objective={selectedObjective}
                value={selectedSubtype}
                onChange={setSelectedSubtype}
              />
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky Footer ─────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedObjective || !campaignName.trim()}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-10 rounded-lg text-sm font-medium"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

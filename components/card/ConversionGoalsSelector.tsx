"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Info, LocateFixed } from "lucide-react";

// Conversion goals data for Performance Max campaigns
const conversionGoals = [
  {
    id: "engagements",
    goal: "Engagements (account default)",
    source: "YouTube Hosted",
    defaultFor: "traffic"
  },
  {
    id: "phone_calls",
    goal: "Phone call leads (account default)",
    source: "Call from Ads",
    defaultFor: "leads"
  },
  {
    id: "youtube_views",
    goal: "YouTube follow-on views (account default)",
    source: "YouTube hosted"
  },
  { id: "purchases", goal: "Purchases", source: "Website", defaultFor: "sales" }
];

import type { CampaignObjectiveKey } from "@/types/campaign";

interface ConversionGoalsSelectorProps {
  objective: CampaignObjectiveKey;
  selectedGoals: string[];
  onChange: (goals: string[]) => void;
}

export function ConversionGoalsSelector({
  objective,
  selectedGoals,
  onChange
}: ConversionGoalsSelectorProps) {
  // Get the default goal ID for this objective
  const defaultGoalId = conversionGoals.find(
    (g) => g.defaultFor === objective
  )?.id;

  const handleGoalToggle = (goalId: string) => {
    // Cannot uncheck the default goal for this objective
    if (goalId === defaultGoalId) return;

    onChange(
      selectedGoals.includes(goalId)
        ? selectedGoals.filter((id) => id !== goalId)
        : [...selectedGoals, goalId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <LocateFixed className="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Conversion Goals
          </h3>
          <p className="text-xs text-gray-500">
            Configure the basic settings for your new marketing campaign.
            Minimum 1 selection is required.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800">
            Configure your website tracking using Google Tag Manager to enable
            accurate performance and conversion tracking.{" "}
            <a
              href="https://tagmanager.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-blue-900"
            >
              https://tagmanager.google.com/
            </a>
          </p>
        </div>
      </div>

      {/* Conversion Goals Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_1fr] bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div></div>
          <span className="text-sm font-medium text-gray-700">
            Conversion Goals
          </span>
          <span className="text-sm font-medium text-gray-700">
            Conversion Source
          </span>
        </div>

        {/* Table Rows */}
        {conversionGoals.map((goal) => (
          <div
            key={goal.id}
            className="grid grid-cols-[40px_1fr_1fr] items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          >
            <Checkbox
              id={goal.id}
              checked={
                selectedGoals.includes(goal.id) || goal.id === defaultGoalId
              }
              onCheckedChange={() => handleGoalToggle(goal.id)}
              disabled={goal.id === defaultGoalId}
              className="border-gray-300 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 disabled:opacity-100 disabled:cursor-not-allowed disabled:data-[state=checked]:bg-gray-400 disabled:data-[state=checked]:border-gray-400"
            />
            <label
              htmlFor={goal.id}
              className="text-sm text-gray-900 cursor-pointer"
            >
              {goal.goal}
            </label>
            <span className="text-sm text-gray-600">{goal.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

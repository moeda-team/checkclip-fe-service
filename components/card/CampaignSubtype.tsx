"use client";

import { HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import type { CampaignObjectiveKey, SubtypeOption } from "@/types/campaign";

// ─── Data ────────────────────────────────────────────────────────────────────

export const campaignSubtypeOptions: Record<
  CampaignObjectiveKey,
  SubtypeOption[]
> = {
  awareness: [
    {
      label: "Efficient reach",
      description:
        "Get the most reach for your budget using bumper, skippable in-stream, in-feed, and Shorts ads."
    },
    {
      label: "Non-skippable reach",
      description:
        "Reach people using bumper, standard non-skippable, and 30-second non-skippable in-stream ads."
    },
    {
      label: "Target frequency",
      description:
        "Reach the same people multiple times using bumper, skippable in-stream, non-skippable in-stream, in-feed, and Shorts ads."
    }
  ],
  traffic: [
    {
      label: "Standard",
      description:
        "Drive traffic to your website with standard search and display ads."
    },
    {
      label: "Dynamic Search Ads",
      description:
        "Automatically generate ads based on your website content to capture relevant searches."
    }
  ],
  sales: [
    {
      label: "Standard Performance Max",
      description:
        "Access all Google channels in a single campaign to maximize conversions."
    },
    {
      label: "Retail",
      description:
        "Optimized for retail businesses with product feeds to drive online and in-store sales."
    }
  ],
  leads: [
    {
      label: "Standard Performance Max",
      description:
        "Use all Google channels to generate leads and conversions at scale."
    },
    {
      label: "Lead form",
      description:
        "Collect leads directly from your ads with a built-in form without leaving Google."
    }
  ],
  app_install: [
    {
      label: "App installs",
      description:
        "Drive new users to install your Android or iOS app across Google Search, Play, YouTube, and more."
    },
    {
      label: "App engagement",
      description:
        "Re-engage existing users and encourage them to take specific actions within your app."
    },
    {
      label: "App pre-registration",
      description:
        "Build anticipation and grow your audience before your app launches on Google Play."
    }
  ]
};

// ─── Props ───────────────────────────────────────────────────────────────────

type Props = {
  objective: CampaignObjectiveKey;
  value: string;
  onChange: (value: string) => void;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function CampaignSubtype({ objective, value, onChange }: Props) {
  const options = campaignSubtypeOptions[objective];
  const selectedDescription = options.find(
    (s) => s.label === value
  )?.description;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        Campaign Subtype
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="max-w-xs text-xs bg-gray-900 text-white"
          >
            {selectedDescription ?? "Select a subtype to see its description."}
          </TooltipContent>
        </Tooltip>
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 border-gray-200 text-sm focus:ring-primary-500">
          <SelectValue placeholder="Choose campaign subtype">
            {value || "Choose campaign subtype"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((sub) => (
            <SelectItem
              key={sub.label}
              value={sub.label}
              className="items-start py-2"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-gray-900 text-sm">
                  {sub.label}
                </span>
                <span className="text-xs text-gray-500 whitespace-normal max-w-70 leading-relaxed">
                  {sub.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Description shown below after selection */}
      {selectedDescription && (
        <p className="text-xs text-gray-500 leading-relaxed">
          {selectedDescription}
        </p>
      )}
    </div>
  );
}

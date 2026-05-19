"use client";

import {
  Megaphone,
  Users,
  DollarSign,
  FileText,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CampaignObjectiveKey,
  CampaignObjectiveType
} from "@/types/campaign";

// ─── Data ────────────────────────────────────────────────────────────────────

export const objectives: CampaignObjectiveType[] = [
  {
    key: "awareness",
    label: "Awareness",
    badge: "Reach · Video",
    badgeColor: "bg-primary-100 text-primary-700",
    description:
      "Drive awareness and consideration of your product or brand. Reach the maximum number of people.",
    icon: <Megaphone className="w-10 h-10 text-white" />
  },
  {
    key: "traffic",
    label: "Traffic",
    badge: "Performance Max",
    badgeColor: "bg-blue-100 text-blue-700",
    description:
      "Get the right people to visit your website. Drive website traffic by reaching the right people wherever they're browsing with ads on Google Search, YouTube, Display, and more.",
    icon: <Users className="w-10 h-10 text-white" />
  },
  {
    key: "sales",
    label: "Sales",
    badge: "Performance Max",
    badgeColor: "bg-blue-100 text-blue-700",
    description:
      "Drive sales online, in app, by phone, or in store. Drive sales by reaching the right people wherever they're browsing with ads on Google Search, YouTube, Display, and more.",
    icon: <DollarSign className="w-10 h-10 text-white" />
  },
  {
    key: "leads",
    label: "Leads",
    badge: "Performance Max",
    badgeColor: "bg-blue-100 text-blue-700",
    description:
      "Get leads and other conversions by encouraging customers to take action. Generate leads by reaching the right people wherever they're browsing with ads on Google, YouTube, Display, and more.",
    icon: <FileText className="w-10 h-10 text-white" />
  },
  {
    key: "app_install",
    label: "App Install",
    badge: "App · App Installs",
    badgeColor: "bg-teal-100 text-teal-700",
    description:
      "Get more installs, engagement and pre-registration for your app. Promote your Android or iOS app on Google Search, Play, YouTube and partner sites with app ads.",
    icon: <Smartphone className="w-10 h-10 text-white" />
  }
];

// ─── Props ───────────────────────────────────────────────────────────────────

type Props = {
  selected: CampaignObjectiveKey | null;
  onSelect: (key: CampaignObjectiveKey) => void;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function CampaignObjective({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {objectives.map((obj) => (
        <button
          key={obj.key}
          type="button"
          onClick={() => onSelect(obj.key)}
          className={cn(
            "text-left rounded-xl border transition-all overflow-hidden flex flex-col h-full",
            selected === obj.key
              ? "border-primary-500 ring-2 ring-primary-200"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          {/* Icon banner — fixed height */}
          <div className="h-28 shrink-0 bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
            {obj.icon}
          </div>
          {/* Content — grows to fill remaining space */}
          <div className="flex flex-col flex-1 p-4 gap-1.5">
            <p className="text-sm font-semibold text-gray-900">{obj.label}</p>
            <span
              className={cn(
                "inline-block w-fit text-xs px-2 py-0.5 rounded-full font-medium",
                obj.badgeColor
              )}
            >
              {obj.badge}
            </span>
            <p className="text-xs text-gray-500 leading-relaxed mt-auto pt-1">
              {obj.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

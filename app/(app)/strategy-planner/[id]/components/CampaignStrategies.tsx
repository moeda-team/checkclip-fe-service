"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

interface CampaignStrategy {
  id: string;
  title: string;
  scenario: "conservative" | "base" | "aggressive";
  description: string;
  platforms: string[];
  budget: string;
  expectedRoi: string;
  timeline: string;
  kpis: {
    pipelineGenerated: string;
    meetingBookingRate: string;
    accountEngagementScore: string;
  };
  tactics: string[];
}

const campaignStrategies: CampaignStrategy[] = [
  {
    id: "1",
    title: "Mid-Market Demand Gen",
    scenario: "conservative",
    description:
      "Scale lead generation for mid-market segment through content-led campaigns",
    platforms: ["google", "meta"],
    budget: "$280",
    expectedRoi: "310%",
    timeline: "Apr-Dec 2026",
    kpis: {
      pipelineGenerated: "$180",
      meetingBookingRate: "12%",
      accountEngagementScore: "12%"
    },
    tactics: [
      "Personalized landing pages per account",
      "LinkedIn InMail sequences",
      "Custom webinar invitations",
      "Executive dinner events"
    ]
  },
  {
    id: "2",
    title: "Customer Expansion Program",
    scenario: "conservative",
    description:
      "Penetrate top 50 enterprise accounts with personalized multi-touch campaigns",
    platforms: ["google", "meta"],
    budget: "$480",
    expectedRoi: "380%",
    timeline: "Apr-Sep 2026",
    kpis: {
      pipelineGenerated: "$180",
      meetingBookingRate: "12%",
      accountEngagementScore: "12%"
    },
    tactics: [
      "Personalized landing pages per account",
      "LinkedIn InMail sequences",
      "Custom webinar invitations",
      "Executive dinner events"
    ]
  },
  {
    id: "3",
    title: "Enterprise ABM Campaign",
    scenario: "base",
    description: "Target Fortune 500 companies with account-based marketing",
    platforms: ["google", "linkedin"],
    budget: "$650",
    expectedRoi: "420%",
    timeline: "Jan-Jun 2026",
    kpis: {
      pipelineGenerated: "$320",
      meetingBookingRate: "18%",
      accountEngagementScore: "25%"
    },
    tactics: [
      "1:1 personalized content",
      "Direct mail campaigns",
      "Executive briefings",
      "VIP event invitations"
    ]
  },
  {
    id: "4",
    title: "Product Launch Push",
    scenario: "aggressive",
    description: "Maximize awareness and adoption for new product line",
    platforms: ["google", "meta", "tiktok"],
    budget: "$920",
    expectedRoi: "550%",
    timeline: "Mar-Aug 2026",
    kpis: {
      pipelineGenerated: "$580",
      meetingBookingRate: "22%",
      accountEngagementScore: "35%"
    },
    tactics: [
      "Influencer partnerships",
      "Viral social campaigns",
      "Launch events",
      "PR blitz"
    ]
  }
];

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "google") {
    return (
      <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
        G
      </div>
    );
  }
  if (platform === "meta") {
    return (
      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </div>
    );
  }
  if (platform === "linkedin") {
    return (
      <div className="w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center">
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
      <svg
        className="w-4 h-4 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    </div>
  );
}

function ScenarioBadge({
  scenario,
  count,
  selected,
  onClick
}: {
  scenario: string;
  count: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
        selected
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <span
        className={`text-xs font-medium capitalize ${selected ? "text-primary-700" : "text-gray-600"}`}
      >
        {scenario}
      </span>
      <div
        className={`text-lg font-semibold ${selected ? "text-primary-700" : "text-gray-900"}`}
      >
        {count}
      </div>
    </button>
  );
}

function CampaignStrategyCard({ strategy }: { strategy: CampaignStrategy }) {
  const scenarioColors: Record<string, string> = {
    conservative: "#0ea5e9",
    base: "#8b5cf6",
    aggressive: "#f97316"
  };
  const color = scenarioColors[strategy.scenario];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: color }}
        >
          <Star className="w-4 h-4 text-white" fill="white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{strategy.title}</h3>
          <span
            className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full capitalize"
            style={{
              backgroundColor: `${color}15`,
              color: color
            }}
          >
            {strategy.scenario}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-3">{strategy.description}</p>

      {/* Platforms */}
      <div className="flex gap-2 mb-4">
        {strategy.platforms.map((platform) => (
          <PlatformIcon key={platform} platform={platform} />
        ))}
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-purple-50 rounded-lg p-2">
          <div className="text-xs text-purple-600 mb-1">Budget</div>
          <div className="text-sm font-medium text-gray-900">
            {strategy.budget}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2">
          <div className="text-xs text-purple-600 mb-1">Expected ROI</div>
          <div className="text-sm font-medium text-gray-900">
            {strategy.expectedRoi}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2">
          <div className="text-xs text-purple-600 mb-1">Timeline</div>
          <div className="text-sm font-medium text-gray-900">
            {strategy.timeline}
          </div>
        </div>
      </div>

      {/* Target KPIs */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-purple-600 mb-2">
          Target KPIs
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pipeline Generated</span>
            <span className="font-medium">
              {strategy.kpis.pipelineGenerated}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Meeting Booking Rate</span>
            <span className="font-medium">
              {strategy.kpis.meetingBookingRate}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Account Engagement Score</span>
            <span className="font-medium">
              {strategy.kpis.accountEngagementScore}
            </span>
          </div>
        </div>
      </div>

      {/* Key Tactics */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-purple-600 mb-2">
          Key Tactics
        </h4>
        <div className="flex flex-wrap gap-2">
          {strategy.tactics.map((tactic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {tactic}
            </span>
          ))}
        </div>
      </div>

      {/* Accept Button */}
      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
        Accept
      </Button>
    </div>
  );
}

export function CampaignStrategies() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  return (
    <>
      {/* Scenario Count Badges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <ScenarioBadge
          scenario="conservative"
          count={2}
          selected={selectedScenario === "conservative"}
          onClick={() => setSelectedScenario("conservative")}
        />
        <ScenarioBadge
          scenario="base"
          count={2}
          selected={selectedScenario === "base"}
          onClick={() => setSelectedScenario("base")}
        />
        <ScenarioBadge
          scenario="aggressive"
          count={2}
          selected={selectedScenario === "aggressive"}
          onClick={() => setSelectedScenario("aggressive")}
        />
      </div>

      {/* Campaign Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaignStrategies.map((strategy) => (
          <CampaignStrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </>
  );
}

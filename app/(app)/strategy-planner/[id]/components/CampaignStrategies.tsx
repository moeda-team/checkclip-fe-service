"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  LocateFixed,
  Megaphone,
  Shield,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiLine, SiMeta } from "react-icons/si";
import { useState, useMemo } from "react";
import { useGetStrategyPlanner } from "@/app/(app)/strategy-planner/hooks/useStrategyPlanner";

interface CampaignStrategy {
  id: string;
  title: string;
  scenario: "conservative" | "base" | "aggressive";
  description: string;
  platforms: string[];
  campaignType: string;
  budget: string;
  expectedRoi: string;
  timeline: string;
  kpis: {
    reach: string;
    impressions: string;
    cpm: string;
  };
}

interface CampaignStrategiesProps {
  id: string;
}

// Transform API result_ai into campaign strategies (3 cards per platform)
function transformApiData(data: any): CampaignStrategy[] {
  if (!data?.result_ai || !Array.isArray(data.result_ai)) {
    return [];
  }

  const strategies: CampaignStrategy[] = [];
  // Get the campaign name from the strategy planner data
  const campaignName = data.title || "Campaign Strategy";

  data.result_ai.forEach((item: any, platformIndex: number) => {
    const platform = item.platform || "google";
    const result = item.result || {};

    const scenarioEntries: {
      key: "conservative" | "base" | "aggressive";
      data: any;
      label: string;
    }[] = [
      {
        key: "conservative",
        data: result.conservative || {},
        label: "Conservative"
      },
      { key: "base", data: result.base_case || {}, label: "Base Case" },
      { key: "aggressive", data: result.aggressive || {}, label: "Aggressive" }
    ];

    scenarioEntries.forEach(({ key, data: scenarioData, label }) => {
      const budgetSim = scenarioData.budget_simulation || {};
      const roi = scenarioData.roi || {};

      // Format budget
      const budgetUsd = budgetSim.budget_usd || 0;
      const budget = budgetUsd > 0 ? `$${budgetUsd}` : "N/A";

      // Format ROI
      const roiPct = roi.roi_pct;
      const expectedRoi =
        roiPct !== null && roiPct !== undefined ? `${roiPct}%` : "N/A";

      // Use notes as description
      const description =
        scenarioData.notes || `${label} strategy for ${platform}`;

      // Calculate derived metrics
      const estImpressions = budgetSim.est_impressions || 0;
      const estClicks = budgetSim.est_clicks || 0;
      const budgetUsdValue = budgetSim.budget_usd || 0;
      const cpm =
        budgetUsdValue > 0 && estImpressions > 0
          ? ((budgetUsdValue / estImpressions) * 1000).toFixed(2)
          : "N/A";

      strategies.push({
        id: `${platform}-${key}-${platformIndex}`,
        title: `${campaignName} — ${label}`,
        scenario: key,
        description,
        platforms: [platform],
        campaignType: result.matched_interest || "Awareness",
        budget,
        expectedRoi,
        timeline: "N/A",
        kpis: {
          reach: estClicks > 0 ? estClicks.toLocaleString() : "N/A",
          impressions:
            estImpressions > 0 ? estImpressions.toLocaleString() : "N/A",
          cpm: cpm !== "N/A" ? `$${cpm}` : "N/A"
        }
      });
    });
  });

  return strategies;
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "google") {
    return <FcGoogle className="w-4 h-4" />;
  }
  if (platform === "meta") {
    return <SiMeta className="w-4 h-4 text-[#0081FB]" />;
  }
  if (platform === "line") {
    return <SiLine className="w-4 h-4 text-[#06C755]" />;
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

// Scenario icon component
function ScenarioIcon({
  scenario,
  className
}: {
  scenario: string;
  className?: string;
}) {
  if (scenario === "aggressive") {
    return <Zap className={className} />;
  }
  if (scenario === "conservative") {
    return <Shield className={className} />;
  }
  return <Target className={className} />;
}

function CampaignStrategyCard({ strategy }: { strategy: CampaignStrategy }) {
  const scenarioColors: Record<
    string,
    { bg: string; text: string; lightBg: string }
  > = {
    conservative: { bg: "#0ea5e9", text: "#0284c7", lightBg: "#e0f2fe" },
    base: { bg: "#8b5cf6", text: "#7c3aed", lightBg: "#ede9fe" },
    aggressive: { bg: "#f97316", text: "#ea580c", lightBg: "#ffedd5" }
  };
  const color = scenarioColors[strategy.scenario];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header: Icon + Title + Scenario Badge */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: color.bg }}
        >
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base">
            {strategy.title}
          </h3>
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 text-xs rounded-full"
            style={{
              backgroundColor: color.lightBg,
              color: color.text
            }}
          >
            <ScenarioIcon scenario={strategy.scenario} className="w-3 h-3" />
            <span className="capitalize">{strategy.scenario}</span>
          </div>
        </div>
      </div>

      {/* Platform Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 text-sm">
          <Megaphone className="w-4 h-4" color="#8b5cf6" />
          <span>{strategy.campaignType}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 text-sm">
          <PlatformIcon platform={strategy.platforms[0]} />
          <span>
            {strategy.platforms[0]?.charAt(0).toUpperCase() +
              strategy.platforms[0]?.slice(1) || "Google"}{" "}
            Ads
          </span>
        </span>
      </div>

      {/* Metric Boxes */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-purple-50 rounded-lg px-1 py-2">
          <div className="flex items-center gap-1.5 text-xs text-purple-600 mb-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Budget</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {strategy.budget}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg px-1 py-2">
          <div className="flex items-center gap-1.5 text-xs text-purple-600 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Expect. ROI</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {strategy.expectedRoi}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg px-1 py-2">
          <div className="flex items-center gap-1.5 text-xs text-purple-600 mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {strategy.timeline}
          </div>
        </div>
      </div>

      {/* Target KPIs */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <LocateFixed className="w-4 h-4" color="#8b5cf6" />
          <h4 className="text-sm font-semibold text-purple-600">Target KPIs</h4>
        </div>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span>Reach</span>
            <span className="font-semibold text-gray-900">
              {strategy.kpis.reach}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Impressions</span>
            <span className="font-semibold text-gray-900">
              {strategy.kpis.impressions}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>CPM (Cost Per 1,000 Impressions)</span>
            <span className="font-semibold text-gray-900">
              {strategy.kpis.cpm}
            </span>
          </div>
        </div>
      </div>

      {/* Accept Button */}
      <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-11 text-sm font-medium rounded-lg">
        Accept
      </Button>
    </div>
  );
}

export function CampaignStrategies({ id }: CampaignStrategiesProps) {
  const { data, isLoading, error } = useGetStrategyPlanner(id);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Transform API data to campaign strategies
  const campaignStrategies = useMemo(() => {
    if (!data?.data) return [];
    return transformApiData(data.data);
  }, [data]);

  // Count strategies by scenario
  const scenarioCounts = useMemo(() => {
    return {
      conservative: campaignStrategies.filter(
        (s) => s.scenario === "conservative"
      ).length,
      base: campaignStrategies.filter((s) => s.scenario === "base").length,
      aggressive: campaignStrategies.filter((s) => s.scenario === "aggressive")
        .length
    };
  }, [campaignStrategies]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading campaign strategies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">Failed to load campaign strategies</div>
      </div>
    );
  }

  if (campaignStrategies.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">No campaign strategies available</div>
      </div>
    );
  }

  return (
    <>
      {/* Scenario Count Badges */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <ScenarioBadge
          scenario="conservative"
          count={scenarioCounts.conservative}
          selected={selectedScenario === "conservative"}
          onClick={() => setSelectedScenario("conservative")}
        />
        <ScenarioBadge
          scenario="base"
          count={scenarioCounts.base}
          selected={selectedScenario === "base"}
          onClick={() => setSelectedScenario("base")}
        />
        <ScenarioBadge
          scenario="aggressive"
          count={scenarioCounts.aggressive}
          selected={selectedScenario === "aggressive"}
          onClick={() => setSelectedScenario("aggressive")}
        />
      </div>

      {/* Campaign Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {campaignStrategies.map((strategy) => (
          <CampaignStrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </>
  );
}

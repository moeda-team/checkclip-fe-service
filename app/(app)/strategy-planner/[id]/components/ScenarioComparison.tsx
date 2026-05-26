"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetStrategyPlanner } from "@/app/(app)/strategy-planner/hooks/useStrategyPlanner";
import { FcGoogle } from "react-icons/fc";
import { SiLine, SiMeta } from "react-icons/si";
import { Shield, Target, Zap } from "lucide-react";

interface ScenarioComparisonProps {
  id: string;
}

interface PlatformData {
  platform: string;
  reach: number;
  impressions: number;
  cpm: string;
  frequency: string;
  videoViews: number;
  roi: string;
}

interface ScenarioData {
  key: "conservative" | "base" | "aggressive";
  name: string;
  description: string;
  color: string;
  textColor: string;
  lightBg: string;
  platforms: PlatformData[];
}

const PLATFORMS = ["google", "meta", "line"];

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "google") return <FcGoogle className="w-4 h-4" />;
  if (platform === "meta") return <SiMeta className="w-4 h-4 text-[#0081FB]" />;
  if (platform === "line") return <SiLine className="w-4 h-4 text-[#06C755]" />;
  return null;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function transformApiData(data: any): ScenarioData[] {
  if (!data?.result_ai || !Array.isArray(data.result_ai)) {
    return [];
  }

  const scenarios: ScenarioData[] = [
    {
      key: "conservative",
      name: "Conservative",
      description: "Stability & Risk Mitigation",
      color: "#0ea5e9",
      textColor: "#0284c7",
      lightBg: "#e0f2fe",
      platforms: []
    },
    {
      key: "base",
      name: "Base Case",
      description: "Balanced Growth & Efficiency",
      color: "#8b5cf6",
      textColor: "#7c3aed",
      lightBg: "#ede9fe",
      platforms: []
    },
    {
      key: "aggressive",
      name: "Aggressive",
      description: "Maximum Growth & Market Capture",
      color: "#f97316",
      textColor: "#ea580c",
      lightBg: "#ffedd5",
      platforms: []
    }
  ];

  data.result_ai.forEach((item: any) => {
    const platform = item.platform || "google";
    const result = item.result || {};

    scenarios.forEach((scenario) => {
      const scenarioKey = scenario.key === "base" ? "base_case" : scenario.key;
      const scenarioData = result[scenarioKey] || {};
      const budgetSim = scenarioData.budget_simulation || {};
      const roi = scenarioData.roi || {};

      const budgetUsd = budgetSim.budget_usd || 0;
      const estImpressions = budgetSim.est_impressions || 0;
      const estClicks = budgetSim.est_clicks || 0;

      const cpm =
        budgetUsd > 0 && estImpressions > 0
          ? ((budgetUsd / estImpressions) * 1000).toFixed(2)
          : "0.00";

      const roiValue = roi.roi_pct ? `${roi.roi_pct}%` : "0%";

      // Calculate frequency (mock logic based on impressions/clicks ratio)
      const frequency =
        estClicks > 0 ? (estImpressions / estClicks).toFixed(1) : "1.0";

      // Mock video views (30% of clicks for demo)
      const videoViews = Math.round(estClicks * 0.3);

      scenario.platforms.push({
        platform,
        reach: estClicks,
        impressions: estImpressions,
        cpm: `$${cpm}`,
        frequency: `${frequency}x`,
        videoViews,
        roi: roiValue
      });
    });
  });

  return scenarios;
}

function ScenarioCard({
  scenario,
  activePlatform,
  onPlatformChange
}: {
  scenario: ScenarioData;
  activePlatform: string;
  onPlatformChange: (platform: string) => void;
}) {
  const platformData = scenario.platforms.find(
    (p) => p.platform === activePlatform
  );

  const metrics = [
    {
      label: "Reach (Audience Reach)",
      value: formatNumber(platformData?.reach || 0)
    },
    {
      label: "Impressions (Total Ad Impressions)",
      value: formatNumber(platformData?.impressions || 0)
    },
    {
      label: "CPM (Cost Per 1,000 Impressions)",
      value: platformData?.cpm || "$0.00"
    },
    {
      label: "Frequency (Average Ad Frequency)",
      value: platformData?.frequency || "0.0x"
    },
    {
      label: "Video Views (Total Video Views)",
      value: formatNumber(platformData?.videoViews || 0)
    },
    { label: "ROI (Return on Investment)", value: platformData?.roi || "0%" }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: scenario.color }}
        >
          {scenario.key === "conservative" && (
            <Shield className="w-5 h-5 text-white" />
          )}
          {scenario.key === "base" && <Target className="w-5 h-5 text-white" />}
          {scenario.key === "aggressive" && (
            <Zap className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
          <p className="text-xs text-gray-500">{scenario.description}</p>
        </div>
      </div>

      {/* Platform Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
          <PlatformIcon platform={activePlatform} />
          <span className="capitalize">{activePlatform} Ads</span>
        </span>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{metric.label}</span>
            <span className="font-semibold text-gray-900">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScenarioComparison({ id }: ScenarioComparisonProps) {
  const { data, isLoading, error } = useGetStrategyPlanner(id);
  const [activePlatform, setActivePlatform] = useState("google");

  const scenarios = useMemo(() => {
    if (!data?.data) return [];
    return transformApiData(data.data);
  }, [data]);

  // Get comparison metrics for table
  const comparisonRows = [
    { key: "reach", label: "Reach (Audience Reach)" },
    { key: "impressions", label: "Impressions (Total Ad Impressions)" },
    { key: "cpm", label: "CPM (Cost Per 1,000 Impressions)" },
    { key: "frequency", label: "Frequency (Average Ad Frequency)" },
    { key: "videoViews", label: "Video Views (Total Video Views)" },
    { key: "roi", label: "ROI (Return on Investment)" }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading scenario comparison...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">Failed to load scenario comparison</div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">No scenario data available</div>
      </div>
    );
  }

  return (
    <>
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.key}
            scenario={scenario}
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
          />
        ))}
      </div>

      {/* Detailed Metric Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 6-6" />
            </svg>
            <span className="font-medium text-sm">
              Detailed Metric Comparison
            </span>
          </div>
          {/* Platform Tabs */}
          <Tabs value={activePlatform} onValueChange={setActivePlatform}>
            <TabsList className="h-8">
              {PLATFORMS.map((platform) => (
                <TabsTrigger
                  key={platform}
                  value={platform}
                  className="text-xs px-2 py-1"
                >
                  <span className="flex items-center gap-1">
                    <PlatformIcon platform={platform} />
                    <span className="capitalize">{platform} Ads</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Metric
              </TableHead>
              <TableHead
                className="text-xs font-medium"
                style={{ color: scenarios[0]?.color }}
              >
                Conservative
              </TableHead>
              <TableHead
                className="text-xs font-medium"
                style={{ color: scenarios[1]?.color }}
              >
                Base Case
              </TableHead>
              <TableHead
                className="text-xs font-medium"
                style={{ color: scenarios[2]?.color }}
              >
                Aggressive
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Delta (Agg vs Con)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonRows.map((row) => {
              const conValue =
                scenarios[0]?.platforms.find(
                  (p) => p.platform === activePlatform
                )?.[row.key as keyof PlatformData] || 0;
              const baseValue =
                scenarios[1]?.platforms.find(
                  (p) => p.platform === activePlatform
                )?.[row.key as keyof PlatformData] || 0;
              const aggValue =
                scenarios[2]?.platforms.find(
                  (p) => p.platform === activePlatform
                )?.[row.key as keyof PlatformData] || 0;

              // Calculate delta for numeric values
              let delta = "-";
              if (
                typeof conValue === "number" &&
                typeof aggValue === "number"
              ) {
                const diff = aggValue - conValue;
                delta =
                  diff >= 0 ? `+${formatNumber(diff)}` : formatNumber(diff);
              } else if (row.key === "cpm" || row.key === "roi") {
                delta = "—";
              }

              return (
                <TableRow key={row.key} className="hover:bg-gray-50/50">
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {row.label}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {typeof conValue === "number"
                      ? formatNumber(conValue)
                      : conValue}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {typeof baseValue === "number"
                      ? formatNumber(baseValue)
                      : baseValue}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {typeof aggValue === "number"
                      ? formatNumber(aggValue)
                      : aggValue}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-600">
                    {delta}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: "shield" | "target" | "aggressive";
  color: string;
  metrics: {
    projectedRevenue: string;
    revenueGrowth: string;
    marketShare: string;
    targetRoi: string;
    cac: string;
    ltv: string;
    ltvCacRatio: string;
    investment: string;
    newHeadcount: string;
    riskLevel: string;
  };
}

const scenarios: Scenario[] = [
  {
    id: "conservative",
    name: "Conservative",
    description: "Stability & Risk Mitigation",
    icon: "shield",
    color: "#0ea5e9",
    metrics: {
      projectedRevenue: "$480",
      revenueGrowth: "+12%",
      marketShare: "8.2%",
      targetRoi: "280%",
      cac: "$45",
      ltv: "$380",
      ltvCacRatio: "8.4x",
      investment: "$85",
      newHeadcount: "+3",
      riskLevel: "Low"
    }
  },
  {
    id: "base",
    name: "Base Case",
    description: "Balanced Growth & Efficiency",
    icon: "target",
    color: "#8b5cf6",
    metrics: {
      projectedRevenue: "$480",
      revenueGrowth: "+12%",
      marketShare: "8.2%",
      targetRoi: "280%",
      cac: "$45",
      ltv: "$380",
      ltvCacRatio: "8.4x",
      investment: "$85",
      newHeadcount: "+3",
      riskLevel: "Low"
    }
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "Maximum Growth & Market Capture",
    icon: "aggressive",
    color: "#f97316",
    metrics: {
      projectedRevenue: "$480",
      revenueGrowth: "+12%",
      marketShare: "8.2%",
      targetRoi: "280%",
      cac: "$45",
      ltv: "$380",
      ltvCacRatio: "8.4x",
      investment: "$85",
      newHeadcount: "+3",
      riskLevel: "Low"
    }
  }
];

const comparisonMetrics = [
  { key: "projectedRevenue", label: "Projected Revenue" },
  { key: "revenueGrowth", label: "Revenue Growth" },
  { key: "marketShare", label: "Market Share" },
  { key: "targetRoi", label: "ROI Target" },
  { key: "cac", label: "Customer Acquisition Cost" },
  { key: "ltv", label: "Lifetime Value" },
  { key: "ltvCacRatio", label: "LTV:CAC Ratio" },
  { key: "investment", label: "Investment Required" },
  { key: "newHeadcount", label: "New Headcount" },
  { key: "riskLevel", label: "Risk Level" }
];

function ScenarioIcon({ type, color }: { type: string; color: string }) {
  if (type === "conservative") {
    return (
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </div>
    );
  }
  if (type === "base") {
    return (
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start gap-3 mb-4">
        <ScenarioIcon type={scenario.icon} color={scenario.color} />
        <div>
          <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
          <p className="text-xs text-gray-500">{scenario.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Projected Revenue</span>
          <span className="font-medium">
            {scenario.metrics.projectedRevenue}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Revenue Growth</span>
          <span className="font-medium">{scenario.metrics.revenueGrowth}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Market Share</span>
          <span className="font-medium">{scenario.metrics.marketShare}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Target ROI</span>
          <span className="font-medium">{scenario.metrics.targetRoi}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">CAC</span>
          <span className="font-medium">{scenario.metrics.cac}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">LTV</span>
          <span className="font-medium">{scenario.metrics.ltv}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">LTV:CAC Ratio</span>
          <span className="font-medium">{scenario.metrics.ltvCacRatio}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Investment</span>
          <span className="font-medium">{scenario.metrics.investment}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">New Headcount</span>
          <span className="font-medium">{scenario.metrics.newHeadcount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Risk Level</span>
          <span className="font-medium">{scenario.metrics.riskLevel}</span>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-4 flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-900 py-2 border-t border-gray-100"
      >
        View Details
        <ChevronLeft
          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : "-rotate-90"}`}
        />
      </button>
    </div>
  );
}

export function ScenarioComparison() {
  return (
    <>
      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>

      {/* Detailed Metric Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
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
                style={{ color: scenarios[0].color }}
              >
                Conservative
              </TableHead>
              <TableHead
                className="text-xs font-medium"
                style={{ color: scenarios[1].color }}
              >
                Base Case
              </TableHead>
              <TableHead
                className="text-xs font-medium"
                style={{ color: scenarios[2].color }}
              >
                Aggressive
              </TableHead>
              <TableHead className="text-xs font-medium text-gray-500">
                Delta (Agg vs Con)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonMetrics.map((metric) => (
              <TableRow key={metric.key} className="hover:bg-gray-50/50">
                <TableCell>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="text-sm text-gray-900">
                  {metric.label}
                </TableCell>
                <TableCell className="text-sm">
                  {
                    scenarios[0].metrics[
                      metric.key as keyof Scenario["metrics"]
                    ]
                  }
                </TableCell>
                <TableCell className="text-sm">
                  {
                    scenarios[1].metrics[
                      metric.key as keyof Scenario["metrics"]
                    ]
                  }
                </TableCell>
                <TableCell className="text-sm">
                  {
                    scenarios[2].metrics[
                      metric.key as keyof Scenario["metrics"]
                    ]
                  }
                </TableCell>
                <TableCell className="text-sm">
                  {
                    scenarios[2].metrics[
                      metric.key as keyof Scenario["metrics"]
                    ]
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Eye,
  Percent,
  Target,
  Megaphone,
  Filter,
  ArrowUpDown,
  Plus,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CampaignStatus = "Active" | "Draft" | "Paused" | "Completed";
type CampaignType = "Email" | "Content" | "Social" | "Search" | "Display";

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  dateRange: string;
  budget: number;
  ctr: number;
  cvr: number;
  dueDate: string;
  spent: number;
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Spring Product Launch 2026",
    type: "Email",
    status: "Active",
    dateRange: "03-01",
    budget: 2500000,
    ctr: 5.0,
    cvr: 7.51,
    dueDate: "2026-03-31",
    spent: 1850000
  },
  {
    id: "2",
    name: "Enterprise Webinar Series",
    type: "Content",
    status: "Active",
    dateRange: "02-15",
    budget: 1200000,
    ctr: 7.0,
    cvr: 4.8,
    dueDate: "2026-04-15",
    spent: 680000
  },
  {
    id: "3",
    name: "LinkedIn Lead Generation",
    type: "Social",
    status: "Active",
    dateRange: "01-15",
    budget: 3000000,
    ctr: 4.0,
    cvr: 7.0,
    dueDate: "2026-04-15",
    spent: 2100000
  },
  {
    id: "4",
    name: "Google Search - Brand Terms",
    type: "Search",
    status: "Active",
    dateRange: "01-01",
    budget: 1800000,
    ctr: 6.0,
    cvr: 15.0,
    dueDate: "2026-06-30",
    spent: 1440000
  },
  {
    id: "5",
    name: "Display Retargeting Q1",
    type: "Display",
    status: "Completed",
    dateRange: "01-01",
    budget: 800000,
    ctr: 1.0,
    cvr: 5.0,
    dueDate: "2026-03-15",
    spent: 780000
  },
  {
    id: "6",
    name: "New Year Email Blast",
    type: "Email",
    status: "Completed",
    dateRange: "12-25",
    budget: 500000,
    ctr: 7.0,
    cvr: 8.0,
    dueDate: "2026-01-15",
    spent: 480000
  },
  {
    id: "7",
    name: "Q2 Product Awareness",
    type: "Display",
    status: "Draft",
    dateRange: "04-01",
    budget: 2000000,
    ctr: 0.0,
    cvr: 0.0,
    dueDate: "2026-06-30",
    spent: 0
  },
  {
    id: "8",
    name: "Customer Success Stories",
    type: "Content",
    status: "Paused",
    dateRange: "02-01",
    budget: 600000,
    ctr: 7.0,
    cvr: 5.02,
    dueDate: "2026-05-31",
    spent: 210000
  }
];

const tabs: { label: string; filter: CampaignStatus | "All" }[] = [
  { label: "All Campaigns", filter: "All" },
  { label: "Active", filter: "Active" },
  { label: "Draft", filter: "Draft" },
  { label: "Paused", filter: "Paused" },
  { label: "Completed", filter: "Completed" }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatYen(n: number): string {
  return `¥${n.toLocaleString("en-US")}`;
}

function getStatusStyles(status: CampaignStatus) {
  switch (status) {
    case "Active":
      return "bg-emerald-100 text-emerald-700";
    case "Completed":
      return "bg-emerald-50 text-emerald-600";
    case "Draft":
      return "bg-gray-100 text-gray-600";
    case "Paused":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getTypeStyles(type: CampaignType) {
  switch (type) {
    case "Email":
      return "bg-purple-100 text-purple-700";
    case "Content":
      return "bg-rose-100 text-rose-700";
    case "Social":
      return "bg-blue-100 text-blue-700";
    case "Search":
      return "bg-teal-100 text-teal-700";
    case "Display":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatItem({
  label,
  value,
  sub,
  icon: Icon,
  iconBg
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          iconBg
        )}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pctSpent = Math.round((campaign.spent / campaign.budget) * 100);
  const pctLeft = 100 - pctSpent;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5 text-gray-500" />
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[11px] font-normal px-2 py-0.5 rounded-md border-0",
            getStatusStyles(campaign.status)
          )}
        >
          {campaign.status}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug">
        {campaign.name}
      </h3>

      {/* Type badge */}
      <Badge
        variant="outline"
        className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-md border-0 w-fit",
          getTypeStyles(campaign.type)
        )}
      >
        {campaign.type}
      </Badge>

      {/* Date & Budget grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-gray-400 font-medium mb-0.5">
            Date Range
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-700 font-medium">
            <CalendarDays className="w-3 h-3 text-gray-400" />
            {campaign.dateRange}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-medium mb-0.5">Budget</p>
          <p className="text-xs text-gray-700 font-medium">
            {formatYen(campaign.budget)}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div>
        <p className="text-[10px] text-gray-400 font-medium mb-1">Metrics</p>
        <div className="flex items-center gap-3 text-xs text-gray-700">
          <span>
            CTR:{" "}
            <span className="font-semibold">{campaign.ctr.toFixed(2)}%</span>
          </span>
          <span>
            CVR:{" "}
            <span className="font-semibold">{campaign.cvr.toFixed(2)}%</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Due & Progress */}
      <div className="space-y-2">
        <p className="text-[10px] text-gray-500 font-medium">
          Due {campaign.dueDate}
        </p>
        <Progress
          value={pctSpent}
          className="h-1.5 bg-gray-100 *:data-[slot=progress-indicator]:bg-emerald-500"
        />
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-400">
            {formatYen(campaign.spent)} of {formatYen(campaign.budget)} spent
          </span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">
              {pctLeft}% left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<CampaignStatus | "All">("All");

  const filtered =
    activeTab === "All"
      ? campaigns
      : campaigns.filter((c) => c.status === activeTab);

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const pctSpent = Math.round((totalSpent / totalBudget) * 100);
  const pctLeft = 100 - pctSpent;

  const tabCounts = tabs.map((t) => ({
    ...t,
    count:
      t.filter === "All"
        ? campaigns.length
        : campaigns.filter((c) => c.status === t.filter).length
  }));

  return (
    <div className="py-6 space-y-6 min-h-full">
      {/* ── Stats Header ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <StatItem
          label="Total Budget"
          value={formatYen(12400000)}
          icon={DollarSign}
          iconBg="bg-purple-500"
        />
        <StatItem
          label="Total Spent"
          value={formatYen(7540000)}
          sub="61% used"
          icon={TrendingUp}
          iconBg="bg-orange-500"
        />
        <StatItem
          label="Impressions"
          value="3,455,000"
          icon={Eye}
          iconBg="bg-blue-500"
        />
        <StatItem
          label="Avg. CTR"
          value="3.65%"
          icon={Percent}
          iconBg="bg-pink-500"
        />
        <StatItem
          label="Conversions"
          value="10,317"
          icon={Target}
          iconBg="bg-teal-500"
        />
      </div>

      {/* ── Tabs & Controls ── */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-gray-200">
            {tabCounts.map((t) => (
              <button
                key={t.filter}
                onClick={() => setActiveTab(t.filter)}
                className={cn(
                  "relative px-1 pb-2 text-xs font-medium transition-colors whitespace-nowrap -mb-px",
                  activeTab === t.filter
                    ? "text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-0.5 text-[10px]",
                    activeTab === t.filter ? "text-purple-600" : "text-gray-400"
                  )}
                >
                  ({t.count})
                </span>
                {activeTab === t.filter && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Filter className="w-3.5 h-3.5 mr-1" />
              Filter
            </Button>
            <Select defaultValue="newest">
              <SelectTrigger className="h-8 text-xs w-36 bg-white border-gray-200">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-gray-500" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                <SelectItem value="budget-low">Budget: Low to High</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Sub-bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} campaigns
          </p>
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-500">
              Total budget{" "}
              <span className="font-semibold text-gray-700">
                {formatYen(totalSpent)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {formatYen(totalBudget)}
              </span>{" "}
              spent{" "}
              <span className="font-semibold text-emerald-600">
                {pctLeft}% left
              </span>
            </p>
            <div className="w-32">
              <Progress
                value={pctSpent}
                className="h-1.5 bg-gray-200 *:data-[slot=progress-indicator]:bg-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Campaign Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

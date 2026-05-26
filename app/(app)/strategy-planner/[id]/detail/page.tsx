"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use, useState } from "react";
import { ScenarioComparison } from "../components/ScenarioComparison";
import { CampaignStrategies } from "../components/CampaignStrategies";

export default function StrategyPlannerDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("scenario");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Detail Strategy Planner"
        showBackButton
        onBack={() => router.push("/strategy-planner")}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-gray-100/50">
          <TabsTrigger
            value="scenario"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Scenario Comparison
          </TabsTrigger>
          <TabsTrigger
            value="campaign"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Campaign Strategies
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "scenario" ? (
        <ScenarioComparison id={id} />
      ) : (
        <CampaignStrategies id={id} />
      )}
    </div>
  );
}

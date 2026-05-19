"use client";

import { useRouter } from "next/navigation";
import { Plus, FileText, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StrategyPlannerPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Strategy Planner
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your strategy plans and create new strategies
          </p>
        </div>
        <Button
          onClick={() => router.push("/strategy-planner/create")}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search campaign briefs..."
            className="pl-10 h-10"
          />
        </div>
        <Button variant="outline" className="h-10">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Empty State */}
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No campaign briefs yet
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Get started by creating your first campaign brief. This will help you
          organize your marketing campaigns.
        </p>
        <Button
          onClick={() => router.push("/strategy-planner/create")}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign Brief
        </Button>
      </div>
    </div>
  );
}

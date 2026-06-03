import { cn } from "@/lib/utils";
import { objectives } from "@/components/card/CampaignObjective";
import type { CampaignBrief, CampaignObjectiveKey } from "@/app/(app)/campaign-brief/types";

const campaignTypeMap: Record<CampaignObjectiveKey, string> = {
  awareness: "Reach · Video",
  traffic: "Search · Display",
  sales: "Performance Max",
  leads: "Performance Max",
  app_install: "App · App Installs",
};

export function CampaignSetupContent({ brief }: { brief: CampaignBrief }) {
  const obj = objectives.find((o) => o.key === brief.objective_type);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Campaign Name</p>
        <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900">
          {brief.title}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">Campaign Objective</p>
        {obj && (
          <div className="flex items-start gap-4">
            <div className="w-32 h-20 rounded-xl bg-linear-to-br from-purple-600 to-violet-700 flex items-center justify-center shrink-0">
              {obj.icon}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">{obj.label}</p>
              <span
                className={cn(
                  "inline-block text-xs px-2 py-0.5 rounded-full font-medium",
                  obj.badgeColor
                )}
              >
                {obj.badge}
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">{obj.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Campaign Type</p>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
            {campaignTypeMap[brief.objective_type]}
          </span>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{obj?.description}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Campaign Subtype</p>
          <p className="text-sm text-gray-400 italic">
            {brief.sub_type || "Campaign subtype not selected"}
          </p>
        </div>
      </div>
    </div>
  );
}

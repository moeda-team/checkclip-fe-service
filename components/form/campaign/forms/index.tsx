"use client";

import { AwarenessForm } from "./AwarenessForm";
import { SectionBrandProduct } from "../SectionBrandProduct";
import { SectionBudgetSchedule } from "../SectionBudgetSchedule";
import { SectionAudience } from "../SectionAudience";
import type { CampaignFormData, CampaignObjectiveKey } from "@/types/campaign";

type Props = {
  objective: CampaignObjectiveKey;
  data: CampaignFormData;
  onChange: (data: CampaignFormData) => void;
};

// Placeholder for objectives not yet implemented — uses shared sections only
function DefaultForm({ data, onChange }: Omit<Props, "objective">) {
  return (
    <div className="space-y-4">
      <SectionBrandProduct
        data={data.brand}
        onChange={(brand) => onChange({ ...data, brand })}
      />
      <SectionBudgetSchedule
        data={data.budget}
        onChange={(budget) => onChange({ ...data, budget })}
      />
      <SectionAudience
        data={data.audience}
        onChange={(audience) => onChange({ ...data, audience })}
      />
    </div>
  );
}

export function CampaignFormByObjective({ objective, data, onChange }: Props) {
  switch (objective) {
    case "awareness":
      return <AwarenessForm data={data} onChange={onChange} />;
    // Add more cases as forms are built:
    // case "traffic":   return <TrafficForm data={data} onChange={onChange} />;
    // case "sales":     return <SalesForm data={data} onChange={onChange} />;
    // case "leads":     return <LeadsForm data={data} onChange={onChange} />;
    // case "app_install": return <AppInstallForm data={data} onChange={onChange} />;
    default:
      return <DefaultForm data={data} onChange={onChange} />;
  }
}

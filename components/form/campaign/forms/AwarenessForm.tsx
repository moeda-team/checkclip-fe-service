"use client";

import { SectionBrandProduct } from "../SectionBrandProduct";
import { SectionBudgetSchedule } from "../SectionBudgetSchedule";
import { SectionAudience } from "../SectionAudience";
import type { CampaignFormData } from "@/types/campaign";

type Props = {
  data: CampaignFormData;
  onChange: (data: CampaignFormData) => void;
};

export function AwarenessForm({ data, onChange }: Props) {
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

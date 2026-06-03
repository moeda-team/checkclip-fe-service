import { Settings2, DollarSign, Users, Megaphone, FileText, MessageSquare } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { CampaignSetupContent } from "./CampaignSetupContent";
import { BudgetContent } from "./BudgetContent";
import { AudienceContent } from "./AudienceContent";
import { AdsTypeContent } from "./AdsTypeContent";
import { KeyMessageContent } from "./KeyMessageContent";
import { PlaceholderContent } from "./PlaceholderContent";
import type { CampaignBrief } from "@/app/(app)/campaign-brief/types";

interface AllSectionsProps {
  brief: CampaignBrief;
  isApproved: boolean;
}

export function AllSections({ brief, isApproved }: AllSectionsProps) {
  return (
    <div className="space-y-4">
      <SectionWrapper id="campaign_setup" label="Campaign Setup" icon={Settings2} isApproved={isApproved}>
        <CampaignSetupContent brief={brief} />
      </SectionWrapper>

      <SectionWrapper id="budget_breakdown" label="Budget Breakdown" icon={DollarSign} isApproved={isApproved}>
        <BudgetContent brief={brief} />
      </SectionWrapper>

      <SectionWrapper id="audience" label="Audience" icon={Users} isApproved={isApproved}>
        <AudienceContent brief={brief} />
      </SectionWrapper>

      <SectionWrapper id="ads_type" label="Ads Type" icon={Megaphone} isApproved={isApproved}>
        <AdsTypeContent brief={brief} />
      </SectionWrapper>

      <SectionWrapper id="placement" label="Placement" icon={FileText} isApproved={isApproved}>
        <PlaceholderContent label="Placement" />
      </SectionWrapper>

      <SectionWrapper id="key_message" label="Key Message" icon={MessageSquare} isApproved={isApproved}>
        <KeyMessageContent brief={brief} />
      </SectionWrapper>

      <SectionWrapper id="timeline_milestone" label="Timeline & Milestone" icon={FileText} isApproved={isApproved}>
        <PlaceholderContent label="Timeline & Milestone" />
      </SectionWrapper>
    </div>
  );
}

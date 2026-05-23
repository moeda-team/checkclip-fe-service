// ─── Ads icon ─────────────────────────────────────────────────────────────────

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DollarSign, FileText, Megaphone, MessageSquare, Pencil, Settings2, Users } from "lucide-react";
import { CampaignBrief, CampaignObjectiveKey } from "../types";
import { objectives } from "@/components/card/CampaignObjective";
import { cn } from "@/lib/utils";

const campaignTypeMap: Record<CampaignObjectiveKey, string> = {
  awareness: "Reach · Video", traffic: "Search · Display",
  sales: "Performance Max",   leads: "Performance Max",
  app_install: "App · App Installs",
};

export function AdsIcon({ type }: { type: string }) {
  if (type === "google") return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
  if (type === "meta") return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  return <span className="text-xs font-medium text-gray-500 capitalize">{type}</span>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export  function BriefSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {[1,2,3,4].map((i) => (
        <div key={i} className="flex items-start gap-2.5 px-1 py-3 animate-pulse">
          <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-2.5 bg-gray-100 rounded w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section content components ───────────────────────────────────────────────

export  function SectionWrapper({ id, label, icon: Icon, children }: {
  id: string; label: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900">{label}</h2>
        </div>
        <Button variant="outline" className="h-8 text-xs border-gray-200 gap-1.5">
          <Pencil className="w-3.5 h-3.5" /> Edit
        </Button>
      </div>
      {children}
    </div>
  );
}

export function CampaignSetupContent({ brief }: { brief: CampaignBrief }) {
  const obj = objectives.find((o) => o.key === brief.objective_type);
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Campaign Name</p>
        <div className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900">{brief.title}</div>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">Campaign Objective</p>
        {obj && (
          <div className="flex items-start gap-4">
            <div className="w-32 h-20 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center shrink-0">{obj.icon}</div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">{obj.label}</p>
              <span className={cn("inline-block text-xs px-2 py-0.5 rounded-full font-medium", obj.badgeColor)}>{obj.badge}</span>
              <p className="text-xs text-gray-500 leading-relaxed">{obj.description}</p>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Campaign Type</p>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">{campaignTypeMap[brief.objective_type]}</span>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{obj?.description}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">Campaign Subtype</p>
          <p className="text-sm text-gray-400 italic">{brief.sub_type || "Campaign subtype not selected"}</p>
        </div>
      </div>
    </div>
  );
}

export function BudgetContent({ brief }: { brief: CampaignBrief }) {
  const b = brief.form?.budget;
  let startDate: Date | null = null
  let endDate: Date | null = null
  if(b?.startDate) {
    startDate = new Date(b.startDate)
  }
  if(b?.endDate) {
    endDate = new Date(b.endDate)
  }
  if (!b) return <p className="text-sm text-gray-400">No budget data</p>;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div><p className="text-xs font-medium text-gray-500 mb-1">Budget Type</p><p className="text-sm text-gray-900">{b.budgetType || "—"}</p></div>
      <div><p className="text-xs font-medium text-gray-500 mb-1">Budget</p><p className="text-sm text-gray-900">{b.budget ? `$ ${Number(b.budget).toLocaleString("en-US")}` : "—"}</p></div>
      <div><p className="text-xs font-medium text-gray-500 mb-1">Start Date</p><p className="text-sm text-gray-900"> {startDate ? format(startDate, 'yyyy-MM-dd') : ""}</p></div>
      <div><p className="text-xs font-medium text-gray-500 mb-1">Start Time</p><p className="text-sm text-gray-900">{startDate instanceof Date ? format(startDate, 'MM') : ""}</p></div>
      {b.hasEndDate && <>
        <div><p className="text-xs font-medium text-gray-500 mb-1">End Date</p><p className="text-sm text-gray-900">{endDate ? format(endDate, 'yyyy-MM-dd') : ""}</p></div>
        <div><p className="text-xs font-medium text-gray-500 mb-1">End Time</p><p className="text-sm text-gray-900">{endDate ? format(endDate, 'MM') : ""}</p></div>
      </>}
    </div>
  );
}

export function AudienceContent({ brief }: { brief: CampaignBrief }) {
  const a = brief.form?.audience;
  if (!a) return <p className="text-sm text-gray-400">No audience data</p>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div><p className="text-xs font-medium text-gray-500 mb-1">Location</p><p className="text-sm text-gray-900">{a.location || "—"}</p></div>
        <div><p className="text-xs font-medium text-gray-500 mb-1">Age</p><p className="text-sm text-gray-900">{a.age || "—"}</p></div>
        <div><p className="text-xs font-medium text-gray-500 mb-1">Language</p><p className="text-sm text-gray-900">{a.language || "—"}</p></div>
      </div>
      <div><p className="text-xs font-medium text-gray-500 mb-1">Gender</p><p className="text-sm text-gray-900 capitalize">{a.gender}</p></div>
      <div><p className="text-xs font-medium text-gray-500 mb-1">Interest & Detail Audience</p><p className="text-sm text-gray-900 leading-relaxed">{a.interest || "—"}</p></div>
    </div>
  );
}

export function PlaceholderContent({ label }: { label: string }) {
  return <div className="flex items-center justify-center h-32 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">{label} — coming soon</div>;
}

// ─── All sections rendered together ──────────────────────────────────────────

export function AllSections({ brief }: { brief: CampaignBrief }) {
  return (
    <div className="space-y-10">
      <SectionWrapper id="campaign_setup" label="Campaign Setup" icon={Settings2}>
        <CampaignSetupContent brief={brief} />
      </SectionWrapper>
      <div className="border-t border-gray-100" />
      <SectionWrapper id="budget_breakdown" label="Budget Breakdown" icon={DollarSign}>
        <BudgetContent brief={brief} />
      </SectionWrapper>
      <div className="border-t border-gray-100" />
      <SectionWrapper id="audience" label="Audience" icon={Users}>
        <AudienceContent brief={brief} />
      </SectionWrapper>
      <div className="border-t border-gray-100" />
      <SectionWrapper id="ads_type" label="Ads Type" icon={Megaphone}>
        <PlaceholderContent label="Ads Type" />
      </SectionWrapper>
      <div className="border-t border-gray-100" />
      <SectionWrapper id="placement" label="Placement" icon={FileText}>
        <PlaceholderContent label="Placement" />
      </SectionWrapper>
      <div className="border-t border-gray-100" />
      <SectionWrapper id="key_message" label="Key Message" icon={MessageSquare}>
        <PlaceholderContent label="Key Message" />
      </SectionWrapper>
      <div className="border-t border-gray-100" />
      <SectionWrapper id="timeline_milestone" label="Timeline & Milestone" icon={FileText}>
        <PlaceholderContent label="Timeline & Milestone" />
      </SectionWrapper>
    </div>
  );
}
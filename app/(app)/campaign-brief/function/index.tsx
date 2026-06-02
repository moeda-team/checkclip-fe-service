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

export { BriefListSkeleton as BriefSkeleton } from "@/components/ui/skeletons";

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
            <div className="w-32 h-20 rounded-xl bg-linear-to-br from-purple-600 to-violet-700 flex items-center justify-center shrink-0">{obj.icon}</div>
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
  const b = brief.budget;
  let startDate: Date | null = null
  let endDate: Date | null = null
  if(b?.start_date) {
    startDate = new Date(b.start_date)
  }
  if(b?.end_date) {
    endDate = new Date(b.end_date)
  }
  if (!b) return <p className="text-sm text-gray-400">No budget data</p>;

  const resultAi = brief.result_ai;
  const breakdown = resultAi?.budget_breakdown;

  // Bar colors per category index
  const barColors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-400", "bg-pink-500"];

  return (
    <div className="space-y-6">
      {/* ── Summary cards ─── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-gray-200 rounded-xl p-3.5">
          <p className="text-xs text-gray-500 mb-1">Budget Type</p>
          <p className="text-sm font-semibold text-gray-900 capitalize">{b.type || "—"}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3.5">
          <p className="text-xs text-gray-500 mb-1">Total Budget</p>
          <p className="text-sm font-semibold text-gray-900">{b.type ? `$ ${Number(b.amount).toLocaleString("en-US")}` : "—"}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3.5">
          <p className="text-xs text-gray-500 mb-1">Allocated Based on Budget</p>
          <p className="text-sm font-semibold text-gray-900">{breakdown ? `$ ${Number(breakdown.total_budget_usd).toLocaleString("en-US")}` : "—"}</p>
        </div>
      </div>

      {/* ── Schedule ─── */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">Schedule</p>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-xs font-medium text-gray-500 mb-1">Start Date</p><p className="text-sm text-gray-900">{startDate ? format(startDate, 'dd-MM-yyyy') : "—"}</p></div>
          <div><p className="text-xs font-medium text-gray-500 mb-1">Time</p><p className="text-sm text-gray-900">{startDate instanceof Date ? format(startDate, 'HH:mm') : "—"}</p></div>
          {b.end_date != null && <>
            <div><p className="text-xs font-medium text-gray-500 mb-1">End Date</p><p className="text-sm text-gray-900">{endDate ? format(endDate, 'dd-MM-yyyy') : "—"}</p></div>
            <div><p className="text-xs font-medium text-gray-500 mb-1">Time</p><p className="text-sm text-gray-900">{endDate ? format(endDate, 'HH:mm') : "—"}</p></div>
          </>}
        </div>
      </div>

      {/* ── Breakdown ─── */}
      {breakdown && breakdown.categories?.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-3">Breakdown</p>

          {/* Bar chart rows */}
          <div className="space-y-2.5 mb-5">
            {/* Header */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
              <div className="w-[110px] shrink-0">Spend Category ({breakdown.categories.length})</div>
              <div className="flex-1" />
              <div className="w-24 shrink-0 text-right">Amount</div>
              <div className="w-20 shrink-0 text-right">% of Budget</div>
            </div>
            {breakdown.categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Label pill */}
                <div
                  className={cn(
                    "w-[110px] shrink-0 px-2.5 py-1 rounded-full text-xs font-medium text-white truncate",
                    barColors[i % barColors.length]
                  )}
                  title={cat.creative_format}
                >
                  {cat.creative_format.length > 11 ? cat.creative_format.slice(0, 11) + "…" : cat.creative_format}
                </div>
                {/* Progress bar */}
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", barColors[i % barColors.length])}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>
                {/* Amount */}
                <div className="w-24 shrink-0 text-sm text-gray-700 text-right">
                  $ {Number(cat.amount_usd).toLocaleString("en-US")}
                </div>
                {/* % of Budget */}
                <div className="w-20 shrink-0 text-sm text-gray-700 text-right">
                  {cat.percentage}%
                </div>
              </div>
            ))}
          </div>

          {/* Detail table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Description</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">% of Budget</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.categories.map((cat, i) => (
                  <tr key={i} className={cn("border-b border-gray-100 last:border-0", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                    <td className="px-4 py-3 text-gray-900 font-medium">{cat.creative_format}</td>
                    <td className="px-4 py-3 text-gray-600">{cat.description}</td>
                    <td className="px-4 py-3 text-gray-900">$ {Number(cat.amount_usd).toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 text-gray-900">{cat.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function AudienceContent({ brief }: { brief: CampaignBrief }) {
  const a = brief.audience;
  if (!a) return <p className="text-sm text-gray-400">No audience data</p>;

  // interest disimpan sebagai comma-separated string
  const interestTags = a.interest
    ? a.interest.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const genderOptions = [
    { value: "all", label: "All" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
  ];

  return (
    <div className="space-y-5">
      {/* Location, Age, Language */}
      <div className="grid grid-cols-3 gap-4">
        {/* Location */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Location</p>
          <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-900">
            <span>{a.location || <span className="text-gray-400">—</span>}</span>
          </div>
        </div>
        {/* Age — select style */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Age</p>
          <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-900">
            <span>{a.age || <span className="text-gray-400">—</span>}</span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {/* Language — select style */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Language</p>
          <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-900">
            <span className="capitalize">{a.language || <span className="text-gray-400">—</span>}</span>
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Gender — radio button style (read-only) */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
        <div className="flex items-center gap-6">
          {genderOptions.map((opt) => {
            const isSelected = (a.gender || "").toLowerCase() === opt.value;
            return (
              <div key={opt.value} className="flex items-center gap-2">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected ? "border-gray-900" : "border-gray-300"
                )}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                </div>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audience Interest — checkbox style (read-only) */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1.5">Audience Interest</p>
        <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center justify-between text-sm">
          {interestTags.length > 0 ? (
            <span className="text-gray-900 truncate">{interestTags.join(", ")}</span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
          <svg className="w-4 h-4 text-gray-400 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {/* {interestTags.length > 0 && (
          // <div className="flex flex-wrap gap-1.5 mt-2">
          //   {interestTags.map((tag, i) => (
          //     <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 text-sm text-gray-700">
          //       <div className="w-3.5 h-3.5 rounded border border-purple-500 bg-purple-500 flex items-center justify-center shrink-0">
          //         <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          //           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          //         </svg>
          //       </div>
          //       {tag}
          //     </div>
          //   ))}
          // </div>
        )} */}
        <p className="text-xs text-gray-400 mt-1.5">Add any interests related to your audience</p>
      </div>

      {/* Detail Audience — textarea style (read-only) */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1.5">Detail Audience</p>
        <div className="w-full min-h-[80px] px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 leading-relaxed">
          {a.detail || <span className="text-gray-400">—</span>}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Add any detailed demographics, or life events related to your audience</p>
      </div>
    </div>
  );
}

export function PlaceholderContent({ label }: { label: string }) {
  return <div className="flex items-center justify-center h-32 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">{label} — coming soon</div>;
}

export function KeyMessageContent({ brief }: { brief: CampaignBrief }) {
  const themes = brief.result_ai?.key_message?.key_themes;
  if (!themes?.length) return <p className="text-sm text-gray-400">No key message data</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((theme, i) => (
        <span key={i} className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
          {theme}
        </span>
      ))}
    </div>
  );
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
        <KeyMessageContent brief={brief} />
      </SectionWrapper>
      <div className="border-t border-gray-100" />
      <SectionWrapper id="timeline_milestone" label="Timeline & Milestone" icon={FileText}>
        <PlaceholderContent label="Timeline & Milestone" />
      </SectionWrapper>
    </div>
  );
}
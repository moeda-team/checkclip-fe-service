// app/(app)/campaigns/components/CampaignStatsHeader.tsx
// Top stats summary row for the campaigns page, derived from approved briefs.

import { Megaphone, CheckCircle2, Clock, Network } from "lucide-react";
import { StatItem } from "./StatItem";
import type { CampaignBrief } from "./campaign-types";

export function CampaignStatsHeader({ briefs }: { briefs: CampaignBrief[] }) {
  const total = briefs.length;
  const approved = briefs.filter((b) => b.status === "approved").length;
  const pending = briefs.filter((b) => b.status === "pending").length;
  const channels = new Set(briefs.map((b) => b.type_ads)).size;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
      <StatItem
        label="Total Briefs"
        value={total.toLocaleString("en-US")}
        icon={Megaphone}
        iconBg="bg-purple-500"
      />
      <StatItem
        label="Approved"
        value={approved.toLocaleString("en-US")}
        icon={CheckCircle2}
        iconBg="bg-emerald-500"
      />
      <StatItem
        label="Pending"
        value={pending.toLocaleString("en-US")}
        icon={Clock}
        iconBg="bg-amber-500"
      />
      <StatItem
        label="Channels"
        value={channels.toLocaleString("en-US")}
        icon={Network}
        iconBg="bg-blue-500"
      />
    </div>
  );
}

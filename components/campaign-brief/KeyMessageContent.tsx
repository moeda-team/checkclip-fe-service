import type { CampaignBrief } from "@/app/(app)/campaign-brief/types";

export function KeyMessageContent({ brief }: { brief: CampaignBrief }) {
  const themes = brief.result_ai?.key_message?.key_themes;

  if (!themes?.length) {
    return <p className="text-sm text-gray-400">No key message data</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((theme, i) => (
        <span
          key={i}
          className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-medium"
        >
          {theme}
        </span>
      ))}
    </div>
  );
}

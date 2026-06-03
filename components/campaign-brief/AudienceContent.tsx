import { cn } from "@/lib/utils";
import type { CampaignBrief } from "@/app/(app)/campaign-brief/types";

const genderOptions = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
];

const ChevronDownIcon = () => (
  <svg
    className="w-4 h-4 text-gray-400 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export function AudienceContent({ brief }: { brief: CampaignBrief }) {
  const a = brief.audience;

  if (!a) return <p className="text-sm text-gray-400">No audience data</p>;

  const interestTags = a.interest
    ? a.interest.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-5">
      {/* Location, Age, Language */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Location</p>
          <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center text-sm text-gray-900">
            {a.location || <span className="text-gray-400">—</span>}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Age</p>
          <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-900">
            <span>{a.age || <span className="text-gray-400">—</span>}</span>
            <ChevronDownIcon />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1.5">Language</p>
          <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center justify-between text-sm text-gray-900">
            <span className="capitalize">
              {a.language || <span className="text-gray-400">—</span>}
            </span>
            <ChevronDownIcon />
          </div>
        </div>
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Gender</p>
        <div className="flex items-center gap-6">
          {genderOptions.map((opt) => {
            const isSelected = (a.gender || "").toLowerCase() === opt.value;
            return (
              <div key={opt.value} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                    isSelected ? "border-gray-900" : "border-gray-300"
                  )}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                </div>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audience Interest */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1.5">Audience Interest</p>
        <div className="h-10 px-3 border border-gray-200 rounded-lg flex items-center justify-between text-sm">
          {interestTags.length > 0 ? (
            <span className="text-gray-900 truncate">{interestTags.join(", ")}</span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
          <ChevronDownIcon />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Add any interests related to your audience
        </p>
      </div>

      {/* Detail Audience */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1.5">Detail Audience</p>
        <div className="w-full min-h-[80px] px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 leading-relaxed">
          {a.detail || <span className="text-gray-400">—</span>}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Add any detailed demographics, or life events related to your audience
        </p>
      </div>
    </div>
  );
}

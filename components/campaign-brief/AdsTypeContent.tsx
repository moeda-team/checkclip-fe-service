import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CampaignBrief } from "@/app/(app)/campaign-brief/types";

const adFormats = [
  {
    key: "in_stream",
    label: "In-stream ads (bumper, skippable)",
    description:
      "In-stream ads play before, during, or after other videos. Bumper ads are 6 seconds long and can't be skipped. Skippable in-stream ads are at least 7 seconds long and can be skipped after 5 seconds.",
  },
  {
    key: "in_feed",
    label: "In-feed ads",
    description:
      "In-feed ads are at least 7 seconds long and consist of a video thumbnail and some text. Users can watch the video ad autoplay inline or click on the thumbnail to watch the ad on a YouTube channel or watch page.",
  },
  {
    key: "shorts",
    label: "Shorts ads",
    description:
      "Shorts ads are at least 6 seconds long, and appear between user-generated videos on YouTube Shorts. Users can skip the ad at any time.",
  },
];

export function AdsTypeContent({ brief }: { brief: CampaignBrief }) {
  const categories = brief.result_ai?.budget_breakdown?.categories ?? [];
  const checkedFormats = new Set(
    categories.map((c) => c.creative_format.toLowerCase())
  );

  const isFormatChecked = (key: string) =>
    checkedFormats.size === 0
      ? key === "in_stream"
      : Array.from(checkedFormats).some(
          (f) => f.includes(key.replace("_", "-")) || f.includes(key)
        );

  return (
    <div className="space-y-6">
      {/* Ad Format */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">Ad Format</p>
        <div className="space-y-4">
          {adFormats.map((fmt) => {
            const checked = isFormatChecked(fmt.key);
            return (
              <div key={fmt.key} className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center shrink-0",
                    checked ? "border-gray-900 bg-gray-900" : "border-gray-300 bg-white"
                  )}
                >
                  {checked && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{fmt.label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mt-0.5">
                    {fmt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Asset */}
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Video Asset (Max. 5 Videos)
        </p>

        {/* Dummy video card */}
        <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3 mb-4">
          <div className="w-16 h-12 rounded-lg bg-linear-to-br from-purple-500 to-blue-600 shrink-0 overflow-hidden flex items-center justify-center">
            <svg className="w-6 h-6 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {brief.brand?.name ?? "Brand Video"}
            </p>
            <p className="text-xs text-blue-500">
              by <span className="font-medium">{brief.tenant?.name ?? "Advertiser"}</span> · 31,360 Views
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {brief.brand?.description ?? "Video description goes here."}
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="video-url" className="text-sm font-medium text-gray-700">
              Video URL or Youtube
            </Label>
            <Input
              id="video-url"
              placeholder="Search for a video or paste the URL from YouTube"
              className="mt-1 h-10 border-gray-200 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="display-url" className="text-sm font-medium text-gray-700">
              Display URL
            </Label>
            <Input
              id="display-url"
              placeholder="https://youtu.be/display"
              className="mt-1 h-10 border-gray-200 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-gray-300 bg-white shrink-0" />
            <span className="text-sm text-gray-700">Call to Action</span>
          </div>
          <div>
            <Label htmlFor="long-headline" className="text-sm font-medium text-gray-700">
              Long Headline
            </Label>
            <Input
              id="long-headline"
              placeholder="Dummy Long Headline"
              defaultValue="Dummy Long Headline"
              className="mt-1 h-10 border-gray-200 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Dummy Description"
              defaultValue="Dummy Description"
              className="mt-1 h-10 border-gray-200 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="business-name" className="text-sm font-medium text-gray-700">
              Business Name
            </Label>
            <Input
              id="business-name"
              placeholder="Dummy Business Name"
              defaultValue="Dummy Business Name"
              className="mt-1 h-10 border-gray-200 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

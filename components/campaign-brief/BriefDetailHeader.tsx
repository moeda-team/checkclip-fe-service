"use client";

import { Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdsIcon } from "@/components/campaign-brief/AdsIcon";
import type { CampaignBrief } from "@/app/(app)/campaign-brief/types";

interface BriefDetailHeaderProps {
  brief: CampaignBrief;
  isApproved: boolean;
  isApproving: boolean;
  onApprove: () => void;
}

export function BriefDetailHeader({
  brief,
  isApproved,
  isApproving,
  onApprove,
}: BriefDetailHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{brief.title}</h1>
        <div className="flex items-center gap-1.5 mt-0.5">
          <AdsIcon type={brief.type_ads} />
          <span className="text-xs text-gray-500 capitalize">
            {brief.type_ads} Ads
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="h-9 text-sm border-gray-200 gap-1.5"
        >
          <MessageSquare className="w-4 h-4" /> Comment
        </Button>
        <Button
          className="h-9 text-sm bg-gray-900 hover:bg-gray-800 text-white gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isApproved || isApproving}
          onClick={onApprove}
        >
          <Check className="w-4 h-4" />
          {isApproving ? "Approving..." : isApproved ? "Approved" : "Approve"}
        </Button>
      </div>
    </div>
  );
}

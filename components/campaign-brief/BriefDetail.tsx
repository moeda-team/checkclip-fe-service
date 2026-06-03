"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { Settings2, DollarSign, Users, Megaphone, MessageSquare } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/skeletons";
import { AllSections } from "./AllSections";
import { BriefDetailHeader } from "./BriefDetailHeader";
import { SectionNav, type SectionItem } from "./SectionNav";
import type { CampaignBrief } from "@/app/(app)/campaign-brief/types";

const sections: SectionItem[] = [
  { key: "campaign_setup", label: "Campaign Setup", icon: Settings2 },
  { key: "budget_breakdown", label: "Budget Breakdown", icon: DollarSign },
  { key: "audience", label: "Audience", icon: Users },
  { key: "ads_type", label: "Ads Type", icon: Megaphone },
  { key: "placement", label: "Placement", icon: FileText },
  { key: "key_message", label: "Key Message", icon: MessageSquare },
  { key: "timeline_milestone", label: "Timeline & Milestone", icon: FileText },
];

interface BriefDetailProps {
  selectedBrief: CampaignBrief | null;
  isLoading: boolean;
  isError: boolean;
  isApproving: boolean;
  debouncedSearch: string;
  onApprove: () => void;
  onRetry: () => void;
}

export function BriefDetail({
  selectedBrief,
  isLoading,
  isError,
  isApproving,
  debouncedSearch,
  onApprove,
  onRetry,
}: BriefDetailProps) {
  const [activeSection, setActiveSection] = useState("campaign_setup");
  const [sectionPanelOpen, setSectionPanelOpen] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const isApproved = selectedBrief?.status === "approved";

  // Reset scroll & active section when brief changes
  useEffect(() => {
    if (selectedBrief) {
      setActiveSection("campaign_setup");
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0 });
      }, 50);
    }
  }, [selectedBrief?.id]);

  // IntersectionObserver — update activeSection on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !selectedBrief) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { root: container, threshold: 0.25 }
    );

    sections.forEach((sec) => {
      const el = container.querySelector(`#${sec.key}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selectedBrief]);

  const scrollToSection = (key: string) => {
    const container = scrollContainerRef.current;
    const el = container?.querySelector(`#${key}`) as HTMLElement | null;
    if (!el || !container) return;

    setActiveSection(key);
    isScrollingRef.current = true;
    container.scrollTo({ top: el.offsetTop - 24, behavior: "smooth" });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm">
        <p className="text-red-500">Failed to load detail</p>
        <button onClick={onRetry} className="text-purple-600 underline text-xs">
          Retry
        </button>
      </div>
    );
  }

  if (!selectedBrief) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-gray-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            {debouncedSearch ? "No matching briefs" : "No briefs available"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {debouncedSearch
              ? "Try a different search term"
              : "Select a brief from the list or create a new one"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <BriefDetailHeader
        brief={selectedBrief}
        isApproved={isApproved}
        isApproving={isApproving}
        onApprove={onApprove}
      />

      <div className="flex flex-1 overflow-hidden">
        <SectionNav
          sections={sections}
          activeSection={activeSection}
          isOpen={sectionPanelOpen}
          onToggle={() => setSectionPanelOpen((v) => !v)}
          onSectionClick={scrollToSection}
        />

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: "#f8f8ff", backgroundSize: "24px 24px" }}
        >
          <AllSections brief={selectedBrief} isApproved={isApproved} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Settings2,
  DollarSign,
  Users,
  Megaphone,
  FileText,
  MessageSquare,
  Check,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CampaignBrief,
  CampaignBriefFilter,
  CampaignBriefStatus
} from "./types";
import { AdsIcon, AllSections, BriefSkeleton } from "./function";
import { DetailSkeleton } from "@/components/ui/skeletons";
import {
  useGetStrategyBriefs,
  useGetStrategyBrief,
  useApproveStrategyBrief
} from "./hooks/useCampaignBrief";

const PAGE_LIMIT = 10;
type Section = { key: string; label: string; icon: React.ElementType };
const sections: Section[] = [
  { key: "campaign_setup", label: "Campaign Setup", icon: Settings2 },
  { key: "budget_breakdown", label: "Budget Breakdown", icon: DollarSign },
  { key: "audience", label: "Audience", icon: Users },
  { key: "ads_type", label: "Ads Type", icon: Megaphone },
  { key: "placement", label: "Placement", icon: FileText },
  { key: "key_message", label: "Key Message", icon: MessageSquare },
  { key: "timeline_milestone", label: "Timeline & Milestone", icon: FileText }
];

const statusConfig: Record<
  CampaignBriefStatus,
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "text-yellow-500" },
  in_review: { label: "In Review", color: "text-orange-500" },
  approved: { label: "Approved", color: "text-green-600" },
  rejected: { label: "Rejected", color: "text-red-500" },
  draft: { label: "Draft", color: "text-gray-400" }
};

// ─── Page ─────────────────────────────────────────────────────────────────────

function CampaignBriefListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("selectedId");

  // List filter state
  const [offset, setOffset] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Detail state
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(
    preselectedId
  );
  const [activeSection, setActiveSection] = useState("campaign_setup");
  const [sectionPanelOpen, setSectionPanelOpen] = useState(true);

  // Ref for the scrollable detail container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // ── API: list ──────────────────────────────────────────────────────────────
  const listFilter: CampaignBriefFilter = {
    limit: PAGE_LIMIT,
    offset,
    search: debouncedSearch || undefined
  };
  const {
    data: listData,
    isLoading: loading,
    isError: isListError,
    refetch: refetchList
  } = useGetStrategyBriefs(listFilter);

  const briefs = listData?.data ?? [];
  const total = listData?.paginate?.total ?? 0;

  // Auto-select first brief when list loads
  useEffect(() => {
    if (!selectedBriefId && briefs.length > 0) {
      setSelectedBriefId(briefs[0].id);
    }
  }, [briefs, selectedBriefId]);

  // ── API: detail ────────────────────────────────────────────────────────────
  const {
    data: detailData,
    isLoading: detailLoading,
    isError: isDetailError,
    refetch: refetchDetail
  } = useGetStrategyBrief(selectedBriefId ?? "");

  const selectedBrief = detailData?.data ?? null;

  const { mutate: approveBrief, isPending: isApproving } = useApproveStrategyBrief();
  const isApproved = selectedBrief?.status === "approved";

  // Scroll to top when brief changes
  useEffect(() => {
    if (selectedBriefId) {
      setActiveSection("campaign_setup");
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0 });
      }, 50);
    }
  }, [selectedBriefId]);

  // ── IntersectionObserver — update activeSection on scroll ─────────────────
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

  // ── Scroll to section ──────────────────────────────────────────────────────
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

  // ── Debounce search ────────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setOffset(0);
    }, 400);
  };

  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const currentPage = Math.floor(offset / PAGE_LIMIT) + 1;

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* ── Column 1: Brief List ─────────────────────────────────────────── */}
      <div className="w-56 shrink-0 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-3 border-b border-gray-100">
          <Button
            onClick={() => router.push("/campaign-brief/create")}
            className="w-full h-9 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create New
          </Button>
        </div>
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              placeholder="Type here"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-8 pl-8 text-xs border-gray-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <BriefSkeleton />
          ) : isListError ? (
            <div className="p-4 text-xs text-red-500 text-center space-y-2">
              <p>Failed to load briefs</p>
              <button
                onClick={() => refetchList()}
                className="text-purple-600 underline"
              >
                Retry
              </button>
            </div>
          ) : briefs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {debouncedSearch ? "No results found" : "No briefs yet"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {debouncedSearch
                    ? `No briefs match "${debouncedSearch}"`
                    : "Create your first campaign brief"}
                </p>
              </div>
              {!debouncedSearch && (
                <button
                  onClick={() => router.push("/campaign-brief/create")}
                  className="text-xs text-purple-600 font-medium hover:underline"
                >
                  + Create New
                </button>
              )}
            </div>
          ) : (
            briefs.map((brief) => {
              const isSelected = selectedBriefId === brief.id;
              const status = statusConfig[brief.status] ?? {
                label: brief.status,
                color: "text-gray-400"
              };
              return (
                <button
                  key={brief.id}
                  type="button"
                  onClick={() => setSelectedBriefId(brief.id)}
                  className={cn(
                    "w-full text-left px-3 py-3 border-b border-gray-100 flex items-start gap-2.5 transition-colors",
                    isSelected
                      ? "bg-purple-50 border-l-2 border-l-purple-600"
                      : "hover:bg-gray-50 border-l-2 border-l-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      isSelected ? "bg-purple-600" : "bg-gray-100"
                    )}
                  >
                    <FileText
                      className={cn(
                        "w-4 h-4",
                        isSelected ? "text-white" : "text-gray-500"
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-xs font-semibold leading-snug line-clamp-2",
                        isSelected ? "text-purple-700" : "text-gray-900"
                      )}
                    >
                      {brief.title}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-0.5 flex items-center gap-1",
                        status.color
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {status.label}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 shrink-0 mt-1",
                      isSelected ? "text-purple-600" : "text-gray-400"
                    )}
                  />
                </button>
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
            <button
              disabled={offset === 0}
              onClick={() => setOffset((o) => Math.max(0, o - PAGE_LIMIT))}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <PrevIcon className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="text-xs text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={offset + PAGE_LIMIT >= total}
              onClick={() => setOffset((o) => o + PAGE_LIMIT)}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <NextIcon className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* ── Column 2 + 3: Detail area ────────────────────────────────────── */}
      {detailLoading ? (
        <DetailSkeleton />
      ) : isDetailError ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm">
          <p className="text-red-500">Failed to load detail</p>
          <button
            onClick={() => refetchDetail()}
            className="text-purple-600 underline text-xs"
          >
            Retry
          </button>
        </div>
      ) : selectedBrief ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                {selectedBrief.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <AdsIcon type={selectedBrief.type_ads} />
                <span className="text-xs text-gray-500 capitalize">
                  {selectedBrief.type_ads} Ads
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
                onClick={() => selectedBriefId && approveBrief(selectedBriefId)}
              >
                <Check className="w-4 h-4" />
                {isApproving ? "Approving..." : isApproved ? "Approved" : "Approve"}
              </Button>
            </div>
          </div>

          {/* Body: section nav + scrollable content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Section nav */}
            <div
              className={cn(
                "border-r border-gray-200 bg-white flex flex-col shrink-0 transition-all duration-200",
                sectionPanelOpen ? "w-52" : "w-10"
              )}
            >
              <div className="flex justify-end p-2 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setSectionPanelOpen((v) => !v)}
                  className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center"
                >
                  {sectionPanelOpen ? (
                    <ChevronLeft className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              </div>
              {sectionPanelOpen && (
                <nav className="flex-1 overflow-y-auto py-2">
                  {sections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.key;
                    return (
                      <button
                        key={sec.key}
                        type="button"
                        onClick={() => scrollToSection(sec.key)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                          isActive
                            ? "text-purple-700 font-semibold bg-purple-50"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isActive && "text-purple-600"
                          )}
                        />
                        {sec.label}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Scrollable all-sections content */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6"
              style={{
                backgroundColor: "#f8f8ff",
                backgroundSize: "24px 24px"
              }}
            >
              <AllSections brief={selectedBrief} />
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default function CampaignBriefListPage() {
  return (
    <Suspense>
      <CampaignBriefListContent />
    </Suspense>
  );
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefList } from "@/components/campaign-brief/BriefList";
import { BriefDetail } from "@/components/campaign-brief/BriefDetail";
import {
  useGetStrategyBriefs,
  useGetStrategyBrief,
  useApproveStrategyBrief,
} from "./hooks/useCampaignBrief";
import type { CampaignBriefFilter } from "./types";

const PAGE_LIMIT = 10;

function CampaignBriefListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("selectedId");

  // List state
  const [offset, setOffset] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Detail state
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(preselectedId);

  // ── API: list ────────────────────────────────────────────────────────────
  const listFilter: CampaignBriefFilter = {
    limit: PAGE_LIMIT,
    offset,
    search: debouncedSearch || undefined,
  };

  const {
    data: listData,
    isLoading: loading,
    isError: isListError,
    refetch: refetchList,
  } = useGetStrategyBriefs(listFilter);

  const briefs = listData?.data ?? [];
  const total = listData?.paginate?.total ?? 0;

  // Auto-select first brief when list loads
  useEffect(() => {
    if (!selectedBriefId && briefs.length > 0) {
      setSelectedBriefId(briefs[0].id);
    }
  }, [briefs, selectedBriefId]);

  // ── API: detail ──────────────────────────────────────────────────────────
  const {
    data: detailData,
    isLoading: detailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = useGetStrategyBrief(selectedBriefId ?? "");

  const selectedBrief = detailData?.data ?? null;

  // ── API: approve ─────────────────────────────────────────────────────────
  const { mutate: approveBrief, isPending: isApproving } = useApproveStrategyBrief();

  const handleApprove = () => {
    if (!selectedBriefId) return;
    approveBrief(selectedBriefId, {
      onSuccess: () => router.push("/campaigns"),
    });
  };

  // ── Debounce search ──────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setOffset(0);
    }, 400);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <BriefList
        briefs={briefs}
        total={total}
        offset={offset}
        loading={loading}
        isError={isListError}
        searchInput={searchInput}
        debouncedSearch={debouncedSearch}
        selectedBriefId={selectedBriefId}
        onSelectBrief={setSelectedBriefId}
        onSearchChange={handleSearchChange}
        onPagePrev={() => setOffset((o) => Math.max(0, o - PAGE_LIMIT))}
        onPageNext={() => setOffset((o) => o + PAGE_LIMIT)}
        onRetry={() => refetchList()}
      />

      <BriefDetail
        selectedBrief={selectedBrief}
        isLoading={detailLoading}
        isError={isDetailError}
        isApproving={isApproving}
        debouncedSearch={debouncedSearch}
        onApprove={handleApprove}
        onRetry={() => refetchDetail()}
      />
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

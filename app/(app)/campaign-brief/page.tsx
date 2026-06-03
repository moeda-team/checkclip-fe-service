"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefList } from "@/components/campaign-brief/BriefList";
import { BriefDetail } from "@/components/campaign-brief/BriefDetail";
import {
  useInfiniteStrategyBriefs,
  useGetStrategyBrief,
  useApproveStrategyBrief,
} from "./hooks/useCampaignBrief";

function CampaignBriefListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("selectedId");

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Detail state
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(preselectedId);

  // ── API: infinite list ───────────────────────────────────────────────────
  const {
    data,
    isLoading: loading,
    isError: isListError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchList,
  } = useInfiniteStrategyBriefs(debouncedSearch);

  // Flatten semua halaman menjadi satu array
  const briefs = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data]
  );
  const total = data?.pages[0]?.total ?? 0;

  // Auto-select brief pertama saat list pertama kali load
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
    }, 400);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <BriefList
        briefs={briefs}
        total={total}
        loading={loading}
        isError={isListError}
        isFetchingMore={isFetchingNextPage}
        hasMore={!!hasNextPage}
        searchInput={searchInput}
        debouncedSearch={debouncedSearch}
        selectedBriefId={selectedBriefId}
        onSelectBrief={setSelectedBriefId}
        onSearchChange={handleSearchChange}
        onLoadMore={fetchNextPage}
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

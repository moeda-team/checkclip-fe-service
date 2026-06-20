"use client";

import { usePathname, useRouter } from "next/navigation";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Plus } from "lucide-react";

export function AppShell() {
  const pathname = usePathname();
  const router = useRouter();

  const pathToItem: Record<string, string> = {
    "/": "home",
    "/health": "health",
    "/challenges": "challenges",
    "/profile": "profile",
  };

  const activeItem = pathToItem[pathname] || "home";

  return (
    <>
      <BottomNavigation activeItem={activeItem} />
      <FloatingActionButton onClick={() => router.push("/add")}>
        <Plus size={28} />
      </FloatingActionButton>
    </>
  );
}

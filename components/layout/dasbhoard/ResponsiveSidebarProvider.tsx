"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface SidebarContextType {
  // Mobile: drawer open/close
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  // Desktop: collapsed (icon-only) / expanded
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setMounted(true), 0);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  if (!mounted) {
    return (
      <SidebarContext.Provider
        value={{ sidebarOpen: false, toggleSidebar, setSidebarOpen, collapsed: false, toggleCollapsed }}
      >
        {children}
      </SidebarContext.Provider>
    );
  }

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, toggleSidebar, setSidebarOpen, collapsed, toggleCollapsed }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

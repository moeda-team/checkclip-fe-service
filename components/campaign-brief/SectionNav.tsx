"use client";

import {  ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionItem = {
  key: string;
  label: string;
  icon: React.ElementType;
};

interface SectionNavProps {
  sections: SectionItem[];
  activeSection: string;
  isOpen: boolean;
  onToggle: () => void;
  onSectionClick: (key: string) => void;
}

export function SectionNav({
  sections,
  activeSection,
  isOpen,
  onToggle,
  onSectionClick,
}: SectionNavProps) {
  return (
    <div
      className={cn(
        "border-r border-gray-200 bg-white flex flex-col shrink-0 transition-all duration-200",
        isOpen ? "w-52" : "w-10"
      )}
    >
      <div className="flex justify-end p-2 border-b border-gray-100">
        <button
          type="button"
          onClick={onToggle}
          className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center"
        >
          {isOpen ? (
            <ChevronsLeft className="w-3.5 h-3.5 text-white" />
          ) : (
            <ChevronsRight className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </div>

      {isOpen && (
        <nav className="flex-1 overflow-y-auto py-2">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                type="button"
                onClick={() => onSectionClick(sec.key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ",
                  isActive
                    ? "text-purple-700 font-semibold bg-purple-100 rounded-sm"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon
                  className={cn("w-4 h-4 shrink-0", isActive && "text-purple-600")}
                />
                {sec.label}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

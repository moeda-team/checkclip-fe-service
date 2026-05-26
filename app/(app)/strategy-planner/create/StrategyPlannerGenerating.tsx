// app/(app)/strategy-planner/create/StrategyPlannerGenerating.tsx
// Loading screen shown while strategy planner is being generated

"use client";

import { useEffect, useState } from "react";

interface StrategyPlannerGeneratingProps {
  progress?: number;
}

export function StrategyPlannerGenerating({
  progress: externalProgress
}: StrategyPlannerGeneratingProps) {
  const [internalProgress, setInternalProgress] = useState(0);

  const progress = externalProgress ?? internalProgress;

  useEffect(() => {
    if (externalProgress !== undefined) return;

    // Simulate progressive loading
    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 90) return prev; // Cap at 90% until complete
        const increment = Math.random() * 8 + 2; // Random increment between 2-10
        return Math.min(prev + increment, 90);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [externalProgress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] bg-white">
      {/* Sparkle Animation */}
      <div className="relative mb-8">
        {/* Small sparkle (top) */}
        <div className="animate-pulse">
          <SparkleIcon className="w-5 h-5 text-violet-600 mx-auto mb-2" />
        </div>
        {/* Large sparkle (main) */}
        <div className="animate-bounce" style={{ animationDuration: "2s" }}>
          <SparkleIcon className="w-10 h-10 text-violet-700" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-violet-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Text */}
      <p className="text-sm text-gray-600 font-medium">Generate suggestion...</p>
    </div>
  );
}

// Sparkle/Star SVG Icon
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  );
}

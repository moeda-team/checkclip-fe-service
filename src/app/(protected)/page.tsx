"use client";

import { Card, ProgressBar } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="pb-[120px]">
      <header className="pt-8 pb-6">
        <h1 className="text-heading mb-2">Good Morning! &#x2600;&#xFE0F;</h1>
        <p className="text-body text-muted-foreground">Let&apos;s make today wonderful</p>
      </header>

      <div className="flex flex-col gap-6">
        <Card variant="primary" className="min-h-[200px] flex items-center justify-center">
          <div className="text-center w-full">
            <div className="w-[120px] h-[120px] rounded-[--radius-avatar] bg-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-display">85</span>
            </div>
            <div>
              <p className="text-subheading">Wellness Score</p>
              <p className="text-caption mt-1 text-white/80">You&apos;re doing great!</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="success" className="min-h-[120px] flex items-center">
            <div className="w-full">
              <p className="text-caption text-muted-foreground">Sleep</p>
              <p className="text-heading mb-4">7h 30m</p>
              <ProgressBar progress={85} color="success" />
            </div>
          </Card>

          <Card variant="warning" className="min-h-[120px] flex items-center">
            <div className="w-full">
              <p className="text-caption text-muted-foreground">Activity</p>
              <p className="text-heading mb-4">2,450</p>
              <ProgressBar progress={65} color="warning" />
            </div>
          </Card>

          <Card variant="info" className="min-h-[120px] flex items-center">
            <div className="w-full">
              <p className="text-caption text-muted-foreground">Hydration</p>
              <p className="text-heading mb-4">6/8 cups</p>
              <ProgressBar progress={75} color="info" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

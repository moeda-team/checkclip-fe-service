"use client";

import { Card, ProgressBar } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="pb-[120px]">
      <header className="pt-8 pb-6">
        <h1 className="text-heading mb-2">Good Morning! ☀️</h1>
        <p className="text-body">Let&apos;s make today wonderful</p>
      </header>

      <div className="flex flex-col gap-4">
        <Card variant="lavender" className="min-h-[180px] flex items-center justify-center">
          <div className="text-center w-full">
            <div className="w-[120px] h-[120px] rounded-full bg-white/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-display">85</span>
            </div>
            <div>
              <p className="text-subheading">Wellness Score</p>
              <p className="text-caption mt-1">You&apos;re doing great!</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card variant="mint" className="min-h-[100px] flex items-center">
            <div className="w-full">
              <p className="text-caption">Sleep</p>
              <p className="text-heading mb-4">7h 30m</p>
              <ProgressBar progress={85} color="mint" />
            </div>
          </Card>

          <Card variant="peach" className="min-h-[100px] flex items-center">
            <div className="w-full">
              <p className="text-caption">Activity</p>
              <p className="text-heading mb-4">2,450</p>
              <ProgressBar progress={65} color="peach" />
            </div>
          </Card>

          <Card variant="aqua" className="min-h-[100px] flex items-center">
            <div className="w-full">
              <p className="text-caption">Hydration</p>
              <p className="text-heading mb-4">6/8 cups</p>
              <ProgressBar progress={75} color="aqua" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

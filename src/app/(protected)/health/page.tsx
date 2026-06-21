"use client";

import { Card } from "@/components/ui";

export default function HealthPage() {
  return (
    <div className="pb-[120px]">
      <header className="pt-8 pb-6">
        <h1 className="text-heading mb-2">Health Overview</h1>
        <p className="text-body text-muted-foreground">Your wellness journey</p>
      </header>

      <div className="flex flex-col gap-6">
        <Card variant="primary-soft" className="min-h-[140px]">
          <h2 className="text-subheading mb-4">Today&apos;s Progress</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-caption text-muted-foreground">Steps</p>
              <p className="text-heading">8,432</p>
            </div>
            <div className="text-center">
              <p className="text-caption text-muted-foreground">Calories</p>
              <p className="text-heading">1,850</p>
            </div>
            <div className="text-center">
              <p className="text-caption text-muted-foreground">Active Min</p>
              <p className="text-heading">45</p>
            </div>
          </div>
        </Card>

        <Card variant="success" className="min-h-[120px]">
          <h2 className="text-subheading mb-4">Sleep Quality</h2>
          <p className="text-body-lg">7h 30m average</p>
          <p className="text-caption mt-2 text-muted-foreground">This week</p>
        </Card>

        <Card variant="warning" className="min-h-[120px]">
          <h2 className="text-subheading mb-4">Nutrition</h2>
          <p className="text-body-lg">1,850 / 2,000 cal</p>
          <p className="text-caption mt-2 text-muted-foreground">Daily goal</p>
        </Card>
      </div>
    </div>
  );
}

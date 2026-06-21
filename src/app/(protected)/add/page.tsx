"use client";

import { Card } from "@/components/ui";
import { Activity, Droplet, Moon, Apple } from "lucide-react";

export default function AddPage() {
  return (
    <div>
      <header className="pt-8 pb-6">
        <h1 className="text-heading mb-2">Add Activity</h1>
        <p className="text-body text-muted-foreground">Track your wellness journey</p>
      </header>

      <div className="flex flex-col gap-6">
        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-foreground bg-warning-soft">
              <Activity size={28} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Exercise</h3>
              <p className="text-caption m-0 text-muted-foreground">Record your workout</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-foreground bg-info-soft">
              <Droplet size={28} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Add Water</h3>
              <p className="text-caption m-0 text-muted-foreground">Track hydration</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-foreground bg-primary-soft">
              <Moon size={28} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Sleep</h3>
              <p className="text-caption m-0 text-muted-foreground">Record sleep hours</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-foreground bg-success-soft">
              <Apple size={28} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Meal</h3>
              <p className="text-caption m-0 text-muted-foreground">Track nutrition</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-foreground bg-muted">
              <span className="text-heading">&#x1F60A;</span>
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Mood</h3>
              <p className="text-caption m-0 text-muted-foreground">How are you feeling?</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui";
import { Activity, Droplet, Moon, Apple } from "lucide-react";

export default function AddPage() {
  return (
    <div>
      <header className="pt-8 pb-6">
        <h1 className="text-heading mb-2">Add Activity</h1>
        <p className="text-body">Track your wellness journey</p>
      </header>

      <div className="flex flex-col gap-4">
        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-button flex items-center justify-center text-midnight bg-peach">
              <Activity size={32} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Exercise</h3>
              <p className="text-caption m-0">Record your workout</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-button flex items-center justify-center text-midnight bg-aqua">
              <Droplet size={32} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Add Water</h3>
              <p className="text-caption m-0">Track hydration</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-button flex items-center justify-center text-midnight bg-lavender-mist">
              <Moon size={32} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Sleep</h3>
              <p className="text-caption m-0">Record sleep hours</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-button flex items-center justify-center text-midnight bg-mint">
              <Apple size={32} />
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Meal</h3>
              <p className="text-caption m-0">Track nutrition</p>
            </div>
          </div>
        </Card>

        <Card variant="default" clickable onClick={() => {}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-button flex items-center justify-center text-midnight bg-mist">
              <span className="text-heading">😊</span>
            </div>
            <div>
              <h3 className="text-subheading mb-1">Log Mood</h3>
              <p className="text-caption m-0">How are you feeling?</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

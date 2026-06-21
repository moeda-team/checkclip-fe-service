"use client";

import { Card, ProgressBar, Avatar, AvatarFallback } from "@/components/ui";

export default function ChallengesPage() {
  return (
    <div className="pb-[120px]">
      <header className="pt-8 pb-6">
        <h1 className="text-heading mb-2">Challenges</h1>
        <p className="text-body text-muted-foreground">Join fun wellness challenges</p>
      </header>

      <div className="flex flex-col gap-6">
        <Card variant="primary" className="min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">10K Steps Daily</h2>
            <span className="text-caption bg-white/20 px-3 py-1 rounded-[--radius-badge] whitespace-nowrap ml-2">12 days left</span>
          </div>
          <ProgressBar progress={75} color="primary" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>A</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>B</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>C</AvatarFallback></Avatar>
              <span className="text-caption ml-1 text-white/80">+24 more</span>
            </div>
            <span className="text-body-lg">75%</span>
          </div>
        </Card>

        <Card variant="warning" className="min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">Burn 500 Calories</h2>
            <span className="text-caption bg-[#F59E0B]/15 px-3 py-1 rounded-[--radius-badge] whitespace-nowrap ml-2">5 days left</span>
          </div>
          <ProgressBar progress={60} color="warning" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>D</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>E</AvatarFallback></Avatar>
              <span className="text-caption ml-1 text-muted-foreground">+12 more</span>
            </div>
            <span className="text-body-lg">60%</span>
          </div>
        </Card>

        <Card variant="success" className="min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">8 Hours Sleep</h2>
            <span className="text-caption bg-[#4ADE80]/15 px-3 py-1 rounded-[--radius-badge] whitespace-nowrap ml-2">20 days left</span>
          </div>
          <ProgressBar progress={90} color="success" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>F</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>G</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>H</AvatarFallback></Avatar>
              <span className="text-caption ml-1 text-muted-foreground">+45 more</span>
            </div>
            <span className="text-body-lg">90%</span>
          </div>
        </Card>

        <Card variant="info" className="min-h-[160px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">Drink 8 Cups Water</h2>
            <span className="text-caption bg-[#38BDF8]/15 px-3 py-1 rounded-[--radius-badge] whitespace-nowrap ml-2">Ongoing</span>
          </div>
          <ProgressBar progress={100} color="info" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>I</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>J</AvatarFallback></Avatar>
              <span className="text-caption ml-1 text-muted-foreground">+8 more</span>
            </div>
            <span className="text-body-lg">100%</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

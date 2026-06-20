"use client";

import { Card, ProgressBar, Avatar, AvatarFallback } from "@/components/ui";

export default function ChallengesPage() {
  return (
    <div className="pb-[120px]">
      <header className="pt-8 pb-6">
        <h1 className="text-heading mb-2">Challenges</h1>
        <p className="text-body">Join fun wellness challenges</p>
      </header>

      <div className="flex flex-col gap-4">
        <Card variant="lavender" className="min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">10K Steps Daily</h2>
            <span className="text-caption bg-white/50 px-2 py-1 rounded-button whitespace-nowrap ml-2">12 days left</span>
          </div>
          <ProgressBar progress={75} color="lavender" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>A</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>B</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>C</AvatarFallback></Avatar>
              <span className="text-caption ml-1">+24 more</span>
            </div>
            <span className="text-body-lg">75%</span>
          </div>
        </Card>

        <Card variant="peach" className="min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">Burn 500 Calories</h2>
            <span className="text-caption bg-white/50 px-2 py-1 rounded-button whitespace-nowrap ml-2">5 days left</span>
          </div>
          <ProgressBar progress={60} color="peach" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>D</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>E</AvatarFallback></Avatar>
              <span className="text-caption ml-1">+12 more</span>
            </div>
            <span className="text-body-lg">60%</span>
          </div>
        </Card>

        <Card variant="mint" className="min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">8 Hours Sleep</h2>
            <span className="text-caption bg-white/50 px-2 py-1 rounded-button whitespace-nowrap ml-2">20 days left</span>
          </div>
          <ProgressBar progress={90} color="mint" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>F</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>G</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>H</AvatarFallback></Avatar>
              <span className="text-caption ml-1">+45 more</span>
            </div>
            <span className="text-body-lg">90%</span>
          </div>
        </Card>

        <Card variant="aqua" className="min-h-[140px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-subheading m-0 flex-1">Drink 8 Cups Water</h2>
            <span className="text-caption bg-white/50 px-2 py-1 rounded-button whitespace-nowrap ml-2">Ongoing</span>
          </div>
          <ProgressBar progress={100} color="aqua" />
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-2">
              <Avatar size="sm"><AvatarFallback>I</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>J</AvatarFallback></Avatar>
              <span className="text-caption ml-1">+8 more</span>
            </div>
            <span className="text-body-lg">100%</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

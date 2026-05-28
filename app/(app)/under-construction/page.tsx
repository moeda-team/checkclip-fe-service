// app/(app)/under-construction/page.tsx
// Under construction page for features not yet developed

import Link from "next/link";
import { ArrowLeft, HardHat, Clock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnderConstructionPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-3xl w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        {/* Left: Text */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium mb-4">
            <HardHat className="w-3.5 h-3.5" />
            <span>Under Construction</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            This Feature is Coming Soon
          </h1>

          <p className="text-gray-600 mb-2">
            We&apos;re working hard to bring you an amazing experience.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            This feature is currently under development and will be available
            soon. Check back later for updates.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link href="/dashboard">
              <Button className="inline-flex items-center gap-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white">
                <Home className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
            <Link href="/campaign-brief">
              <Button
                variant="outline"
                className="inline-flex items-center gap-2 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go to Campaign Briefs</span>
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2 justify-center lg:justify-start text-sm text-gray-500">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Estimated release: Coming Soon</span>
          </div>
        </div>

        {/* Right: Decorative */}
        <div className="hidden lg:flex relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 h-72">
          {/* Animated background elements */}
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

          {/* Construction icon */}
          <div className="absolute bottom-4 left-8 text-[5rem] leading-none text-white/20 font-bold">
            <HardHat className="w-24 h-24" />
          </div>

          <div className="relative z-10 p-8 flex flex-col justify-between text-white h-full">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70 mb-2">
                WORK IN PROGRESS
              </p>
              <p className="text-lg font-semibold">
                Building something
                <br />
                awesome for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

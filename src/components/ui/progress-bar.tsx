"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressColorVariants = cva("h-full rounded-[--radius-badge] transition-all", {
  variants: {
    color: {
      primary: "bg-gradient-to-r from-primary to-primary-light",
      success: "bg-gradient-to-r from-[#4ADE80] to-[#22C55E]",
      warning: "bg-gradient-to-r from-[#F59E0B] to-[#EAB308]",
      info: "bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9]",
    },
  },
  defaultVariants: {
    color: "primary",
  },
})

interface ProgressBarProps extends VariantProps<typeof progressColorVariants> {
  progress: number
  className?: string
}

function ProgressBar({
  className,
  progress,
  color = "primary",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div
      data-slot="progress-bar"
      className={cn("w-full h-2 bg-muted rounded-[--radius-badge] overflow-hidden", className)}
    >
      <div
        data-slot="progress-fill"
        className={cn(progressColorVariants({ color }))}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  )
}

export { ProgressBar, progressColorVariants }

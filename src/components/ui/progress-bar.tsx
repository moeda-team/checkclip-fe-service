"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressColorVariants = cva("h-full rounded-button transition-all", {
  variants: {
    color: {
      lavender: "bg-gradient-to-r from-lavender to-periwinkle",
      mint: "bg-gradient-to-r from-mint to-green",
      peach: "bg-gradient-to-r from-peach to-orange",
      aqua: "bg-gradient-to-r from-aqua to-lavender",
    },
  },
  defaultVariants: {
    color: "lavender",
  },
})

interface ProgressBarProps extends VariantProps<typeof progressColorVariants> {
  progress: number
  className?: string
}

function ProgressBar({
  className,
  progress,
  color = "lavender",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div
      data-slot="progress-bar"
      className={cn("w-full h-2 bg-mist rounded-button overflow-hidden", className)}
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

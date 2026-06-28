"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const fabPositionVariants = cva(
  "fixed z-[1000] w-16 h-16 rounded-[--radius-badge] border-none cursor-pointer bg-linear-to-br from-primary to-primary-light shadow-[--shadow-fab] flex items-center justify-center transition-all text-white outline-none hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_16px_48px_rgba(108,99,255,0.35)] active:translate-y-0 active:scale-100",
  {
    variants: {
      position: {
        "bottom-center": "bottom-[88px] left-1/2 -translate-x-1/2 hover:-translate-x-1/2 hover:-translate-y-0.5 hover:scale-105",
        "bottom-right": "bottom-[88px] right-6",
      },
    },
    defaultVariants: {
      position: "bottom-center",
    },
  }
)

interface FloatingActionButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof fabPositionVariants> {}

function FloatingActionButton({
  className,
  position = "bottom-center",
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      data-slot="fab"
      className={cn(fabPositionVariants({ position }), className)}
      aria-label="Add"
      {...props}
    />
  )
}

export { FloatingActionButton, fabPositionVariants }

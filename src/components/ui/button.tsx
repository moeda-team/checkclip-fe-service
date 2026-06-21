import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[16px] border-none cursor-pointer font-semibold font-sans transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-primary to-primary-light text-white shadow-[--shadow-primary] hover:-translate-y-0.5 hover:shadow-[--shadow-primary-hover] active:translate-y-0",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-input bg-surface shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-primary-soft text-foreground hover:bg-primary-soft/80",
        ghost:
          "bg-transparent text-primary hover:bg-primary-soft",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-3",
        sm: "h-9 gap-1.5 rounded-[12px] px-4 text-[13px] has-[>svg]:px-2.5",
        md: "px-4 py-2.5 text-[15px]",
        lg: "px-8 py-4 text-[16px]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

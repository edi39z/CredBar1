import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out select-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-lg shadow-[0_0_12px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-95",
        glass:
          "bg-white/15 hover:bg-white/25 text-white border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.4),inset_0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6),inset_0_0_12px_rgba(255,255,255,0.3)] backdrop-blur-md active:scale-95",
        "glass-outline":
          "bg-transparent hover:bg-white/10 text-white border border-white/40 shadow-[inset_0_0_8px_rgba(255,255,255,0.4)] hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.6)] backdrop-blur-sm active:scale-95",
        ghost:
          "bg-transparent hover:bg-white/20 text-white active:scale-95",
        link: "underline text-white hover:text-white/80",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

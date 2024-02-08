import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/common/libs/shadcn/utils"
import { ReloadIcon } from "@radix-ui/react-icons"
import Icon from "@/common/libs/lucida-icon"
import { icons } from "lucide-react"


const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/80",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/80 dark:bg-red-400 dark:text-black dark:hover:bg-red-400/80",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        orange: "bg-orange-600 text-white hover:bg-orange-600/80 dark:bg-orange-400 dark:text-black dark:hover:bg-orange-400/80",
        blue: "bg-blue-600 text-white hover:bg-blue-600/80 dark:bg-blue-400 dark:text-black dark:hover:bg-blue-400/80",
        yellow: "bg-yellow-500 text-dark hover:bg-yellow-500/80 dark:bg-yellow-400 dark:text-black dark:hover:bg-yellow-400/80",
        green: "bg-green-500 text-dark hover:bg-green-500/80 dark:bg-green-400 dark:text-black dark:hover:bg-green-400/80",
        purple: "bg-purple-500 text-dark hover:bg-purple-500/80 dark:bg-purple-400 dark:text-black dark:hover:bg-purple-400/80",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "min-h-8 min-w-8 max-h-8 max-w-8",
        iconSm: "min-h-7 min-w-7 max-h-7 max-w-7",
        iconExSm: "min-h-6 min-w-6 max-h-6 max-w-6",
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
  asChild?: boolean,
  isLoading?: boolean,
  leftIcon?: keyof typeof icons
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? (
          <>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {props.children}
          </>
        ) : (
          <>
            {!isLoading && leftIcon && <Icon name={leftIcon} className='mr-2' size={14} />}
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {props.children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

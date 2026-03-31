import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-light shadow-sm",
          variant === "secondary" && "bg-surface-alt text-gray-900 hover:bg-gray-200",
          variant === "outline" && "border border-border bg-white text-gray-700 hover:bg-surface-alt",
          variant === "ghost" && "text-gray-700 hover:bg-surface-alt",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-5 text-sm",
          size === "lg" && "h-12 px-8 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };

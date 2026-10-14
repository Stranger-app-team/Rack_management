import { cn } from "@/lib/utils"

export function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm shadow-2xs font-medium",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export function Label({ className, children, ...props }) {
  return (
    <label className={cn("text-sm font-semibold text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
      {children}
    </label>
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm shadow-2xs font-medium",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors resize-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}


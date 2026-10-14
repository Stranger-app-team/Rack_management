import { cn } from "@/lib/utils"
import { CATEGORY_COLORS, STATUS_CONFIG } from "@/lib/utils"

export function Badge({ children, variant = "default", className, ...props }) {
  const variants = {
    default:  "bg-primary/15 text-primary border border-primary/40 font-semibold",
    secondary:"bg-secondary text-secondary-foreground border border-border font-medium",
    outline:  "border border-border text-foreground bg-card shadow-2xs font-medium",
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs", variants[variant], className)} {...props}>
      {children}
    </span>
  )
}

export function CategoryBadge({ category, className }) {
  const cfg = CATEGORY_COLORS[category] || { bg:"bg-muted", border:"border-border", text:"text-foreground" }
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-bold border shadow-2xs", cfg.bg, cfg.border, cfg.text, className)}>
      {category}
    </span>
  )
}

export function StockBadge({ status, className }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.OK
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-md px-2.5 py-0.5 text-xs font-bold border shadow-2xs", cfg.bg, cfg.border, cfg.text, className)}>
      <span className={cn("status-dot", cfg.dot)} />
      {cfg.label}
    </span>
  )
}

export function LocationBadge({ locationId, className }) {
  return (
    <span className={cn("font-mono text-xs font-semibold bg-slate-200/90 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-400/80 dark:border-slate-600 rounded px-2 py-0.5 shadow-2xs inline-block", className)}>
      {locationId || "—"}
    </span>
  )
}

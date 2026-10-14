import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const CATEGORY_COLORS = {
  AC:         { bg: "bg-cyan-500/15 dark:bg-cyan-500/20",   border: "border-cyan-600/50 dark:border-cyan-400/50",   text: "text-cyan-800 dark:text-cyan-200",   dot: "#06b6d4" },
  CARPENTER:  { bg: "bg-amber-500/15 dark:bg-amber-500/20",  border: "border-amber-600/50 dark:border-amber-400/50",  text: "text-amber-900 dark:text-amber-200",  dot: "#f59e0b" },
  CIVIL:      { bg: "bg-orange-500/15 dark:bg-orange-500/20", border: "border-orange-600/50 dark:border-orange-400/50", text: "text-orange-900 dark:text-orange-200", dot: "#f97316" },
  DECOR:      { bg: "bg-pink-500/15 dark:bg-pink-500/20",   border: "border-pink-600/50 dark:border-pink-400/50",   text: "text-pink-900 dark:text-pink-200",   dot: "#ec4899" },
  ELECTRIC:   { bg: "bg-yellow-500/15 dark:bg-yellow-500/20", border: "border-yellow-600/50 dark:border-yellow-400/50", text: "text-yellow-900 dark:text-yellow-200", dot: "#eab308" },
  FURNISHING: { bg: "bg-purple-500/15 dark:bg-purple-500/20", border: "border-purple-600/50 dark:border-purple-400/50", text: "text-purple-900 dark:text-purple-200", dot: "#a855f7" },
  PLUMBER:    { bg: "bg-blue-500/15 dark:bg-blue-500/20",   border: "border-blue-600/50 dark:border-blue-400/50",   text: "text-blue-900 dark:text-blue-200",   dot: "#3b82f6" },
}

export const STATUS_CONFIG = {
  OK:      { label: "OK",      bg: "bg-emerald-500/15 dark:bg-emerald-500/25", border: "border-emerald-600/50 dark:border-emerald-400/50", text: "text-emerald-800 dark:text-emerald-200 font-bold", dot: "ok" },
  REORDER: { label: "REORDER", bg: "bg-amber-500/15 dark:bg-amber-500/25",   border: "border-amber-600/50 dark:border-amber-400/50",   text: "text-amber-800 dark:text-amber-200 font-bold", dot: "reorder" },
  EMPTY:   { label: "EMPTY",   bg: "bg-red-500/15 dark:bg-red-500/25",     border: "border-red-600/50 dark:border-red-400/50",     text: "text-red-800 dark:text-red-200 font-bold",     dot: "empty" },
}

export const LEVEL_ORDER = ["GL1","GL2","GL3","SL4","SL5","SL6"]

export const LEVEL_LABELS = {
  GL1: "GL1 — Floor",
  GL2: "GL2 — Ground",
  GL3: "GL3 — Mid",
  SL4: "SL4 — Lower Stilt",
  SL5: "SL5 — Mid Stilt",
  SL6: "SL6 — Upper Stilt",
}

export function formatDate(dateStr) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

export function formatQty(qty, unit) {
  if (qty === null || qty === undefined) return "—"
  return `${Number(qty).toLocaleString(undefined, { maximumFractionDigits: 2 })}${unit ? " " + unit : ""}`
}

export const CATEGORIES = ["AC","CARPENTER","CIVIL","DECOR","ELECTRIC","FURNISHING","PLUMBER"]
export const LEVELS = ["GL1","GL2","GL3","SL4","SL5","SL6"]
export const UNITS = ["PCS","MTR","SQF","BAG","KG","LTR","SHT","ROL","NOS","BOX","CAN","BTL"]

/**
 * Safely exports structured data to a CSV file with:
 * - Proper RFC 4180 CSV escaping (handling commas, double quotes, linebreaks)
 * - UTF-8 Byte Order Mark (BOM: \uFEFF) for 100% correct character rendering in Microsoft Excel
 * - Clean download trigger and memory cleanup
 */
export function exportToCSV(filename, headers, rows) {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""'
    const str = String(val)
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return `"${str}"`
  }

  const headerLine = headers.map(escapeCell).join(",")
  const rowLines = rows.map(r => r.map(escapeCell).join(","))
  const csvContent = "\uFEFF" + [headerLine, ...rowLines].join("\r\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

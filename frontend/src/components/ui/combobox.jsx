import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Combobox({ value, onChange, options, placeholder = "Select or type...", className = "" }) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState(value || "")
  const wrapperRef = React.useRef(null)
  const dropdownRef = React.useRef(null)
  const [dropdownStyle, setDropdownStyle] = React.useState({})

  React.useEffect(() => {
    const matched = options.find(o => (typeof o === 'string' ? o : o.value) === value)
    if (matched) {
      setQuery(typeof matched === 'string' ? matched : (matched.label || matched.value))
    } else {
      setQuery(value || "")
    }
  }, [value, options])

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (wrapperRef.current && wrapperRef.current.contains(e.target)) ||
        (dropdownRef.current && dropdownRef.current.contains(e.target))
      ) {
        return
      }
      setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filtered = options.filter(o => {
    const text = typeof o === 'string' ? o : (o.label || o.value || "")
    const searchStr = typeof o === 'string' ? o : `${o.label} ${o.value} ${o.sub || ''}`
    if (query === text) return true // Show all options if query exactly matches selected label
    return searchStr.toLowerCase().includes(query.toLowerCase())
  })
  
  const handleChange = (e) => {
    setQuery(e.target.value)
    onChange(e.target.value)
    setOpen(true)
  }

  const handleSelect = (opt) => {
    const val = typeof opt === 'string' ? opt : opt.value
    const label = typeof opt === 'string' ? opt : (opt.label || opt.value)
    setQuery(label)
    onChange(val)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && open && filtered.length > 0) {
      e.preventDefault()
      handleSelect(filtered[0])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  // Update portal position on scroll/resize and open
  React.useEffect(() => {
    if (!open || !wrapperRef.current) return
    const updatePosition = () => {
      const rect = wrapperRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const height = Math.min(260, Math.max(60, filtered.length * 48 + 12))

      if (spaceBelow < height && spaceAbove > spaceBelow) {
        setDropdownStyle({
          position: 'fixed',
          top: Math.max(8, rect.top - height - 4),
          left: rect.left,
          width: rect.width,
        })
      } else {
        setDropdownStyle({
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        })
      }
    }
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, filtered.length])

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={cn(
        "flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-2xs",
        className
      )}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground text-foreground text-xs font-medium"
        />
        <ChevronDown 
          className={cn("h-4 w-4 opacity-60 ml-2 cursor-pointer shrink-0 transition-transform duration-200", open && "rotate-180 opacity-100 text-primary")} 
          onClick={() => setOpen(!open)} 
        />
      </div>
      {open && createPortal(
        <ul 
          ref={dropdownRef} 
          style={dropdownStyle} 
          className="z-[9999] max-h-64 overflow-y-auto rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl p-1.5 outline-none animate-in fade-in-0 zoom-in-95 space-y-1"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-4 text-xs text-muted-foreground font-medium text-center">
              No matching materials found.
            </li>
          ) : (
            filtered.map((opt, i) => {
              const val = typeof opt === 'string' ? opt : opt.value
              const label = typeof opt === 'object' && opt.label ? opt.label : val
              const sub = typeof opt === 'object' ? opt.sub : null
              const isSelected = value === val

              return (
                <li
                  key={val || i}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(opt) }}
                  className={cn(
                    "relative flex flex-col w-full cursor-pointer select-none rounded-lg py-2 px-2.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                    isSelected ? "bg-primary/15 text-primary font-bold border border-primary/30" : "text-foreground font-medium"
                  )}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {val && (
                        <span className="font-mono text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 shrink-0">
                          {val}
                        </span>
                      )}
                      <span className="truncate font-bold">{label}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />
                    )}
                  </div>
                  {sub && (
                    <span className="text-[10px] text-muted-foreground font-medium truncate mt-0.5 pl-0.5">
                      {sub}
                    </span>
                  )}
                </li>
              )
            })
          )}
        </ul>,
        document.body
      )}
    </div>
  )
}


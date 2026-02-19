"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

export const Select = ({ children, value, onValueChange }: { children: React.ReactNode, value: string, onValueChange: (v: string) => void }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return null
  return (
    <button
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return null
  return <span>{ctx.value || placeholder}</span>
}

export const SelectContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx || !ctx.open) return null
  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      "top-[calc(100%+4px)] w-full", 
      className
    )}>
      <div className="p-1">{children}</div>
    </div>
  )
}

export const SelectItem = ({ value, children, className }: { value: string, children: React.ReactNode, className?: string }) => {
  const ctx = React.useContext(SelectContext)
  if (!ctx) return null
  return (
    <div
      onClick={() => {
        ctx.onValueChange(value)
        ctx.setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
        className
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {ctx.value === value && <span className="h-2 w-2 rounded-full bg-current" />}
      </span>
      {children}
    </div>
  )
}

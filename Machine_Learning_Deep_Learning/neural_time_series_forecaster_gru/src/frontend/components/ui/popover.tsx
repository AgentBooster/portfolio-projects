"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextType | null>(null)

export const Popover = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  )
}

export const PopoverTrigger = ({ asChild, children }: { asChild?: boolean, children: React.ReactNode }) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) return null
  
  // Clone element if asChild to pass onClick
  if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
          onClick: (e: any) => {
             children.props.onClick?.(e)
             ctx.setOpen(!ctx.open)
          }
      })
  }

  return (
    <button onClick={() => ctx.setOpen(!ctx.open)}>
      {children}
    </button>
  )
}

export const PopoverContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ctx = React.useContext(PopoverContext)
  if (!ctx || !ctx.open) return null
  return (
    <div className={cn(
      "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
      "top-[calc(100%+4px)] left-0",
      className
    )}>
      {children}
      {/* Backdrop to close */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={(e) => {
            e.stopPropagation()
            ctx.setOpen(false)
        }} 
      />
    </div>
  )
}

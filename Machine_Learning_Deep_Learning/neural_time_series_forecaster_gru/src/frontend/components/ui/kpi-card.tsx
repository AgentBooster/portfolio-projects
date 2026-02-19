import { LucideIcon } from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  subValue?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
  color?: "cyan" | "green" | "red" | "orange" | "emerald"
  isLoading?: boolean
}

export function KPICard({ title, value, subValue, icon: Icon, trend, trendValue, className, color = "cyan", isLoading = false }: KPICardProps) {
  const colorMap = {
    cyan: "text-cyan-400 from-cyan-400/20 to-cyan-400/5",
    green: "text-emerald-400 from-emerald-400/20 to-emerald-400/5",
    emerald: "text-emerald-400 from-emerald-400/20 to-emerald-400/5",
    red: "text-rose-400 from-rose-400/20 to-rose-400/5",
    orange: "text-amber-400 from-amber-400/20 to-amber-400/5",
  }

  return (
    <GlassCard className={cn("relative group", className)} gradient>
      <div className="flex items-start justify-between">
        <div className="w-full">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
              <div className="mt-2 h-8 w-24 bg-white/10 rounded animate-pulse" />
          ) : (
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</h3>
          )}
          
          {subValue && !isLoading && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
        <div className={cn("p-2 rounded-lg bg-gradient-to-br border border-white/5", colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(trend || trendValue) && !isLoading && (
        <div className="mt-4 flex items-center text-xs">
           <span className={cn("font-medium", 
             trend === "up" ? "text-red-400" : trend === "down" ? "text-emerald-400" : "text-muted-foreground"
           )}>
             {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendValue}
           </span>
           <span className="ml-1 text-muted-foreground">vs last period</span>
        </div>
      )}
    </GlassCard>
  )
}

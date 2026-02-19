"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch, AnalysisRequestBatch, BatchAnalysisResponse } from "@/lib/api"
import { GlassCard } from "@/components/ui/glass-card"
import { KPICard } from "@/components/ui/kpi-card"
import { LoadProfileChart } from "@/components/charts/load-profile-chart"
import { 
  Building2, 
  Calendar, 
  Leaf, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  DollarSign
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, subDays } from "date-fns"

const BUILDINGS = [
  "Edificio Apolonia",
  "Edificio Athanasius",
  "Edificio Central",
  "Edificio Madre Marta",
  "Edificio Mullin",
  "Edificio Semprún", 
  "Edificio Xalambrí"
]

export function AuditPanel() {
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0])
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: new Date(2024, 1, 1), // Feb 1, 2024 (Simulated Past)
    to: new Date(2024, 1, 7)
  })

  // Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["audit", selectedBuilding, dateRange],
    queryFn: async () => {
      const start = format(dateRange.from, "yyyy-MM-dd")
      const end = format(dateRange.to, "yyyy-MM-dd")
      
      const res = await apiFetch<BatchAnalysisResponse>("/api/v1/analyze/batch", {
        method: "POST",
        body: JSON.stringify({
          building_name: selectedBuilding,
          start_date: start,
          end_date: end,
        } as AnalysisRequestBatch),
      })
      
      if (res.context_log) {
          sessionStorage.setItem("latest_context", res.context_log)
          sessionStorage.setItem("audit_context", res.context_log)
      }
      return res
    },
    enabled: false, // Wait for manual trigger
    staleTime: 1000 * 60 * 5,
  })

  return (
    <div className="space-y-6">
      {/* Controls */}
      <GlassCard className="p-4 flex flex-wrap gap-4 items-center justify-between overflow-visible z-50">
        <div className="flex gap-4 items-center">
            <div className="w-[250px]">
                <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="Select Building" />
                    </SelectTrigger>
                    <SelectContent>
                        {BUILDINGS.map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {/* Date Range Picker */}
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 text-sm text-muted-foreground bg-black/20 px-3 py-2 rounded-md border border-white/10 hover:bg-white/5 transition-colors">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {dateRange.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "MMM dd, yyyy")} - {format(dateRange.to, "MMM dd, yyyy")}
                                    </>
                                ) : (
                                    format(dateRange.from, "MMM dd, yyyy")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 bg-black/90 border-white/10 backdrop-blur-xl" align="start">
                    <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range: any) => {
                             if (range?.from) {
                                 setDateRange({ from: range.from, to: range.to || range.from })
                             }
                        }}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>

            <Button onClick={() => refetch()} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Run Analysis
            </Button>
        </div>
        
        <div className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/10">
             Mode: <span className="text-cyan-400 font-mono">Historical Audit</span>
        </div>
      </GlassCard>

      {/* KPIs */}
      {/* KPIs - Always Render Grid to prevent jump */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* Row 1: Consumption & Waste */}
        <KPICard 
            title="Total Actual"
            value={data ? `${(data.total_actual_kwh/1000).toFixed(2)} MWh` : (isLoading ? "..." : "-")}
            icon={Zap}
            color="white"
            isLoading={isLoading}
        />
        <KPICard 
            title="Total Forecast"
            value={data ? `${(data.total_predicted_kwh/1000).toFixed(2)} MWh` : (isLoading ? "..." : "-")}
            icon={TrendingUp}
            color="white"
            isLoading={isLoading}
        />
        <KPICard 
            title="Net Difference"
            value={data ? `${((data.total_actual_kwh - data.total_predicted_kwh)/1000).toFixed(2)} MWh` : (isLoading ? "..." : "-")}
            icon={AlertTriangle}
            color={data && (data.total_actual_kwh > data.total_predicted_kwh) ? "red" : "emerald"}
            isLoading={isLoading}
        />
        <KPICard 
            title="Total Waste"
            value={data ? `${(data.total_waste_kwh).toFixed(0)} kWh` : (isLoading ? "..." : "-")}
            subValue={data ? `${data.waste_kwh_m2.toFixed(2)} kWh/m²` : ""}
            icon={AlertTriangle}
            color="red"
            isLoading={isLoading}
        />
        <KPICard 
            title="Est. Waste Cost"
            value={data ? `$${data.total_waste_cost_uyu.toLocaleString()}` : (isLoading ? "..." : "-")}
            subValue={data ? `$${data.cost_uyu_m2.toFixed(1)} /m²` : ""}
            icon={DollarSign}
            trend={data && data.total_waste_cost_uyu > 0 ? "down" : "neutral"}
            color="red"
            isLoading={isLoading}
        />
        
        {/* Row 2: Environment & Context */}
        <KPICard 
            title="Carbon Footprint"
            value={data ? `${data.total_waste_co2_kg.toFixed(1)} kg` : (isLoading ? "..." : "-")}
            subValue={data ? `${data.co2_kg_m2.toFixed(3)} kg/m²` : ""}
            icon={Leaf}
            trend="neutral"
            color="emerald"
            isLoading={isLoading}
        />
        <KPICard 
            title="Anomalies"
            value={data ? data.anomaly_count.toString() : (isLoading ? "..." : "-")}
            icon={AlertTriangle}
            color={data && data.anomaly_count > 0 ? "red" : "emerald"}
            isLoading={isLoading}
        />
      </div>


      {/* Chart */}
      <GlassCard className="p-6 h-[400px]">
        {isLoading ? (
            <div className="h-full flex items-center justify-center text-cyan-500 animate-pulse">Loading Deep Learning Models...</div>
        ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-red-400">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p>Error loading analysis</p>
                <p className="text-xs text-white/50 mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
        ) : data ? (
            <LoadProfileChart 
                data={data.timestamps.map((t, i) => ({
                    timestamp: t,
                    actual: data.actual_kwh[i],
                    predicted: data.predicted_kwh[i],
                    anomaly: data.anomaly_status[i]
                }))} 
            />
        ) : null}
      </GlassCard>
    </div>
  )
}

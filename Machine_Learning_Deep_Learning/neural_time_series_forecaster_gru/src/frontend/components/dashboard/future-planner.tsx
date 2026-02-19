"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiFetch, ForecastRequestBatch, BatchForecastResponse } from "@/lib/api"
import { GlassCard } from "@/components/ui/glass-card"
import { KPICard } from "@/components/ui/kpi-card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Zap, DollarSign, Leaf, TrendingUp } from "lucide-react"

const BUILDINGS = [
  "Edificio Apolonia",
  "Edificio Athanasius",
  "Edificio Central",
  "Edificio Madre Marta",
  "Edificio Mullin",
  "Edificio Semprún", 
  "Edificio Xalambrí"
]

export function FuturePlanner() {
  const [selectedBuilding, setSelectedBuilding] = useState(BUILDINGS[0])
  const [horizon, setHorizon] = useState(7)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["forecast", selectedBuilding, horizon],
    queryFn: async () => {
      const res = await apiFetch<BatchForecastResponse>("/api/v1/forecast/batch", {
        method: "POST",
        body: JSON.stringify({
          building_name: selectedBuilding,
          horizon_days: horizon,
        } as ForecastRequestBatch),
      })
      
      // Save context for the Agent (Client-side integration)
      if (res.context_log) {
          sessionStorage.setItem("latest_context", res.context_log)
          sessionStorage.setItem("forecast_context", res.context_log)
      }
      return res
    },
    enabled: false, // Wait for user action
  })

  // Debug Logging
  if (data) {
      console.log("Forecast Data Received:", {
          len_pred: data.predicted_kwh?.length,
          len_ts: data.timestamps?.length,
          sample: data.predicted_kwh?.slice(0, 5)
      })
  }

  // Chart Data - Robust Casting
  const chartData = data?.timestamps.map((t, i) => ({
      timestamp: t,
      predicted: Number(data.predicted_kwh[i]) 
  }))

  return (
    <div className="space-y-6">
       {/* Controls */}
       <GlassCard className="p-4 flex flex-wrap gap-4 items-center overflow-visible z-50">
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

            <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-muted-foreground mr-2">Forecast Horizon: {horizon} Days</label>
                <input 
                    type="range" 
                    min="1" max="30" 
                    value={horizon} 
                    onChange={(e) => setHorizon(parseInt(e.target.value))}
                    className="w-[200px] accent-purple-500"
                />
            </div>

            <Button onClick={() => refetch()} className="bg-purple-600 hover:bg-purple-500 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Generate Plan
            </Button>
       </GlassCard>

       {/* Metrics Grid - 5 Columns for extended parity */}
       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in">
            <KPICard 
                title="Projected Load" 
                value={data ? `${(data.total_projected_kwh/1000).toFixed(2)} MWh` : (isLoading ? "..." : "-")} 
                icon={Zap}
                color="purple"
                isLoading={isLoading}
            />
            <KPICard 
                title="Estimated Cost" 
                value={data ? `$${Math.round(data.projected_cost_uyu).toLocaleString()}` : (isLoading ? "..." : "-")} 
                subValue={data ? `$${data.cost_uyu_m2.toFixed(1)} /m²` : ""}
                icon={DollarSign}
                color="cyan"
                isLoading={isLoading}
            />
            <KPICard 
                title="Est. Footprint" 
                value={data ? `${data.projected_co2_kg.toFixed(1)} kg` : (isLoading ? "..." : "-")} 
                subValue={data ? `${data.co2_kg_m2.toFixed(3)} kg/m²` : ""}
                icon={Leaf}
                color="emerald"
                isLoading={isLoading}
            />
            <KPICard 
                title="Est. Intensity" 
                value={data ? `${data.projected_intensity_kwh_m2.toFixed(2)}` : (isLoading ? "..." : "-")} 
                subValue="kWh/m²"
                icon={Zap}
                color="cyan"
                isLoading={isLoading}
            />
            <KPICard 
                title="Pk Load Time" 
                value={data ? data.peak_timestamp.split(' ')[1] : (isLoading ? "..." : "-")} 
                subValue={data ? `${data.peak_load_kwh.toFixed(1)} kWh` : ""}
                icon={TrendingUp}
                color="orange"
                isLoading={isLoading}
            />
       </div>

        <GlassCard className="p-6 h-[450px]">
              {isLoading ? (
                  <div className="h-full flex items-center justify-center text-purple-400 animate-pulse">Running Autoregressive Inference...</div>
              ) : data && data.predicted_kwh.length > 0 ? (
                  <div className="w-full h-[350px]"> {/* Definitive Height Fix */}
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                  <linearGradient id="colorPredFP" x1="0" y1="0" x2="0" y2="1"> {/* Unique ID */}
                                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                              <XAxis 
                                  dataKey="timestamp" 
                                  stroke="#ffffff50" 
                                  tick={{fontSize: 12}}
                                  tickFormatter={(val) => {
                                      if (typeof val === 'string' && val.includes(' ')) return val.split(' ')[0].slice(5);
                                      return val;
                                  }}
                              />
                          <YAxis stroke="#ffffff50" />
                          <Tooltip 
                              contentStyle={{ backgroundColor: "#000000aa", border: "1px solid #ffffff20", backdropFilter: "blur(10px)" }}
                              labelStyle={{ color: "#ffffff", fontWeight: "bold", marginBottom: "0.5rem" }}
                              formatter={(value: number) => [`${value.toFixed(2)} kWh`, "Predicted Load"]}
                              labelFormatter={(label) => {
                                  // Try to parse string timestamp if needed, or just return formatted
                                  if (typeof label === 'string') {
                                    return label.replace('T', ' ').slice(5, 16) // Simple slice "MM-DD HH:mm"
                                  }
                                  return label
                              }}
                          />
                          <Area 
                              type="monotone" 
                              dataKey="predicted" 
                              stroke="#8b5cf6" 
                              fillOpacity={1} 
                              fill="url(#colorPredFP)" 
                          />
                      </AreaChart>
                  </ResponsiveContainer>
                  </div>
               ) : error ? (
                   <div className="h-full flex flex-col items-center justify-center text-red-400">
                       <p>Error generating forecast</p>
                       <p className="text-xs text-white/50 mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
                   </div>
               ) : (
                   <div className="h-full flex items-center justify-center text-muted-foreground">Select parameters and click Generate</div>
               )}
        </GlassCard>
    </div>
  )
}

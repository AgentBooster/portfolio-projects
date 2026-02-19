"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, ComposedChart, Scatter } from "recharts"
import { cn } from "@/lib/utils"

interface LoadProfileChartProps {
  data: {
    timestamp: string
    actual: number
    predicted: number
    anomaly: boolean
  }[]
  className?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/80 backdrop-blur-md p-3 shadow-xl">
        <p className="mb-2 text-sm font-medium text-white">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground capitalize">{entry.name}:</span>
              <span className="font-mono font-medium text-white">
                {Number(entry.value).toFixed(2)} kWh
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function LoadProfileChart({ data, className }: LoadProfileChartProps) {
  return (
    <div className={cn("h-[400px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            stroke="#ffffff40" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              try {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth()+1} ${date.getHours()}:00`
              } catch (e) { return value }
            }}
            minTickGap={50}
          />
          <YAxis 
            stroke="#ffffff40" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Predicted (Orange Dashed) */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Predicted"
            animationDuration={1500}
          />
          
          {/* Actual (Cyan Area) */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActual)"
            name="Actual"
            animationDuration={1500}
          />

          {/* Anomalies (Red Dots) */}
           <Scatter 
            name="Anomaly" 
            data={data.filter(d => d.anomaly)} 
            fill="#ef4444" 
            shape="circle"
            dataKey="actual"
          />
          
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

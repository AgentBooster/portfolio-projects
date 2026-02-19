"use client"

import { useState } from "react"
import { AuditPanel } from "@/components/dashboard/audit-panel"
import { FuturePlanner } from "@/components/dashboard/future-planner"
import { ConsultantPanel } from "@/components/dashboard/consultant-panel"
import { cn } from "@/lib/utils"
import { Activity, Radio, Bot } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"audit" | "forecast" | "consultant">("audit")

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                    SGEE Dashboard
                </h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                    Campus Energy Intelligence. Real-time auditing and future planning powered by <span className="text-cyan-400">GRU Deep Learning</span>.
                </p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-emerald-400">SYSTEM ONLINE</span>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-black/40 backdrop-blur-md rounded-lg w-fit border border-white/5 overflow-x-auto">
            <button
                onClick={() => setActiveTab("audit")}
                className={cn(
                    "px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                    activeTab === "audit" 
                        ? "bg-white/10 text-white shadow-lg border border-white/10" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
            >
                <Activity className="h-4 w-4" />
                Live Audit
            </button>
            <button
                onClick={() => setActiveTab("forecast")}
                className={cn(
                    "px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                    activeTab === "forecast" 
                        ? "bg-purple-500/20 text-purple-200 shadow-lg border border-purple-500/20" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
            >
                <Radio className="h-4 w-4" />
                Future Planner
            </button>
            <button
                onClick={() => setActiveTab("consultant")}
                className={cn(
                    "px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                    activeTab === "consultant" 
                        ? "bg-emerald-500/20 text-emerald-200 shadow-lg border border-emerald-500/20" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
            >
                <Bot className="h-4 w-4" />
                Virtual Consultant
            </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] animate-accordion-down">
            {activeTab === "audit" && <AuditPanel />}
            {activeTab === "forecast" && <FuturePlanner />}
            {activeTab === "consultant" && <ConsultantPanel />}
        </div>
      </div>
    </main>
  );
}

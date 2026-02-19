"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { GlassCard } from "@/components/ui/glass-card"
import { Bot, Send, User, Sparkles, Key, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Interfaces for API Responses
interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export function ConsultantPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I am your Green Metric Strategy Consultant. Run an analysis first, then ask me how to improve UCU's energy efficiency!" }
  ])
  const [input, setInput] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [provider, setProvider] = useState<"Gemini 2.0 Flash" | "OpenAI (GPT-4o)">("Gemini 2.0 Flash")
  const [context, setContext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
      const storedMessages = sessionStorage.getItem("consultant_messages")
      const storedKey = sessionStorage.getItem("consultant_api_key")
      const storedProvider = sessionStorage.getItem("consultant_provider")

      if (storedMessages) {
          try {
              const parsed = JSON.parse(storedMessages) as ChatMessage[]
              if (Array.isArray(parsed) && parsed.length > 0) {
                  setMessages(parsed)
              }
          } catch {
              // Ignore malformed storage
          }
      }
      if (storedKey) setApiKey(storedKey)
      if (storedProvider === "Gemini 2.0 Flash" || storedProvider === "OpenAI (GPT-4o)") {
          setProvider(storedProvider)
      }
      setHydrated(true)
  }, [])

  useEffect(() => {
      if (!hydrated) return
      sessionStorage.setItem("consultant_messages", JSON.stringify(messages))
  }, [messages, hydrated])

  useEffect(() => {
      if (!hydrated) return
      sessionStorage.setItem("consultant_api_key", apiKey)
  }, [apiKey, hydrated])

  useEffect(() => {
      if (!hydrated) return
      sessionStorage.setItem("consultant_provider", provider)
  }, [provider, hydrated])

  // Load context from Session Storage (populated by Audit/Forecast panels)
  useEffect(() => {
      const loadContext = () => {
          const audit = sessionStorage.getItem("audit_context")
          const forecast = sessionStorage.getItem("forecast_context")
          
          let combined = ""
          if (audit && forecast) {
              combined = `--- PART 1: HISTORICAL AUDIT (PAST) ---\n${audit}\n\n--- PART 2: FUTURE PLAN (NEXT 7 DAYS) ---\n${forecast}`
          } else if (audit) {
              combined = audit
          } else if (forecast) {
              combined = forecast
          } else {
              combined = sessionStorage.getItem("latest_context") || ""
          }

          if (combined && combined !== context) {
              setContext(combined)
          }
      }
      
      loadContext()
      const interval = setInterval(loadContext, 2000)
      return () => clearInterval(interval)
  }, [context])

  const handleSend = async () => {
      if (!input.trim()) return;
      if (!apiKey) {
          alert("Please enter a valid API Key first.")
          return;
      }
      if (!context) {
          alert("Please run an Audit or Forecast first to generate context for the agent.")
          return;
      }

      const userMsg = input
      setInput("")
      setIsLoading(true)
      
      // Add user message locally
      const newMessages = [...messages, { role: 'user', content: userMsg } as ChatMessage]
      setMessages(newMessages)
      sessionStorage.setItem("consultant_messages", JSON.stringify(newMessages))

      try {
          let reply = ""
          
          if (provider === "OpenAI (GPT-4o)") {
              // Direct Client-Side Call to OpenAI
              const systemPrompt = `You are an expert energy consultant. Use the following context to answer.\n\n${context}`
              
              const res = await fetch("https://api.openai.com/v1/chat/completions", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${apiKey}`
                  },
                  body: JSON.stringify({
                      model: "gpt-4o",
                      messages: [
                          { role: "system", content: systemPrompt },
                          ...newMessages.slice(1).map(m => ({ role: m.role, content: m.content })) // Skip initial greeting
                      ]
                  })
              })
              
              const data = await res.json()
              if (data.error) throw new Error(data.error.message)
              reply = data.choices[0].message.content

          } else {
              // Direct Client-Side Call to Google Gemini
              // Construct a single prompt since Gemini API (REST) is stateless-ish in one-shot mode or requires session handling
              // For simplicity, we append context + history to the prompt
              
              const historyText = newMessages.slice(1).map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")
              const prompt = `${context}\n\nExisting Conversation:\n${historyText}\n\nAssistant:`
              
              const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
              
              const res = await fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                      contents: [{ parts: [{ text: prompt }] }]
                  })
              })
              
              const data = await res.json()
              if (data.error) throw new Error(data.error.message)
              reply = data.candidates[0].content.parts[0].text
          }

          setMessages(prev => {
              const updated = [...prev, { role: 'assistant', content: reply }]
              sessionStorage.setItem("consultant_messages", JSON.stringify(updated))
              return updated
          })

      } catch (err) {
          setMessages(prev => {
              const updated = [...prev, { role: 'assistant', content: `Error: ${(err as Error).message}` }]
              sessionStorage.setItem("consultant_messages", JSON.stringify(updated))
              return updated
          })
      } finally {
          setIsLoading(false)
      }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Sidebar Config */}
        <GlassCard
            className="lg:col-span-1 h-full"
            contentClassName="h-full flex flex-col min-h-0 p-4 space-y-4"
        >
            <div className="flex items-center gap-2 text-white font-semibold border-b border-white/10 pb-2">
                <Bot className="h-5 w-5 text-emerald-400" />
                <span>Consultant Config</span>
            </div>
            
            <div className="space-y-2">
                <label className="text-xs text-muted-foreground">AI Provider</label>
                <select
                    value={provider}
                    onChange={(e) => {
                        const nextProvider = e.target.value as "Gemini 2.0 Flash" | "OpenAI (GPT-4o)"
                        setProvider(nextProvider)
                        sessionStorage.setItem("consultant_provider", nextProvider)
                    }}
                    className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500"
                >
                    <option>Gemini 2.0 Flash</option>
                    <option>OpenAI (GPT-4o)</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Key className="h-3 w-3" /> API Key
                </label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => {
                        const nextKey = e.target.value
                        setApiKey(nextKey)
                        sessionStorage.setItem("consultant_api_key", nextKey)
                    }}
                    placeholder={provider.includes("Gemini") ? "AIzaSy..." : "sk-..."}
                    className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:ring-emerald-500"
                />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col pt-4 border-t border-white/10 min-h-0">
                <label className="text-xs text-muted-foreground mb-1">Active Context (From Analysis)</label>
                <div className="flex-1 min-h-0 bg-black/40 rounded-md p-2 text-[10px] whitespace-pre-wrap font-mono text-emerald-400/80 overflow-y-auto border border-white/5 scrollbar-thin">
                    {context || "No context loaded. Run an analysis in 'Live Audit' or 'Future Planner'."}
                </div>
            </div>
        </GlassCard>

        {/* Chat Area */}
        <GlassCard
            className="lg:col-span-3 relative overflow-hidden min-h-0"
            contentClassName="h-full flex flex-col min-h-0 p-6"
        >
             
             {/* Header actions */}
             <div className="absolute top-4 right-4 z-10">
                 <button
                     onClick={() => {
                         const cleared = [{ role: 'assistant', content: "Context cleared. Hello!" }] as ChatMessage[]
                         setMessages(cleared)
                         sessionStorage.setItem("consultant_messages", JSON.stringify(cleared))
                     }}
                     className="text-white/40 hover:text-white transition-colors"
                 >
                     <Trash2 className="h-4 w-4" />
                 </button>
             </div>

             {/* Messages */}
             <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-3", m.role === 'user' ? "justify-end" : "justify-start")}>
                        {m.role === 'assistant' && (
                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
                                <Sparkles className="h-4 w-4 text-emerald-400" />
                            </div>
                        )}
                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                            m.role === 'user' 
                                ? "bg-white/10 text-white rounded-br-none" 
                                : "bg-emerald-900/20 border border-emerald-500/10 text-emerald-100 rounded-bl-none shadow-lg backdrop-blur-sm"
                        )}>
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc ml-5 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal ml-5 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li>{children}</li>,
                                }}
                            >
                                {m.content}
                            </ReactMarkdown>
                        </div>
                        {m.role === 'user' && (
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                         <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
                                <Sparkles className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="bg-emerald-900/10 border border-emerald-500/5 text-emerald-200/50 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
                            Thinking...
                        </div>
                    </div>
                )}
             </div>

             {/* Input */}
             <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
                <div className="flex gap-2">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for green strategies or anomaly explanations..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input}
                        className="h-11 w-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-emerald-600 shadow-lg shadow-emerald-900/20"
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </button>
                </div>
             </div>
        </GlassCard>
    </div>
  )
}

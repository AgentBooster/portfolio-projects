import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  gradient?: boolean
  contentClassName?: string
}

export function GlassCard({ className, children, gradient = false, contentClassName, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/5",
        gradient && "bg-gradient-to-br from-white/5 to-transparent",
        className
      )}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100" />
      )}
      <div className={cn("relative z-10 p-6", contentClassName)}>
        {children}
      </div>
    </div>
  )
}

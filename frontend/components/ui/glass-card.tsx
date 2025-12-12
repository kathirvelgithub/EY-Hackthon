import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: "blue" | "lime" | "none"
}

export function GlassCard({ children, className, glow = "none" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6 transition-all duration-300 hover:border-primary/30",
        glow === "blue" && "glow-blue",
        glow === "lime" && "glow-lime",
        className,
      )}
    >
      {children}
    </div>
  )
}

"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface GaugeDisplayProps {
  value: number
  min: number
  max: number
  label: string
  unit: string
  warningThreshold?: number
  dangerThreshold?: number
}

export function GaugeDisplay({ value, min, max, label, unit, warningThreshold, dangerThreshold }: GaugeDisplayProps) {
  const percentage = ((value - min) / (max - min)) * 100

  const getColor = () => {
    if (dangerThreshold && value >= dangerThreshold) return "text-destructive"
    if (warningThreshold && value >= warningThreshold) return "text-warning"
    return "text-neon-lime"
  }

  const getBarColor = () => {
    if (dangerThreshold && value >= dangerThreshold) return "bg-destructive"
    if (warningThreshold && value >= warningThreshold) return "bg-warning"
    return "bg-neon-lime"
  }

  return (
    <GlassCard className="text-center">
      <h4 className="text-sm text-muted-foreground mb-2">{label}</h4>
      <div className={cn("text-3xl font-bold mb-3", getColor())}>
        {value.toFixed(1)}
        <span className="text-lg ml-1">{unit}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", getBarColor())}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </GlassCard>
  )
}

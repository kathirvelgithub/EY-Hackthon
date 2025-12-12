"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface WorkforceGuidanceProps {
  currentStaff: number
  recommendedStaff: number
  peakHours: string
}

export function WorkforceGuidance({ currentStaff, recommendedStaff, peakHours }: WorkforceGuidanceProps) {
  const difference = recommendedStaff - currentStaff

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Workforce Guidance</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 rounded-lg bg-secondary/50">
          <div className="text-3xl font-bold text-foreground">{currentStaff}</div>
          <div className="text-sm text-muted-foreground">Current Staff</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-primary/10">
          <div className="text-3xl font-bold text-primary">{recommendedStaff}</div>
          <div className="text-sm text-muted-foreground">Recommended</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-secondary/50">
          <div
            className={cn(
              "text-3xl font-bold flex items-center justify-center gap-1",
              difference > 0 ? "text-warning" : difference < 0 ? "text-success" : "text-foreground",
            )}
          >
            {difference > 0 ? (
              <TrendingUp className="w-6 h-6" />
            ) : difference < 0 ? (
              <TrendingDown className="w-6 h-6" />
            ) : (
              <Minus className="w-6 h-6" />
            )}
            {Math.abs(difference)}
          </div>
          <div className="text-sm text-muted-foreground">Adjustment</div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
        <p className="text-sm text-warning">
          <strong>Peak Hours:</strong> {peakHours}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Consider scheduling additional technicians during these hours
        </p>
      </div>
    </GlassCard>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

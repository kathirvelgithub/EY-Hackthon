"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface HeatmapProps {
  data: { day: string; morning: number; afternoon: number; evening: number }[]
}

export function Heatmap({ data }: HeatmapProps) {
  const getHeatColor = (value: number) => {
    if (value >= 90) return "bg-destructive"
    if (value >= 75) return "bg-warning"
    if (value >= 50) return "bg-primary"
    return "bg-success"
  }

  const periods = ["Morning", "Afternoon", "Evening"]

  return (
    <GlassCard>
      <h3 className="font-semibold text-foreground mb-6">Weekly Demand Heatmap</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-sm text-muted-foreground pb-3">Period</th>
              {data.map((d) => (
                <th key={d.day} className="text-center text-sm text-muted-foreground pb-3 px-2">
                  {d.day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period}>
                <td className="text-sm text-foreground py-2 pr-4">{period}</td>
                {data.map((d) => {
                  const key = period.toLowerCase() as "morning" | "afternoon" | "evening"
                  const value = d[key]
                  return (
                    <td key={d.day} className="p-1">
                      <div
                        className={cn(
                          "w-full h-12 rounded-lg flex items-center justify-center text-sm font-medium",
                          getHeatColor(value),
                          value >= 75 ? "text-foreground" : "text-foreground",
                        )}
                      >
                        {value}%
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success" />
          <span className="text-xs text-muted-foreground">Low (&lt;50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-xs text-muted-foreground">Medium (50-75%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning" />
          <span className="text-xs text-muted-foreground">High (75-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive" />
          <span className="text-xs text-muted-foreground">Critical (&gt;90%)</span>
        </div>
      </div>
    </GlassCard>
  )
}

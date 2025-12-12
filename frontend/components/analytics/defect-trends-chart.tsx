"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DefectTrendsChartProps {
  data: { month: string; brakes: number; electrical: number; engine: number; suspension: number }[]
}

export function DefectTrendsChart({ data }: DefectTrendsChartProps) {
  return (
    <GlassCard>
      <h3 className="font-semibold text-foreground mb-6">Defect Recurrence Trends</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={{ stroke: "var(--border)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
            />
            <Legend />
            <Bar dataKey="brakes" fill="var(--chart-1)" name="Brakes" radius={[4, 4, 0, 0]} />
            <Bar dataKey="electrical" fill="var(--chart-2)" name="Electrical" radius={[4, 4, 0, 0]} />
            <Bar dataKey="engine" fill="var(--chart-3)" name="Engine" radius={[4, 4, 0, 0]} />
            <Bar dataKey="suspension" fill="var(--chart-4)" name="Suspension" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}

"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Car, Wrench, Calendar, AlertTriangle } from "lucide-react"

interface QuickStatsProps {
  stats: {
    totalVehicles: number
    activeAlerts: number
    scheduledServices: number
    completedThisMonth: number
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  const items = [
    { label: "Total Vehicles", value: stats.totalVehicles, icon: Car, color: "text-primary" },
    { label: "Active Alerts", value: stats.activeAlerts, icon: AlertTriangle, color: "text-warning" },
    { label: "Scheduled Services", value: stats.scheduledServices, icon: Calendar, color: "text-neon-lime" },
    { label: "Completed This Month", value: stats.completedThisMonth, icon: Wrench, color: "text-success" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <GlassCard key={item.label} className="text-center">
          <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
          <div className="text-3xl font-bold text-foreground mb-1">{item.value}</div>
          <div className="text-sm text-muted-foreground">{item.label}</div>
        </GlassCard>
      ))}
    </div>
  )
}

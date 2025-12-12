"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { HealthScore } from "@/components/ui/health-score"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Vehicle } from "@/lib/types"
import { Calendar, Gauge } from "lucide-react"

interface VehicleSummaryCardProps {
  vehicle: Vehicle
}

export function VehicleSummaryCard({ vehicle }: VehicleSummaryCardProps) {
  return (
    <GlassCard className="hover:glow-blue transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              {vehicle.make} {vehicle.model}
            </h3>
            <StatusBadge
              status={vehicle.healthScore >= 80 ? "Good" : vehicle.healthScore >= 60 ? "Fair" : "Needs Attention"}
              variant={vehicle.healthScore >= 80 ? "success" : vehicle.healthScore >= 60 ? "warning" : "danger"}
            />
          </div>
          <p className="text-sm text-muted-foreground mb-4">{vehicle.licensePlate}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="w-4 h-4" />
              <span>VIN: {vehicle.vin}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Next Service: {new Date(vehicle.nextServiceDue).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <HealthScore score={vehicle.healthScore} size="md" />
      </div>
    </GlassCard>
  )
}

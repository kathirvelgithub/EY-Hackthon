"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { ServiceAppointment } from "@/lib/types"
import { Calendar, Clock, MapPin, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppointmentsListProps {
  appointments: ServiceAppointment[]
}

const statusVariants: Record<ServiceAppointment["status"], "default" | "success" | "warning" | "danger" | "info"> = {
  scheduled: "info",
  confirmed: "success",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {new Date(apt.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-muted-foreground">at</span>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{apt.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{apt.serviceCenter}</span>
                </div>
              </div>
              <StatusBadge status={apt.status.replace("_", " ")} variant={statusVariants[apt.status]} />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {apt.services.map((service) => (
                <span key={service} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
                  {service}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Est. Duration: {apt.estimatedDuration} mins</span>
              <Button variant="ghost" size="sm" className="gap-2">
                <QrCode className="w-4 h-4" />
                Show QR Code
              </Button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import type { ServiceCenter } from "@/lib/types"
import { Calendar, Clock, MapPin, CheckCircle, X } from "lucide-react"
import QRCodeSVG from "react-qr-code"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  time: string
  center: ServiceCenter
}

export function ConfirmationModal({ isOpen, onClose, date, time, center }: ConfirmationModalProps) {
  if (!isOpen) return null

  const confirmationCode = `APT-${Date.now().toString(36).toUpperCase()}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            <h3 className="text-lg font-semibold text-foreground">Appointment Confirmed!</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">
                {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium text-foreground">{time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Service Center</p>
              <p className="font-medium text-foreground">{center.name}</p>
              <p className="text-sm text-muted-foreground">{center.address}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center p-6 rounded-lg bg-secondary/50 mb-6">
          <p className="text-sm text-muted-foreground mb-3">Scan at Service Center</p>
          <div className="p-4 bg-white rounded-lg">
            <QRCodeSVG value={confirmationCode} size={120} />
          </div>
          <p className="mt-3 font-mono text-sm text-foreground">{confirmationCode}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1">Add to Calendar</Button>
        </div>
      </GlassCard>
    </div>
  )
}

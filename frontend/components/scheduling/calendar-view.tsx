"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, MapPin, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceCenter } from "@/lib/types"

interface CalendarViewProps {
  serviceCenters: ServiceCenter[]
  onSlotSelect: (date: Date, time: string, center: ServiceCenter) => void
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export function CalendarView({ serviceCenters, onSlotSelect }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedCenter, setSelectedCenter] = useState<ServiceCenter | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: (Date | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const aiRecommendedSlots = ["10:00", "14:30"]

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Select Date</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-foreground min-w-32 text-center">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) return <div key={index} />

            const isToday = day.getTime() === today.getTime()
            const isPast = day < today
            const isSelected = selectedDate?.getTime() === day.getTime()

            return (
              <button
                key={index}
                disabled={isPast}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg text-sm transition-all",
                  isPast && "text-muted-foreground/50 cursor-not-allowed",
                  isToday && !isSelected && "border border-primary text-primary",
                  isSelected && "bg-primary text-primary-foreground",
                  !isPast && !isSelected && "hover:bg-secondary",
                )}
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>

        {selectedDate && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground">Available Time Slots</h4>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => {
                const isAIRecommended = aiRecommendedSlots.includes(time)
                const isSelected = selectedTime === time

                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "relative px-3 py-2 rounded-lg text-sm transition-all border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary/50",
                      isAIRecommended && !isSelected && "border-neon-lime/50 bg-neon-lime/10",
                    )}
                  >
                    {time}
                    {isAIRecommended && <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-neon-lime" />}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-neon-lime" />
              AI-recommended slots based on center load forecast
            </p>
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Select Service Center</h3>
        </div>

        <div className="space-y-3">
          {serviceCenters.map((center) => {
            const loadPercentage = (center.currentLoad / center.capacity) * 100
            const isSelected = selectedCenter?.id === center.id

            return (
              <button
                key={center.id}
                onClick={() => setSelectedCenter(center)}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{center.name}</h4>
                    <p className="text-sm text-muted-foreground">{center.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">⭐ {center.rating}</div>
                    <div className="text-xs text-muted-foreground">{center.availableSlots} slots available</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Current Load</span>
                    <span>
                      {center.currentLoad}/{center.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        loadPercentage > 80 ? "bg-destructive" : loadPercentage > 60 ? "bg-warning" : "bg-success",
                      )}
                      style={{ width: `${loadPercentage}%` }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {selectedDate && selectedTime && selectedCenter && (
          <div className="mt-6 pt-6 border-t border-border">
            <Button className="w-full gap-2" onClick={() => onSlotSelect(selectedDate, selectedTime, selectedCenter)}>
              Confirm Appointment
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

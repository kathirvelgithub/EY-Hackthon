"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CalendarView } from "@/components/scheduling/calendar-view"
import { ConfirmationModal } from "@/components/scheduling/confirmation-modal"
import { useAppointmentBooking } from "@/hooks/use-appointments"
import { schedulerService } from "@/lib/services"
import type { UserRole, ServiceCenter } from "@/lib/types"

export default function SchedulingPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date
    time: string
    center: ServiceCenter
  } | null>(null)
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([])
  const [centersLoading, setCentersLoading] = useState(true)
  const { bookAppointment, loading: bookingLoading } = useAppointmentBooking()

  useEffect(() => {
    // Fetch service centers from backend
    schedulerService.getServiceCenters().then((centers) => {
      setServiceCenters(centers)
      setCentersLoading(false)
    }).catch((error) => {
      console.error('Failed to fetch service centers:', error)
      setCentersLoading(false)
    })
  }, [])

  useEffect(() => {
    const role = sessionStorage.getItem("userRole") as UserRole
    const name = sessionStorage.getItem("userName")

    if (!role) {
      router.push("/")
      return
    }

    setUserRole(role)
    setUserName(name || "User")
    setMounted(true)
  }, [router])

  const handleSlotSelect = (date: Date, time: string, center: ServiceCenter) => {
    setSelectedSlot({ date, time, center })
    setShowConfirmation(true)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />

      <main className="ml-64 transition-all duration-300">
        <Header title="Service Scheduling" subtitle="AI-recommended appointment slots based on center availability" />

        <div className="p-6">
          {centersLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading service centers...</div>
          ) : (
            <CalendarView serviceCenters={serviceCenters} onSlotSelect={handleSlotSelect} />
          )}
        </div>
      </main>

      {selectedSlot && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          date={selectedSlot.date}
          time={selectedSlot.time}
          center={selectedSlot.center}
        />
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { VehicleSummaryCard } from "@/components/dashboard/vehicle-summary-card"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { AppointmentsList } from "@/components/dashboard/appointments-list"
import { UEBADashboard } from "@/components/ueba/ueba-dashboard"
import { useTelemetry, useMaintenance, useDTCCodes } from "@/hooks/use-vehicle-data"
import { useUEBA } from "@/hooks/use-ueba"
import { schedulerService, telemetryService } from "@/lib/services"
import type { UserRole, Vehicle, ServiceAppointment } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [appointments, setAppointments] = useState<ServiceAppointment[]>([])
  const [vehiclesLoading, setVehiclesLoading] = useState(true)

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
    
    // Fetch vehicles and appointments from backend
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setVehiclesLoading(true)
      const [vehiclesData, appointmentsData] = await Promise.all([
        telemetryService.getAllTelemetrics(),
        schedulerService.getAppointments()
      ])
      
      // Transform telemetry data to vehicle format
      const vehicleList: Vehicle[] = Array.isArray(vehiclesData) ? vehiclesData.map((v: any, index: number) => ({
        id: v.vehicle_id || `v${index + 1}`,
        vin: v.vehicle_name || `VIN${index + 1}`,
        make: v.vehicle_name?.split(' ')[0] || 'Unknown',
        model: v.vehicle_name?.split(' ').slice(1).join(' ') || 'Model',
        year: 2024,
        licensePlate: v.vehicle_id || `LP-${index + 1}`,
        healthScore: calculateHealthScore(v),
        lastService: '2024-10-15',
        nextServiceDue: '2025-01-15',
      })) : []
      
      setVehicles(vehicleList)
      setAppointments(appointmentsData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setVehiclesLoading(false)
    }
  }

  const calculateHealthScore = (telemetry: any) => {
    let score = 100
    if (telemetry.brake_wear > 50) score -= 15
    if (telemetry.engine_temp > 100) score -= 20
    if (telemetry.battery_voltage < 12) score -= 10
    return Math.max(0, score)
  }

  // Fetch real-time data for first vehicle
  const vehicle = vehicles[0]
  const { predictedIssues } = useMaintenance(vehicle?.id || 'VEH_001')
  const { codes: dtcCodes } = useDTCCodes(vehicle?.id || 'VEH_001')
  const { alerts: uebaAlerts } = useUEBA(userRole === 'ai_ops_admin' ? 10000 : undefined)

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = {
    totalVehicles: vehicles.length,
    activeAlerts: predictedIssues.length + dtcCodes.length,
    scheduledServices: appointments.filter((a) => a.status === "scheduled" || a.status === "confirmed").length,
    completedThisMonth: 12,
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />

      <main className="ml-64 transition-all duration-300">
        <Header title="Dashboard" subtitle={`Welcome back, ${userName}`} />

        <div className="p-6 space-y-6">
          <QuickStats stats={stats} />

          {userRole === "ai_ops_admin" ? (
            <UEBADashboard alerts={uebaAlerts} />
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {vehiclesLoading ? (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">Loading vehicles...</div>
                  ) : vehicles.length > 0 ? (
                    vehicles.map((v) => (
                      <VehicleSummaryCard key={v.id} vehicle={v} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">No vehicles found</div>
                  )}
                </div>
                <AppointmentsList appointments={appointments} />
              </div>

              <div className="space-y-4">
                <AlertsPanel predictedIssues={predictedIssues} dtcCodes={dtcCodes} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

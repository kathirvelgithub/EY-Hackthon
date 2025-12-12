"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { TelemetryChart } from "@/components/telemetry/telemetry-chart"
import { GaugeDisplay } from "@/components/telemetry/gauge-display"
import { DTCPanel } from "@/components/telemetry/dtc-panel"
import { HealthScore } from "@/components/ui/health-score"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useTelemetry, useDTCCodes } from "@/hooks/use-vehicle-data"
import type { UserRole, Vehicle } from "@/lib/types"
import { Mic, RefreshCw } from "lucide-react"

export default function TelemetryPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)
  const [vehicle, setVehicle] = useState<Vehicle>({
    id: 'VEH_001',
    vin: 'VEHICLE001',
    make: 'Maruti',
    model: 'Swift 2022',
    year: 2022,
    licensePlate: 'MH-01-AB-1234',
    healthScore: 85,
    lastService: '2024-10-15',
    nextServiceDue: '2025-01-15',
  })

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
  const { data: latestTelemetry, history: telemetryHistory, refetch } = useTelemetry(
    vehicle?.id || 'VEH_001',
    5000 // Refresh every 5 seconds
  )
  const { codes: dtcCodes, refetch: refetchDTC } = useDTCCodes(vehicle?.id || 'VEH_001')

  if (!mounted || !latestTelemetry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleRefresh = () => {
    refetch()
    refetchDTC()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />

      <main className="ml-64 transition-all duration-300">
        <Header title="Vehicle Telemetry" subtitle={`${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`} />

        <div className="p-6 space-y-6">
          {/* Health Overview */}
          <div className="grid lg:grid-cols-4 gap-6">
            <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center">
              <HealthScore score={vehicle.healthScore} size="lg" />
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2">
                  <Mic className="w-4 h-4" />
                  Voice
                </Button>
              </div>
            </GlassCard>

            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <GaugeDisplay
                value={latestTelemetry.engineTemp}
                min={60}
                max={120}
                label="Engine Temp"
                unit="°C"
                warningThreshold={95}
                dangerThreshold={105}
              />
              <GaugeDisplay
                value={latestTelemetry.batteryVoltage}
                min={10}
                max={15}
                label="Battery"
                unit="V"
                warningThreshold={11.5}
                dangerThreshold={11}
              />
              <GaugeDisplay
                value={latestTelemetry.brakeWear}
                min={0}
                max={100}
                label="Brake Wear"
                unit="%"
                warningThreshold={40}
                dangerThreshold={25}
              />
              <GaugeDisplay
                value={latestTelemetry.fuelLevel}
                min={0}
                max={100}
                label="Fuel Level"
                unit="%"
                warningThreshold={25}
                dangerThreshold={10}
              />
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <TelemetryChart
              data={telemetryHistory}
              metric="engineTemp"
              title="Engine Temperature"
              unit="°C"
              color="var(--chart-1)"
            />
            <TelemetryChart
              data={telemetryHistory}
              metric="batteryVoltage"
              title="Battery Voltage"
              unit="V"
              color="var(--chart-2)"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <TelemetryChart
              data={telemetryHistory}
              metric="oilPressure"
              title="Oil Pressure"
              unit="PSI"
              color="var(--chart-3)"
            />
            <TelemetryChart
              data={telemetryHistory}
              metric="coolantTemp"
              title="Coolant Temperature"
              unit="°C"
              color="var(--chart-4)"
            />
          </div>

          {/* DTC Codes */}
          <DTCPanel codes={dtcCodes} />
        </div>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Heatmap } from "@/components/workload/heatmap"
import { WorkforceGuidance } from "@/components/workload/workforce-guidance"
import { GlassCard } from "@/components/ui/glass-card"
import { schedulerService } from "@/lib/services"
import type { UserRole } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function WorkloadPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)
  const [serviceCenters, setServiceCenters] = useState<any[]>([])
  const [workloadData, setWorkloadData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    
    // Fetch service centers from backend
    schedulerService.getServiceCenters().then((centers) => {
      setServiceCenters(centers)
      // TODO: Fetch workload data from backend
      setLoading(false)
    }).catch((error) => {
      console.error('Failed to fetch workload data:', error)
      setLoading(false)
    })
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const peakHourData = [
    { hour: "9AM", vehicles: 12 },
    { hour: "10AM", vehicles: 18 },
    { hour: "11AM", vehicles: 22 },
    { hour: "12PM", vehicles: 15 },
    { hour: "1PM", vehicles: 8 },
    { hour: "2PM", vehicles: 20 },
    { hour: "3PM", vehicles: 25 },
    { hour: "4PM", vehicles: 19 },
    { hour: "5PM", vehicles: 14 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />

      <main className="ml-64 transition-all duration-300">
        <Header title="Service Center Workload Forecast" subtitle="Demand prediction and workforce planning" />

        <div className="p-6 space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Heatmap data={mockWorkloadData} />
            </div>
            <WorkforceGuidance
              currentStaff={8}
              recommendedStaff={12}
              peakHours="10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM"
            />
          </div>

          <GlassCard>
            <h3 className="font-semibold text-foreground mb-6">Peak Hour Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHourData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="vehicles" fill="var(--primary)" name="Vehicles" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading service centers...</div>
            ) : serviceCenters.length > 0 ? (
              serviceCenters.map((center) => (
              <GlassCard key={center.id}>
                <h4 className="font-medium text-foreground mb-2">{center.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{center.address}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="text-foreground">
                      {center.currentLoad}/{center.capacity}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(center.currentLoad / center.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            )))
            ) : (
              <div className="col-span-2 text-center py-12 text-muted-foreground">No service centers available</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

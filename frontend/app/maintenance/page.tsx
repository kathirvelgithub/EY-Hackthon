"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { IssueCard } from "@/components/maintenance/issue-card"
import { IssueTimeline } from "@/components/maintenance/issue-timeline"
import { useMaintenance } from "@/hooks/use-vehicle-data"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import type { UserRole } from "@/lib/types"
import { Calendar, Wrench, AlertCircle } from "lucide-react"

export default function MaintenancePage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)
  const [vehicleId] = useState('VEH_001')

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
  
  const { predictedIssues, history, loading } = useMaintenance(vehicleId)

  if (!mounted || loading) {
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
        <Header title="Predictive Maintenance" subtitle="AI-powered failure predictions and recommendations" />

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {predictedIssues.length > 0 ? (
                predictedIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))
              ) : (
                <GlassCard className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Predicted Issues</h3>
                  <p className="text-sm text-muted-foreground">Your vehicle is in good condition. No maintenance issues predicted at this time.</p>
                </GlassCard>
              )}

              {/* Maintenance History */}
              {history.length > 0 && (
                <GlassCard>
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Maintenance History</h3>
                  </div>
                  <div className="space-y-3">
                    {history.map((record: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <Calendar className="w-4 h-4 text-primary mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{record.component}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.service_date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{record.issue}</p>
                          <p className="text-xs text-success mt-1">Action: {record.action_taken}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            <div>
              <IssueTimeline issues={predictedIssues} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

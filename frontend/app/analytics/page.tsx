"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DefectTrendsChart } from "@/components/analytics/defect-trends-chart"
import { CAPATable } from "@/components/analytics/capa-table"
import { GlassCard } from "@/components/ui/glass-card"
import type { UserRole, CAPARecommendation, DefectTrend } from "@/lib/types"
import { FileWarning, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)
  const [capaRecommendations, setCapaRecommendations] = useState<CAPARecommendation[]>([])
  const [defectTrends, setDefectTrends] = useState<DefectTrend[]>([])
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
    
    // TODO: Fetch analytics data from backend
    // For now, show empty state
    setLoading(false)
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const capaStats = {
    open: capaRecommendations.filter((c) => c.status === "open").length,
    inProgress: capaRecommendations.filter((c) => c.status === "in_progress").length,
    closed: capaRecommendations.filter((c) => c.status === "closed").length,
    critical: capaRecommendations.filter((c) => c.priority === "critical").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />

      <main className="ml-64 transition-all duration-300">
        <Header title="RCA/CAPA Analytics" subtitle="Root cause analysis and corrective action tracking" />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="text-center">
              <FileWarning className="w-8 h-8 mx-auto mb-2 text-warning" />
              <div className="text-3xl font-bold text-foreground">{capaStats.open}</div>
              <div className="text-sm text-muted-foreground">Open Issues</div>
            </GlassCard>
            <GlassCard className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{capaStats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </GlassCard>
            <GlassCard className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
              <div className="text-3xl font-bold text-foreground">{capaStats.closed}</div>
              <div className="text-sm text-muted-foreground">Closed</div>
            </GlassCard>
            <GlassCard className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <div className="text-3xl font-bold text-destructive">{capaStats.critical}</div>
              <div className="text-sm text-muted-foreground">Critical Priority</div>
            </GlassCard>
          </div>

          {/* Defect Trends */}
          {loading ? (
            <GlassCard className="text-center py-12 text-muted-foreground">Loading analytics data...</GlassCard>
          ) : defectTrends.length > 0 ? (
            <DefectTrendsChart data={defectTrends} />
          ) : (
            <GlassCard className="text-center py-12 text-muted-foreground">No defect trends data available</GlassCard>
          )}

          {/* CAPA Table */}
          {!loading && capaRecommendations.length > 0 ? (
            <CAPATable recommendations={capaRecommendations} />
          ) : !loading ? (
            <GlassCard className="text-center py-12 text-muted-foreground">No CAPA recommendations available</GlassCard>
          ) : null}
        </div>
      </main>
    </div>
  )
}

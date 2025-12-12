"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { UEBAAlert } from "@/lib/types"
import { Shield, AlertTriangle, Clock, Activity, Eye, XCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UEBADashboardProps {
  alerts: UEBAAlert[]
}

export function UEBADashboard({ alerts }: UEBADashboardProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-destructive bg-destructive/20"
    if (score >= 60) return "text-warning bg-warning/20"
    if (score >= 40) return "text-primary bg-primary/20"
    return "text-success bg-success/20"
  }

  const getStatusIcon = (status: UEBAAlert["status"]) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case "reviewed":
        return <Eye className="w-4 h-4 text-primary" />
      case "dismissed":
        return <XCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const pendingCount = alerts.filter((a) => a.status === "pending").length
  const highRiskCount = alerts.filter((a) => a.riskScore >= 70).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="text-center">
          <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
          <div className="text-3xl font-bold text-foreground">{alerts.length}</div>
          <div className="text-sm text-muted-foreground">Total Alerts</div>
        </GlassCard>
        <GlassCard className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-warning" />
          <div className="text-3xl font-bold text-warning">{pendingCount}</div>
          <div className="text-sm text-muted-foreground">Pending Review</div>
        </GlassCard>
        <GlassCard className="text-center">
          <Activity className="w-8 h-8 mx-auto mb-2 text-destructive" />
          <div className="text-3xl font-bold text-destructive">{highRiskCount}</div>
          <div className="text-sm text-muted-foreground">High Risk</div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Agent Activity Logs</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export Logs
            </Button>
            <Button size="sm">Review All</Button>
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <code className="px-2 py-1 rounded bg-primary/20 text-primary font-mono text-xs">
                      {alert.agentId}
                    </code>
                    <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getRiskColor(alert.riskScore))}>
                      Risk: {alert.riskScore}
                    </span>
                    {getStatusIcon(alert.status)}
                  </div>

                  <p className="text-sm text-foreground mb-2">{alert.action}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <StatusBadge status={alert.anomalyType} variant="info" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

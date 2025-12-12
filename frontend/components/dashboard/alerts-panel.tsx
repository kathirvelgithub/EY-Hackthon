"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { PredictedIssue, DTCCode } from "@/lib/types"
import { AlertTriangle, Clock, Wrench } from "lucide-react"

interface AlertsPanelProps {
  predictedIssues: PredictedIssue[]
  dtcCodes: DTCCode[]
}

export function AlertsPanel({ predictedIssues, dtcCodes }: AlertsPanelProps) {
  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-semibold text-foreground">Predicted Issues</h3>
          <span className="ml-auto text-sm text-muted-foreground">{predictedIssues.length} active</span>
        </div>

        <div className="space-y-3">
          {predictedIssues.slice(0, 3).map((issue) => (
            <div key={issue.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
              <Wrench className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{issue.component}</span>
                  <StatusBadge
                    status={`${issue.confidence}% confidence`}
                    variant={issue.confidence >= 80 ? "danger" : "warning"}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{issue.issue}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Expected: {new Date(issue.predictedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <h3 className="font-semibold text-foreground">Active DTC Codes</h3>
          <span className="ml-auto text-sm text-muted-foreground">{dtcCodes.length} codes</span>
        </div>

        <div className="space-y-2">
          {dtcCodes.map((dtc) => (
            <div key={dtc.code} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <code className="text-sm font-mono text-primary">{dtc.code}</code>
                <span className="text-sm text-foreground">{dtc.description}</span>
              </div>
              <StatusBadge
                status={dtc.severity}
                variant={dtc.severity === "critical" ? "danger" : dtc.severity === "high" ? "warning" : "info"}
              />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

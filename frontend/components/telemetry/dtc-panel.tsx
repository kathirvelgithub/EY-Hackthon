"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { DTCCode } from "@/lib/types"
import { AlertCircle, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DTCPanelProps {
  codes: DTCCode[]
}

const severityVariants: Record<DTCCode["severity"], "default" | "success" | "warning" | "danger" | "info"> = {
  low: "info",
  medium: "warning",
  high: "danger",
  critical: "danger",
}

export function DTCPanel({ codes }: DTCPanelProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-foreground">Diagnostic Trouble Codes</h3>
        </div>
        <span className="text-sm text-muted-foreground">{codes.length} active codes</span>
      </div>

      <div className="space-y-3">
        {codes.map((dtc) => (
          <div
            key={dtc.code}
            className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <code className="px-2 py-1 rounded bg-primary/20 text-primary font-mono text-sm">{dtc.code}</code>
                  <StatusBadge status={dtc.severity} variant={severityVariants[dtc.severity]} />
                </div>
                <p className="text-sm text-foreground">{dtc.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Detected: {new Date(dtc.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <ExternalLink className="w-4 h-4" />
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

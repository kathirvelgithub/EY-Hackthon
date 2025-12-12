"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { PredictedIssue } from "@/lib/types"
import { AlertTriangle, Calendar, IndianRupee, Download, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

interface IssueCardProps {
  issue: PredictedIssue
}

export function IssueCard({ issue }: IssueCardProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "danger"
    if (confidence >= 70) return "warning"
    return "info"
  }

  return (
    <GlassCard className="hover:glow-blue transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{issue.component}</h4>
            <p className="text-sm text-muted-foreground">{issue.issue}</p>
          </div>
        </div>
        <StatusBadge
          status={`${issue.confidence}% Confidence`}
          variant={getConfidenceColor(issue.confidence) as "danger" | "warning" | "info"}
        />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Root Cause</p>
            <p className="text-sm text-foreground">{issue.rootCause}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-primary mb-1">Recommended Action</p>
          <p className="text-sm text-foreground">{issue.recommendedAction}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(issue.predictedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4" />
            <span>{issue.estimatedCost.toLocaleString()}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          PDF
        </Button>
      </div>
    </GlassCard>
  )
}

"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { CAPARecommendation } from "@/lib/types"
import { FileText, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CAPATableProps {
  recommendations: CAPARecommendation[]
}

const statusVariants: Record<CAPARecommendation["status"], "default" | "success" | "warning" | "danger" | "info"> = {
  open: "warning",
  in_progress: "info",
  closed: "success",
}

const priorityVariants: Record<CAPARecommendation["priority"], "default" | "success" | "warning" | "danger" | "info"> =
  {
    low: "default",
    medium: "info",
    high: "warning",
    critical: "danger",
  }

export function CAPATable({ recommendations }: CAPATableProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">CAPA Recommendations</h3>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Send className="w-4 h-4" />
          Submit Feedback
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-sm text-muted-foreground py-3 px-2">Defect Type</th>
              <th className="text-left text-sm text-muted-foreground py-3 px-2">Root Cause</th>
              <th className="text-left text-sm text-muted-foreground py-3 px-2">Corrective Action</th>
              <th className="text-left text-sm text-muted-foreground py-3 px-2">Priority</th>
              <th className="text-left text-sm text-muted-foreground py-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <tr key={rec.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="py-3 px-2">
                  <span className="font-medium text-foreground">{rec.defectType}</span>
                </td>
                <td className="py-3 px-2 text-sm text-muted-foreground max-w-xs truncate">{rec.rootCause}</td>
                <td className="py-3 px-2 text-sm text-muted-foreground max-w-xs truncate">{rec.correctiveAction}</td>
                <td className="py-3 px-2">
                  <StatusBadge status={rec.priority} variant={priorityVariants[rec.priority]} />
                </td>
                <td className="py-3 px-2">
                  <StatusBadge status={rec.status.replace("_", " ")} variant={statusVariants[rec.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}

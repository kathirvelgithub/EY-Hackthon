"use client"

import { GlassCard } from "@/components/ui/glass-card"
import type { PredictedIssue } from "@/lib/types"
import { Clock, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

interface IssueTimelineProps {
  issues: PredictedIssue[]
}

export function IssueTimeline({ issues }: IssueTimelineProps) {
  const sortedIssues = [...issues].sort(
    (a, b) => new Date(a.predictedDate).getTime() - new Date(b.predictedDate).getTime(),
  )

  const getUrgencyColor = (date: string) => {
    const daysUntil = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysUntil <= 7) return "border-destructive bg-destructive/10"
    if (daysUntil <= 30) return "border-warning bg-warning/10"
    return "border-primary bg-primary/10"
  }

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Issue Timeline</h3>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {sortedIssues.map((issue, index) => (
            <div key={issue.id} className="relative pl-10">
              <div
                className={cn("absolute left-2 w-4 h-4 rounded-full border-2", getUrgencyColor(issue.predictedDate))}
              />

              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{issue.component}</h4>
                    <p className="text-sm text-muted-foreground">{issue.issue}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {new Date(issue.predictedDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">{issue.confidence}% confidence</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Wrench className="w-4 h-4" />
                    <span>₹{issue.estimatedCost.toLocaleString()}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                    {issue.recommendedAction}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}

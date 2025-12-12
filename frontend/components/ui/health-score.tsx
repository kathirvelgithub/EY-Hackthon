"use client"

import { cn } from "@/lib/utils"

interface HealthScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function HealthScore({ score, size = "md", showLabel = true }: HealthScoreProps) {
  const getColor = () => {
    if (score >= 80) return "text-neon-lime"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  const getStrokeColor = () => {
    if (score >= 80) return "stroke-neon-lime"
    if (score >= 60) return "stroke-warning"
    return "stroke-destructive"
  }

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  const radius = size === "sm" ? 28 : size === "md" ? 44 : 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-1000 ease-out", getStrokeColor())}
          />
        </svg>
        <div className={cn("absolute inset-0 flex items-center justify-center font-bold", textSizes[size], getColor())}>
          {score}
        </div>
      </div>
      {showLabel && <span className="text-sm text-muted-foreground">Health Score</span>}
    </div>
  )
}

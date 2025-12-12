"use client"

import type React from "react"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockUsers } from "@/lib/mock-data"
import type { UserRole } from "@/lib/types"
import { Car, User, Lock, ChevronRight, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

const roleDescriptions: Record<UserRole, string> = {
  customer: "View your vehicle health, schedule services, and get predictive maintenance alerts",
  service_advisor: "Manage customer appointments, view vehicle diagnostics, and process service requests",
  service_center_manager: "Oversee service center operations, workforce planning, and quality metrics",
  oem_quality_engineer: "Analyze manufacturing defects, track CAPA recommendations, and manage quality processes",
  ai_ops_admin: "Monitor AI agent behavior, review anomalies, and manage system security",
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Store the selected role in sessionStorage for demo purposes
    sessionStorage.setItem("userRole", selectedRole)
    sessionStorage.setItem("userName", mockUsers[selectedRole].name)
    router.push("/dashboard")
  }

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: "customer", label: "Customer", icon: <User className="w-4 h-4" /> },
    { role: "service_advisor", label: "Service Advisor", icon: <User className="w-4 h-4" /> },
    { role: "service_center_manager", label: "Service Center Manager", icon: <User className="w-4 h-4" /> },
    { role: "oem_quality_engineer", label: "OEM Quality Engineer", icon: <User className="w-4 h-4" /> },
    { role: "ai_ops_admin", label: "AI Ops Admin", icon: <Shield className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-lime/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AutoPredict</h1>
          <p className="text-muted-foreground mt-2">Autonomous Predictive Maintenance Platform</p>
        </div>

        <GlassCard>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label className="text-foreground mb-3 block">Select Your Role</Label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map(({ role, label, icon }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      selectedRole === role ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${selectedRole === role ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                    >
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{roleDescriptions[role]}</div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${selectedRole === role ? "text-primary rotate-90" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={mockUsers[selectedRole].email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2">
              Sign In
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Demo mode: Select a role and click Sign In to explore the platform
          </p>
        </GlassCard>
      </div>
    </div>
  )
}

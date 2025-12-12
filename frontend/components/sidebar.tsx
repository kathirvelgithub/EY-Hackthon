"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/types"
import {
  LayoutDashboard,
  Car,
  Wrench,
  Calendar,
  BarChart3,
  FileText,
  Mic,
  Shield,
  ChevronLeft,
  LogOut,
  Settings,
  User,
  Workflow,
} from "lucide-react"

interface SidebarProps {
  userRole: UserRole
  userName: string
}

const roleNavItems: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  customer: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/telemetry", label: "Vehicle Telemetry", icon: Car },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/scheduling", label: "Scheduling", icon: Calendar },
    { href: "/voice", label: "Voice Assistant", icon: Mic },
    { href: "/orchestration", label: "Orchestration", icon: Workflow },
  ],
  service_advisor: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/telemetry", label: "Vehicle Telemetry", icon: Car },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/scheduling", label: "Scheduling", icon: Calendar },
    { href: "/workload", label: "Workload Forecast", icon: BarChart3 },
    { href: "/voice", label: "Voice Assistant", icon: Mic },
    { href: "/orchestration", label: "Orchestration", icon: Workflow },
  ],
  service_center_manager: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/telemetry", label: "Vehicle Telemetry", icon: Car },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/scheduling", label: "Scheduling", icon: Calendar },
    { href: "/workload", label: "Workload Forecast", icon: BarChart3 },
    { href: "/analytics", label: "RCA/CAPA Analytics", icon: FileText },
    { href: "/voice", label: "Voice Assistant", icon: Mic },
    { href: "/orchestration", label: "Orchestration", icon: Workflow },
  ],
  oem_quality_engineer: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/telemetry", label: "Vehicle Telemetry", icon: Car },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/analytics", label: "RCA/CAPA Analytics", icon: FileText },
    { href: "/workload", label: "Workload Forecast", icon: BarChart3 },
    { href: "/orchestration", label: "Orchestration", icon: Workflow },
  ],
  ai_ops_admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ueba", label: "UEBA Monitoring", icon: Shield },
    { href: "/telemetry", label: "Vehicle Telemetry", icon: Car },
    { href: "/analytics", label: "RCA/CAPA Analytics", icon: FileText },
    { href: "/voice", label: "Voice Assistant", icon: Mic },
    { href: "/orchestration", label: "Orchestration", icon: Workflow },
  ],
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const navItems = roleNavItems[userRole]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">AutoPredict</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 mx-auto rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors", collapsed && "mx-auto mt-2")}
          >
            <ChevronLeft
              className={cn("w-5 h-5 text-sidebar-foreground transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="w-5 h-5 text-sidebar-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{userRole.replace(/_/g, " ")}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <Link
                href="/"
                className="flex items-center justify-center p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

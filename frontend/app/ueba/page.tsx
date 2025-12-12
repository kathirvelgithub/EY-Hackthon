"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { UEBADashboard } from "@/components/ueba/ueba-dashboard"
import { useUEBA } from "@/hooks/use-ueba"
import type { UserRole } from "@/lib/types"

export default function UEBAPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)

  const { alerts, loading } = useUEBA(10000) // Refresh every 10 seconds

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
  }, [router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} />

      <main className="ml-64 transition-all duration-300">
        <Header title="UEBA Monitoring" subtitle="User and Entity Behavior Analytics for AI Operations" />

        <div className="p-6">
          <UEBADashboard alerts={alerts} />
        </div>
      </main>
    </div>
  )
}

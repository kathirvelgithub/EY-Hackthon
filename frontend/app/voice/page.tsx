"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { VoicePanel } from "@/components/voice/voice-panel"
import type { UserRole } from "@/lib/types"

export default function VoicePage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) {
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
        <Header title="Voice Assistant" subtitle="Interact with your vehicle using natural language" />

        <div className="p-6">
          <VoicePanel />
        </div>
      </main>
    </div>
  )
}

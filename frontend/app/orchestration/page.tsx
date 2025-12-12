"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { backendApi, aiAgentsApi } from "@/lib/api-client"
import type { UserRole } from "@/lib/types"
import { Play, Loader2, CheckCircle, XCircle, Activity, Bot, Server } from "lucide-react"

export default function OrchestrationPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole>("customer")
  const [userName, setUserName] = useState("User")
  const [mounted, setMounted] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState("VEH_001")
  const [loading, setLoading] = useState(false)
  const [backendResult, setBackendResult] = useState<any>(null)
  const [aiAgentResult, setAIAgentResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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

  const runBackendOrchestration = async () => {
    setLoading(true)
    setError(null)
    setBackendResult(null)
    
    try {
      const response: any = await backendApi.runOrchestration(selectedVehicle)
      const result = response.data || response
      setBackendResult(result)
    } catch (err: any) {
      setError(`Backend Error: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const runAIAgentFlow = async () => {
    setLoading(true)
    setError(null)
    setAIAgentResult(null)
    
    try {
      const response: any = await aiAgentsApi.runAgentFlow(selectedVehicle)
      const result = response.data || response
      setAIAgentResult(result)
    } catch (err: any) {
      setError(`AI Agent Error: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const runFullWorkflow = async () => {
    await runBackendOrchestration()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await runAIAgentFlow()
  }

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
        <Header 
          title="Orchestration Engine" 
          subtitle="Test end-to-end AI agent workflows and backend integration" 
        />

        <div className="p-6 space-y-6">
          {/* Control Panel */}
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-2 block">Select Vehicle</label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VEH_001">VEH_001 - Maruti Swift 2022</SelectItem>
                    <SelectItem value="VEH_002">VEH_002 - Honda City 2023</SelectItem>
                    <SelectItem value="VEH_003">VEH_003 - Hyundai i20 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={runBackendOrchestration} 
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                  Backend Flow
                </Button>

                <Button 
                  onClick={runAIAgentFlow} 
                  disabled={loading}
                  className="gap-2"
                  variant="outline"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  AI Agent Flow
                </Button>

                <Button 
                  onClick={runFullWorkflow} 
                  disabled={loading}
                  className="gap-2"
                  variant="default"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  Full Workflow
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </GlassCard>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Backend Result */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Backend Orchestration</h3>
                {backendResult && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
              </div>

              {backendResult ? (
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <div className="text-sm font-medium text-foreground">
                      {backendResult.status || backendResult.message || 'Success'}
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Vehicle ID</div>
                    <div className="text-sm font-medium text-foreground">
                      {backendResult.vehicle_id || backendResult.vehicleId || selectedVehicle}
                    </div>
                  </div>

                  {backendResult.results && (
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Workflow Steps</div>
                      <pre className="text-xs text-foreground overflow-x-auto">
                        {JSON.stringify(backendResult.results, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Full Response</div>
                    <pre className="text-xs text-foreground overflow-x-auto max-h-64 overflow-y-auto">
                      {JSON.stringify(backendResult, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No backend results yet</p>
                  <p className="text-xs mt-1">Click "Backend Flow" to start</p>
                </div>
              )}
            </GlassCard>

            {/* AI Agent Result */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">AI Agent Workflow</h3>
                {aiAgentResult && <CheckCircle className="w-4 h-4 text-success ml-auto" />}
              </div>

              {aiAgentResult ? (
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <div className="text-sm font-medium text-foreground">
                      {aiAgentResult.status || 'Success'}
                    </div>
                  </div>

                  {aiAgentResult.risk_score && (
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
                      <div className="text-2xl font-bold text-warning">
                        {aiAgentResult.risk_score}/100
                      </div>
                    </div>
                  )}

                  {aiAgentResult.diagnosis_report && (
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Diagnosis</div>
                      <div className="text-sm text-foreground">
                        {aiAgentResult.diagnosis_report}
                      </div>
                    </div>
                  )}

                  {aiAgentResult.customer_script && (
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Customer Message</div>
                      <div className="text-sm text-foreground">
                        {aiAgentResult.customer_script}
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Full Response</div>
                    <pre className="text-xs text-foreground overflow-x-auto max-h-64 overflow-y-auto">
                      {JSON.stringify(aiAgentResult, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No AI agent results yet</p>
                  <p className="text-xs mt-1">Click "AI Agent Flow" to start</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  )
}

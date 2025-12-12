import { useState } from 'react'
import { aiAgentsService } from '@/lib/services'

/**
 * Custom hook for AI agent operations
 */
export function useAIAgents() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<any>(null)

  const runWorkflow = async (vehicleId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await aiAgentsService.runFullWorkflow(vehicleId)
      setResult(data)
      return data
    } catch (err) {
      setError(err as Error)
      console.error('AI workflow error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getPredictions = async (vehicleId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await aiAgentsService.getPredictiveInsights(vehicleId)
      setResult(data)
      return data
    } catch (err) {
      setError(err as Error)
      console.error('Prediction error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { runWorkflow, getPredictions, loading, error, result }
}

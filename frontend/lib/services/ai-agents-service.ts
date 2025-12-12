import { aiAgentsApi } from '@/lib/api-client'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export const aiAgentsService = {
  async runFullWorkflow(vehicleId: string) {
    if (USE_MOCK) {
      return {
        status: 'success',
        vehicle_id: vehicleId,
        risk_level: 'medium',
        risk_score: 65,
        diagnosis_report: 'Mock: Vehicle requires attention',
        customer_script: 'Mock: Please schedule service',
        recommended_action: 'Schedule maintenance',
      }
    }

    try {
      const result = await aiAgentsApi.runAgentFlow(vehicleId)
      return result
    } catch (error) {
      console.error('Failed to run AI agent workflow:', error)
      throw error
    }
  },

  async getPredictiveInsights(vehicleId: string) {
    if (USE_MOCK) {
      return {
        predictions: [],
        confidence: 0,
      }
    }

    try {
      const result = await aiAgentsApi.getPredictiveInsights(vehicleId)
      return result
    } catch (error) {
      console.error('Failed to get predictive insights:', error)
      return {
        predictions: [],
        confidence: 0,
      }
    }
  },

  async checkHealth() {
    try {
      const result = await aiAgentsApi.healthCheck()
      return result
    } catch (error) {
      console.error('AI agents health check failed:', error)
      return { status: 'unhealthy', error: String(error) }
    }
  },
}

import { backendApi } from '@/lib/api-client'
import { mockUEBAAlerts } from '@/lib/mock-data'
import type { UEBAAlert } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export const uebaService = {
  async getUEBAAlerts(): Promise<UEBAAlert[]> {
    if (USE_MOCK) {
      return mockUEBAAlerts
    }

    try {
      const response: any = await backendApi.getUEBAEvents()
      const events = response.data || response
      
      if (Array.isArray(events)) {
        return events.map((event: any) => ({
          id: event.event_id || event.id,
          agentId: event.agent_name || event.agentId,
          action: event.service_name || event.action,
          riskScore: event.action === 'blocked' ? 85 : 10,
          timestamp: event.timestamp || new Date().toISOString(),
          anomalyType: event.action === 'blocked' ? 'unauthorized_access' : 'normal',
          status: event.action === 'blocked' ? 'pending' : 'reviewed',
        }))
      }

      return []
    } catch (error) {
      console.error('Failed to fetch UEBA alerts:', error)
      return mockUEBAAlerts
    }
  },

  async getUEBASummary() {
    if (USE_MOCK) {
      return {
        total_events: mockUEBAAlerts.length,
        allowed: mockUEBAAlerts.filter((a) => a.status === 'reviewed').length,
        blocked: mockUEBAAlerts.filter((a) => a.status === 'pending').length,
        unique_agents: ['DataAnalysis', 'Diagnosis', 'CustomerEngagement', 'Scheduling'],
      }
    }

    try {
      const response: any = await backendApi.getUEBASummary()
      const summary = response.data || response
      return summary
    } catch (error) {
      console.error('Failed to fetch UEBA summary:', error)
      return {
        total_events: 0,
        allowed: 0,
        blocked: 0,
        unique_agents: [],
      }
    }
  },
}

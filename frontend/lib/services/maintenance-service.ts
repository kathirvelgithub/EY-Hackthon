import { backendApi } from '@/lib/api-client'
import { mockPredictedIssues } from '@/lib/mock-data'
import type { PredictedIssue } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export const maintenanceService = {
  async getMaintenanceHistory(vehicleId: string) {
    if (USE_MOCK) {
      return []
    }

    try {
      const response: any = await backendApi.getMaintenanceHistory(vehicleId)
      // Backend returns { success, vehicle_id, records, count, timestamp }
      const data = response.records || response.data || response
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Failed to fetch maintenance history:', error)
      return []
    }
  },

  async getPredictedIssues(vehicleId: string): Promise<PredictedIssue[]> {
    if (USE_MOCK) {
      return mockPredictedIssues
    }

    try {
      const response: any = await backendApi.getTelemetry(vehicleId)
      const data = response.data || response
      
      // Extract predicted issues from telemetry or maintenance data
      if (data.predicted_issues && Array.isArray(data.predicted_issues)) {
        return data.predicted_issues.map((issue: any) => ({
          id: issue.id || Math.random().toString(36),
          component: issue.component || 'Unknown',
          issue: issue.description || issue.issue || 'Unknown issue',
          confidence: issue.confidence || 50,
          predictedDate: issue.predicted_date || issue.predictedDate || new Date().toISOString(),
          rootCause: issue.root_cause || issue.rootCause || 'Unknown',
          recommendedAction: issue.recommended_action || issue.recommendedAction || 'Contact service',
          estimatedCost: issue.estimated_cost || issue.estimatedCost || 0,
        }))
      }

      return []
    } catch (error) {
      console.error('Failed to fetch predicted issues:', error)
      return mockPredictedIssues
    }
  },
}

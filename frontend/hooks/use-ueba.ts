import { useState, useEffect } from 'react'
import { uebaService } from '@/lib/services'
import type { UEBAAlert } from '@/lib/types'

/**
 * Custom hook for UEBA monitoring data
 */
export function useUEBA(refreshInterval?: number) {
  const [alerts, setAlerts] = useState<UEBAAlert[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchUEBA = async () => {
    try {
      setLoading(true)
      setError(null)
      const [alertsData, summaryData] = await Promise.all([
        uebaService.getUEBAAlerts(),
        uebaService.getUEBASummary(),
      ])
      setAlerts(alertsData)
      setSummary(summaryData)
    } catch (err) {
      setError(err as Error)
      console.error('UEBA fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUEBA()

    if (refreshInterval) {
      const interval = setInterval(fetchUEBA, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  return { alerts, summary, loading, error, refetch: fetchUEBA }
}

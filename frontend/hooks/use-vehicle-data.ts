import { useState, useEffect } from 'react'
import { telemetryService, maintenanceService } from '@/lib/services'
import type { TelemetryData, PredictedIssue } from '@/lib/types'

/**
 * Custom hook for fetching vehicle telemetry data
 */
export function useTelemetry(vehicleId: string, refreshInterval?: number) {
  const [data, setData] = useState<TelemetryData | null>(null)
  const [history, setHistory] = useState<TelemetryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTelemetry = async () => {
    try {
      setLoading(true)
      setError(null)
      const latest = await telemetryService.getLatestTelemetry(vehicleId)
      const hist = await telemetryService.getTelemetryHistory(vehicleId)
      setData(latest)
      setHistory(hist)
    } catch (err) {
      setError(err as Error)
      console.error('Telemetry fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTelemetry()

    if (refreshInterval) {
      const interval = setInterval(fetchTelemetry, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [vehicleId, refreshInterval])

  return { data, history, loading, error, refetch: fetchTelemetry }
}

/**
 * Custom hook for fetching maintenance data
 */
export function useMaintenance(vehicleId: string) {
  const [predictedIssues, setPredictedIssues] = useState<PredictedIssue[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMaintenance = async () => {
    try {
      setLoading(true)
      setError(null)
      const [issues, hist] = await Promise.all([
        maintenanceService.getPredictedIssues(vehicleId),
        maintenanceService.getMaintenanceHistory(vehicleId),
      ])
      setPredictedIssues(issues)
      setHistory(hist)
    } catch (err) {
      setError(err as Error)
      console.error('Maintenance fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaintenance()
  }, [vehicleId])

  return { predictedIssues, history, loading, error, refetch: fetchMaintenance }
}

/**
 * Custom hook for DTC codes
 */
export function useDTCCodes(vehicleId: string, refreshInterval?: number) {
  const [codes, setCodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchDTCCodes = async () => {
    try {
      setLoading(true)
      setError(null)
      const dtcCodes = await telemetryService.getDTCCodes(vehicleId)
      setCodes(dtcCodes)
    } catch (err) {
      setError(err as Error)
      console.error('DTC codes fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDTCCodes()

    if (refreshInterval) {
      const interval = setInterval(fetchDTCCodes, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [vehicleId, refreshInterval])

  return { codes, loading, error, refetch: fetchDTCCodes }
}

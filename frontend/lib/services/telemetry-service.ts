import { backendApi } from '@/lib/api-client'
import { mockTelemetry, mockDTCCodes } from '@/lib/mock-data'
import type { TelemetryData, DTCCode } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export const telemetryService = {
  async getAllTelemetrics() {
    if (USE_MOCK) {
      return []
    }

    try {
      const response: any = await backendApi.getAllTelemetrics()
      const data = response.data || response
      
      // Return array of vehicles with telemetry data
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Failed to fetch all telemetrics:', error)
      return []
    }
  },

  async getLatestTelemetry(vehicleId: string): Promise<TelemetryData> {
    if (USE_MOCK) {
      return mockTelemetry[mockTelemetry.length - 1]
    }

    try {
      const response: any = await backendApi.getTelemetry(vehicleId)
      const data = response.data || response
      
      // Transform backend response to frontend format
      return {
        timestamp: data.timestamp || new Date().toISOString(),
        engineTemp: data.engine_temp || data.engineTemp || 0,
        brakeWear: data.brake_wear || data.brakeWear || 0,
        odometer: data.odometer || 0,
        batteryVoltage: data.battery_voltage || data.batteryVoltage || 0,
        fuelLevel: data.fuel_level || data.fuelLevel || 0,
        oilPressure: data.oil_pressure || data.oilPressure || 0,
        coolantTemp: data.coolant_temp || data.coolantTemp || 0,
      }
    } catch (error) {
      console.error('Failed to fetch telemetry:', error)
      // Fallback to mock data on error
      return mockTelemetry[mockTelemetry.length - 1]
    }
  },

  async getTelemetryHistory(vehicleId: string): Promise<TelemetryData[]> {
    if (USE_MOCK) {
      return mockTelemetry
    }

    try {
      // Backend doesn't have history endpoint yet, return single reading as array
      const latest = await this.getLatestTelemetry(vehicleId)
      return [latest]
    } catch (error) {
      console.error('Failed to fetch telemetry history:', error)
      return mockTelemetry
    }
  },

  async getDTCCodes(vehicleId: string): Promise<DTCCode[]> {
    if (USE_MOCK) {
      return mockDTCCodes
    }

    try {
      const response: any = await backendApi.getTelemetry(vehicleId)
      const data = response.data || response
      
      // Extract DTC codes from telemetry response
      if (data.dtc_codes && Array.isArray(data.dtc_codes)) {
        return data.dtc_codes.map((code: any) => ({
          code: code.code || code,
          description: code.description || 'Unknown',
          severity: code.severity || 'medium',
          timestamp: code.timestamp || new Date().toISOString(),
        }))
      }

      return []
    } catch (error) {
      console.error('Failed to fetch DTC codes:', error)
      return mockDTCCodes
    }
  },
}

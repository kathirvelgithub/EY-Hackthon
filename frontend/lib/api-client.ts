/**
 * API Client for Backend and AI Agents Integration
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000'
const AI_AGENTS_URL = process.env.NEXT_PUBLIC_AI_AGENTS_API_URL || 'http://localhost:8000'
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new ApiError(
      error.message || error.error || `HTTP ${response.status}`,
      response.status,
      error
    )
  }

  const json = await response.json()
  
  // Backend has inconsistent response formats:
  // - Some return { success, data, timestamp }
  // - Some return { success, records, count, timestamp }
  // - Some return { success, data, count, timestamp }
  // Return the entire response for services to handle
  return json as T
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 15000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

/**
 * Backend API Client (Node.js/Express on port 5000)
 */
export const backendApi = {
  // Telematics Routes
  async getTelemetry(vehicleId: string) {
    const response = await fetchWithTimeout(`${BACKEND_URL}/telematics/${vehicleId}`)
    return handleResponse(response)
  },

  async getAllTelemetrics() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/telematics`)
    return handleResponse(response)
  },

  // Maintenance Routes
  async getMaintenanceHistory(vehicleId: string) {
    const response = await fetchWithTimeout(`${BACKEND_URL}/maintenance/${vehicleId}`)
    return handleResponse(response)
  },

  async getAllMaintenanceRecords() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/maintenance`)
    return handleResponse(response)
  },

  // Scheduler Routes
  async getAvailableSlots(centerId: string, date: string) {
    const response = await fetchWithTimeout(
      `${BACKEND_URL}/scheduler/slots?center_id=${centerId}&date=${date}`
    )
    return handleResponse(response)
  },

  async bookAppointment(data: {
    vehicle_id: string
    slot_id: string
    center_id: string
    customer_name: string
  }) {
    const response = await fetchWithTimeout(`${BACKEND_URL}/scheduler/book`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async getAllBookings() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/scheduler/bookings`)
    return handleResponse(response)
  },

  async getVehicleBookings(vehicleId: string) {
    const response = await fetchWithTimeout(`${BACKEND_URL}/scheduler/bookings/${vehicleId}`)
    return handleResponse(response)
  },

  // Notification Routes
  async sendNotification(data: {
    vehicle_id: string
    message: string
    channel: string
    metadata?: any
  }) {
    const response = await fetchWithTimeout(`${BACKEND_URL}/notifications/push`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async getNotificationHistory() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/notifications/history`)
    return handleResponse(response)
  },

  async getNotificationStats() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/notifications/stats`)
    return handleResponse(response)
  },

  // UEBA Routes
  async logUEBAEvent(data: {
    agent_name: string
    service_name: string
    status: string
    details?: string
  }) {
    const response = await fetchWithTimeout(`${BACKEND_URL}/ueba/event`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async getUEBAEvents() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/ueba/events`)
    return handleResponse(response)
  },

  async getUEBASummary() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/ueba/summary`)
    return handleResponse(response)
  },

  // Orchestration Routes
  async runOrchestration(vehicleId: string) {
    const response = await fetchWithTimeout(
      `${BACKEND_URL}/orchestration/run_flow`,
      {
        method: 'POST',
        body: JSON.stringify({ vehicle_id: vehicleId }),
      },
      30000 // 30s timeout for orchestration
    )
    return handleResponse(response)
  },

  async getOrchestrationUEBASummary() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/orchestration/ueba-summary`)
    return handleResponse(response)
  },

  // Health Check
  async healthCheck() {
    const response = await fetchWithTimeout(`${BACKEND_URL}/health`)
    return handleResponse(response)
  },
}

/**
 * AI Agents API Client (FastAPI/LangGraph on port 8000)
 */
export const aiAgentsApi = {
  // Run full AI agent workflow
  async runAgentFlow(vehicleId: string) {
    const response = await fetchWithTimeout(
      `${AI_AGENTS_URL}/orchestration/run_flow`,
      {
        method: 'POST',
        body: JSON.stringify({ vehicle_id: vehicleId }),
      },
      45000 // 45s timeout for AI workflow
    )
    return handleResponse(response)
  },

  // Get predictive insights
  async getPredictiveInsights(vehicleId: string) {
    const response = await fetchWithTimeout(
      `${AI_AGENTS_URL}/predictive/analyze`,
      {
        method: 'POST',
        body: JSON.stringify({ vehicle_id: vehicleId }),
      }
    )
    return handleResponse(response)
  },

  // Health check
  async healthCheck() {
    const response = await fetchWithTimeout(`${AI_AGENTS_URL}/health`)
    return handleResponse(response)
  },
}

/**
 * Combined API for pages (handles mock fallback)
 */
export const api = {
  useMock: USE_MOCK,
  backend: backendApi,
  agents: aiAgentsApi,
}

export default api

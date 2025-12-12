export type UserRole =
  | "customer"
  | "service_advisor"
  | "service_center_manager"
  | "oem_quality_engineer"
  | "ai_ops_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  licensePlate: string
  healthScore: number
  lastService: string
  nextServiceDue: string
}

export interface TelemetryData {
  timestamp: string
  engineTemp: number
  brakeWear: number
  odometer: number
  batteryVoltage: number
  fuelLevel: number
  oilPressure: number
  coolantTemp: number
}

export interface DTCCode {
  code: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
}

export interface PredictedIssue {
  id: string
  component: string
  issue: string
  confidence: number
  predictedDate: string
  rootCause: string
  recommendedAction: string
  estimatedCost: number
}

export interface ServiceAppointment {
  id: string
  vehicleId: string
  date: string
  time: string
  serviceCenter: string
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled"
  services: string[]
  estimatedDuration: number
}

export interface ServiceCenter {
  id: string
  name: string
  address: string
  capacity: number
  currentLoad: number
  availableSlots: number
  rating: number
}

export interface UEBAAlert {
  id: string
  agentId: string
  action: string
  riskScore: number
  timestamp: string
  anomalyType: string
  status: "pending" | "reviewed" | "dismissed"
}

export interface CAPARecommendation {
  id: string
  defectType: string
  rootCause: string
  correctiveAction: string
  preventiveAction: string
  status: "open" | "in_progress" | "closed"
  priority: "low" | "medium" | "high" | "critical"
}

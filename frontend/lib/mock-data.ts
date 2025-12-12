import type {
  User,
  Vehicle,
  TelemetryData,
  DTCCode,
  PredictedIssue,
  ServiceAppointment,
  ServiceCenter,
  UEBAAlert,
  CAPARecommendation,
} from "./types"

export const mockUsers: Record<string, User> = {
  customer: {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    role: "customer",
  },
  service_advisor: {
    id: "2",
    name: "Priya Sharma",
    email: "priya.sharma@oem.com",
    role: "service_advisor",
  },
  service_center_manager: {
    id: "3",
    name: "Vikram Singh",
    email: "vikram.singh@oem.com",
    role: "service_center_manager",
  },
  oem_quality_engineer: {
    id: "4",
    name: "Ananya Patel",
    email: "ananya.patel@oem.com",
    role: "oem_quality_engineer",
  },
  ai_ops_admin: {
    id: "5",
    name: "Arjun Mehta",
    email: "arjun.mehta@oem.com",
    role: "ai_ops_admin",
  },
}

export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    vin: "MAHINDRA2024XUV700",
    make: "Mahindra",
    model: "XUV700",
    year: 2024,
    licensePlate: "MH-01-AB-1234",
    healthScore: 87,
    lastService: "2024-10-15",
    nextServiceDue: "2025-01-15",
  },
  {
    id: "v2",
    vin: "HERO2024XPULSE200",
    make: "Hero",
    model: "XPulse 200",
    year: 2024,
    licensePlate: "DL-05-CD-5678",
    healthScore: 92,
    lastService: "2024-11-01",
    nextServiceDue: "2025-02-01",
  },
]

export const mockTelemetry: TelemetryData[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
  engineTemp: 85 + Math.random() * 15,
  brakeWear: 75 - i * 0.2,
  odometer: 45000 + i * 10,
  batteryVoltage: 12.2 + Math.random() * 0.6,
  fuelLevel: 70 - i * 1.5,
  oilPressure: 40 + Math.random() * 10,
  coolantTemp: 80 + Math.random() * 10,
}))

export const mockDTCCodes: DTCCode[] = [
  {
    code: "P0300",
    description: "Random/Multiple Cylinder Misfire Detected",
    severity: "high",
    timestamp: "2024-12-08T10:30:00Z",
  },
  { code: "P0171", description: "System Too Lean (Bank 1)", severity: "medium", timestamp: "2024-12-07T14:15:00Z" },
  {
    code: "P0420",
    description: "Catalyst System Efficiency Below Threshold",
    severity: "low",
    timestamp: "2024-12-05T09:00:00Z",
  },
  {
    code: "P0128",
    description: "Coolant Thermostat Below Regulating Temperature",
    severity: "medium",
    timestamp: "2024-12-09T08:45:00Z",
  },
]

export const mockPredictedIssues: PredictedIssue[] = [
  {
    id: "pi1",
    component: "Brake Pads",
    issue: "Brake pad wear approaching critical threshold",
    confidence: 94,
    predictedDate: "2025-01-20",
    rootCause: "Normal wear pattern accelerated by frequent city driving",
    recommendedAction: "Schedule brake pad replacement within 30 days",
    estimatedCost: 4500,
  },
  {
    id: "pi2",
    component: "Battery",
    issue: "Battery capacity degradation detected",
    confidence: 78,
    predictedDate: "2025-02-15",
    rootCause: "Age-related capacity loss, cold weather impact",
    recommendedAction: "Monitor battery health, prepare for replacement",
    estimatedCost: 8000,
  },
  {
    id: "pi3",
    component: "Air Filter",
    issue: "Air filter efficiency reduced",
    confidence: 85,
    predictedDate: "2025-01-10",
    rootCause: "Dust accumulation from highway driving",
    recommendedAction: "Replace air filter at next service",
    estimatedCost: 1200,
  },
]

export const mockAppointments: ServiceAppointment[] = [
  {
    id: "apt1",
    vehicleId: "v1",
    date: "2025-01-15",
    time: "10:00",
    serviceCenter: "Mahindra Service - Mumbai Central",
    status: "confirmed",
    services: ["Brake Pad Replacement", "Oil Change", "General Inspection"],
    estimatedDuration: 180,
  },
  {
    id: "apt2",
    vehicleId: "v2",
    date: "2025-02-01",
    time: "14:30",
    serviceCenter: "Hero Service Hub - Delhi South",
    status: "scheduled",
    services: ["Regular Maintenance", "Chain Adjustment"],
    estimatedDuration: 90,
  },
]

export const mockServiceCenters: ServiceCenter[] = [
  {
    id: "sc1",
    name: "Mahindra Service - Mumbai Central",
    address: "Lower Parel, Mumbai",
    capacity: 25,
    currentLoad: 18,
    availableSlots: 7,
    rating: 4.5,
  },
  {
    id: "sc2",
    name: "Hero Service Hub - Delhi South",
    address: "Saket, New Delhi",
    capacity: 20,
    currentLoad: 12,
    availableSlots: 8,
    rating: 4.7,
  },
  {
    id: "sc3",
    name: "OEM Premium Service - Bangalore",
    address: "Koramangala, Bangalore",
    capacity: 30,
    currentLoad: 24,
    availableSlots: 6,
    rating: 4.8,
  },
  {
    id: "sc4",
    name: "AutoCare Express - Chennai",
    address: "T. Nagar, Chennai",
    capacity: 15,
    currentLoad: 10,
    availableSlots: 5,
    rating: 4.3,
  },
]

export const mockUEBAAlerts: UEBAAlert[] = [
  {
    id: "ua1",
    agentId: "agent-scheduler-01",
    action: "Bulk appointment rescheduling",
    riskScore: 75,
    timestamp: "2024-12-09T11:30:00Z",
    anomalyType: "Unusual volume",
    status: "pending",
  },
  {
    id: "ua2",
    agentId: "agent-diagnostic-02",
    action: "Accessed restricted vehicle data",
    riskScore: 85,
    timestamp: "2024-12-09T10:15:00Z",
    anomalyType: "Access violation",
    status: "pending",
  },
  {
    id: "ua3",
    agentId: "agent-maintenance-01",
    action: "Modified maintenance thresholds",
    riskScore: 45,
    timestamp: "2024-12-08T16:45:00Z",
    anomalyType: "Configuration change",
    status: "reviewed",
  },
  {
    id: "ua4",
    agentId: "agent-scheduler-01",
    action: "Off-hours system access",
    riskScore: 60,
    timestamp: "2024-12-08T02:30:00Z",
    anomalyType: "Temporal anomaly",
    status: "dismissed",
  },
]

export const mockCAPARecommendations: CAPARecommendation[] = [
  {
    id: "capa1",
    defectType: "Brake Caliper Seal Failure",
    rootCause: "Material degradation under high temperature",
    correctiveAction: "Replace affected batch with upgraded seal material",
    preventiveAction: "Update supplier specifications, increase incoming inspection",
    status: "in_progress",
    priority: "high",
  },
  {
    id: "capa2",
    defectType: "ECU Software Glitch",
    rootCause: "Memory overflow in specific driving conditions",
    correctiveAction: "Deploy firmware patch v2.3.1",
    preventiveAction: "Enhanced code review process, stress testing protocols",
    status: "open",
    priority: "critical",
  },
  {
    id: "capa3",
    defectType: "Suspension Bushing Wear",
    rootCause: "Accelerated wear in rough road conditions",
    correctiveAction: "Customer advisory for affected VINs",
    preventiveAction: "Design revision for next model year",
    status: "closed",
    priority: "medium",
  },
]

export const mockWorkloadData = [
  { day: "Mon", morning: 85, afternoon: 72, evening: 45 },
  { day: "Tue", morning: 78, afternoon: 88, evening: 52 },
  { day: "Wed", morning: 92, afternoon: 95, evening: 68 },
  { day: "Thu", morning: 70, afternoon: 82, evening: 55 },
  { day: "Fri", morning: 88, afternoon: 90, evening: 75 },
  { day: "Sat", morning: 95, afternoon: 85, evening: 40 },
  { day: "Sun", morning: 45, afternoon: 35, evening: 20 },
]

export const mockDefectTrends = [
  { month: "Jul", brakes: 12, electrical: 8, engine: 5, suspension: 3 },
  { month: "Aug", brakes: 15, electrical: 10, engine: 7, suspension: 4 },
  { month: "Sep", brakes: 18, electrical: 12, engine: 6, suspension: 5 },
  { month: "Oct", brakes: 14, electrical: 9, engine: 8, suspension: 6 },
  { month: "Nov", brakes: 10, electrical: 7, engine: 4, suspension: 3 },
  { month: "Dec", brakes: 8, electrical: 6, engine: 3, suspension: 2 },
]

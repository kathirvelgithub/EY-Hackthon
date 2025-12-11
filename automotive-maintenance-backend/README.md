# Agentic AI for Predictive Vehicle Maintenance - Backend API

A Node.js + Express backend for an autonomous vehicle maintenance prediction system with multi-agent orchestration and UEBA security enforcement.

## 📋 Project Overview

This backend implements:
- **Telematics Service**: Real-time vehicle sensor data ingestion
- **Maintenance History Service**: Historical maintenance record retrieval
- **Scheduler Service**: Autonomous appointment booking
- **Notification Service**: Push notifications and SMS alerts
- **UEBA Enforcement Layer**: Security policy enforcement for AI agents
- **Orchestration Engine**: Multi-agent workflow coordination

## 🏗️ Project Structure

```
automotive-maintenance-backend/
├── src/
│   ├── server.js                    # Express app initialization
│   ├── routes/
│   │   ├── telematics.js           # Telematics endpoints
│   │   ├── maintenance.js          # Maintenance endpoints
│   │   ├── scheduler.js            # Scheduler endpoints
│   │   ├── notifications.js        # Notification endpoints
│   │   └── orchestration.js        # Orchestration endpoints
│   ├── controllers/
│   │   ├── telematicsController.js
│   │   ├── maintenanceController.js
│   │   ├── schedulerController.js
│   │   ├── notificationController.js
│   │   └── orchestrationController.js
│   ├── services/
│   │   ├── telemeticsService.js    # Telemetry data access
│   │   ├── maintenanceService.js   # Maintenance data access
│   │   ├── schedulerService.js     # Booking logic
│   │   ├── notificationService.js  # Notification logic
│   │   └── manufacturingService.js # RCA/CAPA analysis
│   └── middleware/
│       └── ueba.js                 # Security enforcement middleware
├── data/
│   ├── telematics_stream.json      # Mock sensor data
│   ├── maintenance_history.csv     # Historical maintenance records
│   ├── rca_capa.json               # RCA/CAPA database
│   ├── bookings.json               # Service bookings (generated)
│   ├── ueba_events.json            # UEBA audit logs (generated)
│   └── notifications.log           # Notification logs (generated)
├── logs/
│   └── (generated log files)
├── package.json
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd automotive-maintenance-backend

# Install dependencies
npm install

# Start the server
npm start

# Or run with nodemon for development
npm run dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### 1. Health Check
```
GET /health
```
Returns server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-10T10:30:00Z"
}
```

---

### 2. Telematics Service

#### Get Vehicle Telemetry
```
GET /telematics/:vehicle_id
```
Fetch real-time sensor data for a specific vehicle.

**Example:**
```bash
curl -X GET http://localhost:5000/telematics/VEH_001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicle_id": "VEH_001",
    "vehicle_name": "Maruti Swift 2022",
    "timestamp": "2025-12-10T10:30:00Z",
    "brake_wear": 82,
    "engine_temp": 98,
    "battery_voltage": 13.2,
    "dtc_codes": ["P0101", "P0102"],
    "odometer": 45200,
    "fuel_level": 65
  },
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Get All Vehicles
```
GET /telematics
```
Fetch telemetry data for all vehicles.

**Example:**
```bash
curl -X GET http://localhost:5000/telematics
```

---

### 3. Maintenance History Service

#### Get Vehicle Maintenance History
```
GET /maintenance/:vehicle_id?limit=5
```
Retrieve last N maintenance records for a vehicle.

**Example:**
```bash
curl -X GET "http://localhost:5000/maintenance/VEH_001?limit=5"
```

**Response:**
```json
{
  "success": true,
  "vehicle_id": "VEH_001",
  "records": [
    {
      "vehicle_id": "VEH_001",
      "service_date": "2025-11-15",
      "component": "Brake System",
      "issue": "Brake pads worn",
      "action_taken": "Replaced front brake pads",
      "status": "completed",
      "technician": "Ramesh"
    }
  ],
  "count": 3,
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Get All Maintenance Records
```
GET /maintenance
```

---

### 4. Scheduler Service

#### Get Available Slots
```
GET /scheduler/slots?center_id=CENTER_001&date=2025-12-10
```
Fetch available service appointment slots.

**Example:**
```bash
curl -X GET "http://localhost:5000/scheduler/slots?center_id=CENTER_001&date=2025-12-10"
```

**Response:**
```json
{
  "success": true,
  "center_id": "CENTER_001",
  "date": "2025-12-10",
  "slots": [
    {
      "slot_id": "SLOT_001",
      "center_id": "CENTER_001",
      "date": "2025-12-10",
      "time": "09:00-11:00",
      "capacity": 2,
      "available": true
    },
    {
      "slot_id": "SLOT_002",
      "center_id": "CENTER_001",
      "date": "2025-12-10",
      "time": "14:00-16:00",
      "capacity": 2,
      "available": true
    }
  ],
  "available_count": 3,
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Book Appointment
```
POST /scheduler/book
```
Autonomously book a service appointment.

**Request Body:**
```json
{
  "vehicle_id": "VEH_001",
  "slot_id": "SLOT_001",
  "center_id": "CENTER_001",
  "customer_name": "Rajesh Kumar"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/scheduler/book \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH_001",
    "slot_id": "SLOT_001",
    "center_id": "CENTER_001",
    "customer_name": "Rajesh Kumar"
  }'
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "booking_id": "BK_a1b2c3d4",
    "vehicle_id": "VEH_001",
    "customer_name": "Rajesh Kumar",
    "slot_id": "SLOT_001",
    "center_id": "CENTER_001",
    "booking_date": "2025-12-10T10:30:00Z",
    "status": "confirmed",
    "estimated_duration": "1-2 hours"
  },
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Get All Bookings
```
GET /scheduler/bookings
```

#### Get Vehicle Bookings
```
GET /scheduler/bookings/:vehicle_id
```

---

### 5. Notification Service

#### Send Notification
```
POST /notifications/push
```
Send push notification or SMS to vehicle owner.

**Request Body:**
```json
{
  "vehicle_id": "VEH_001",
  "message": "Your service appointment is confirmed for tomorrow at 09:00 AM",
  "channel": "app",
  "metadata": {
    "priority": "high",
    "booking_id": "BK_a1b2c3d4"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/notifications/push \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH_001",
    "message": "Service reminder: Your appointment is tomorrow",
    "channel": "app"
  }'
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "notification_id": "NOTIF_abc12def",
    "vehicle_id": "VEH_001",
    "timestamp": "2025-12-10T10:30:00Z",
    "message": "Service reminder: Your appointment is tomorrow",
    "channel": "app",
    "status": "sent",
    "metadata": {}
  },
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Get Notification History
```
GET /notifications/history?vehicle_id=VEH_001
```

#### Get Notification Stats
```
GET /notifications/stats
```

---

### 6. Orchestration Engine (Main Endpoint)

#### Run Complete Predictive Flow
```
POST /orchestration/run_flow
```
Triggers the complete multi-agent orchestration workflow for a vehicle.

**Request Body:**
```json
{
  "vehicle_id": "VEH_001",
  "customer_name": "Rajesh Kumar"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/orchestration/run_flow \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH_001",
    "customer_name": "Rajesh Kumar"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orchestration_id": "ORK_1733816400000",
    "vehicle_id": "VEH_001",
    "vehicle_name": "Maruti Swift 2022",
    "timestamp": "2025-12-10T10:30:00Z",
    
    "telemetry": {
      "engine_temp": 98,
      "brake_wear": 82,
      "battery_voltage": 13.2,
      "dtc_codes": ["P0101", "P0102"],
      "odometer": 45200
    },
    
    "diagnosis": {
      "risk_level": "HIGH",
      "predicted_issues": [
        "Brake pads near end of life",
        "2 diagnostic trouble codes detected"
      ],
      "confidence": 0.85
    },
    
    "customer_engagement": {
      "customer_name": "Rajesh Kumar",
      "engagement_script": "I've detected some important maintenance needs for your vehicle that require urgent attention...",
      "customer_decision": "schedule"
    },
    
    "scheduling": {
      "booking_id": "BK_a1b2c3d4",
      "slot_id": "SLOT_001",
      "center_id": "CENTER_001",
      "booking_date": "2025-12-10T10:30:00Z",
      "status": "confirmed"
    },
    
    "manufacturing_insights": [
      {
        "issue": "Elevated engine temperatures detected",
        "pattern": "Recurring in 12% of Q4 fleet",
        "recommendation": "Review thermal management design for improvement",
        "priority": "HIGH"
      }
    ],
    
    "feedback": {
      "feedback_id": "FB_1733816400000",
      "scheduled_at": "2025-12-11T10:30:00Z",
      "status": "pending"
    },
    
    "ueba_summary": {
      "total_events": 8,
      "allowed_calls": 8,
      "blocked_calls": 0,
      "error_calls": 0,
      "blocked_details": []
    }
  },
  "timestamp": "2025-12-10T10:30:00Z"
}
```

#### Get UEBA Summary
```
GET /orchestration/ueba-summary
```
Retrieve security and compliance audit logs.

**Example:**
```bash
curl -X GET http://localhost:5000/orchestration/ueba-summary
```

**Response:**
```json
{
  "success": true,
  "ueba_summary": {
    "total_events": 15,
    "allowed": 13,
    "blocked": 2,
    "errors": 0,
    "unique_agents": ["DataAnalysis", "Diagnosis", "Scheduling", "CustomerEngagement"],
    "recent_blocks": [
      {
        "event_id": "evt-xxx",
        "timestamp": "2025-12-10T10:20:00Z",
        "agent_name": "FeedbackAgent",
        "service_name": "scheduler",
        "action": "blocked",
        "reason": "Agent not authorized. Allowed services: notifications, maintenance"
      }
    ]
  },
  "timestamp": "2025-12-10T10:30:00Z"
}
```

---

## 🔒 UEBA Security Framework

The system implements fine-grained agent permission enforcement:

### Agent Permission Matrix

| Agent | Allowed Services |
|-------|-----------------|
| **DataAnalysis** | telematics, maintenance |
| **Diagnosis** | telematics, maintenance |
| **CustomerEngagement** | maintenance, notifications |
| **Scheduling** | scheduler, notifications |
| **Feedback** | notifications, maintenance |
| **ManufacturingInsights** | maintenance |

### Using secureCall in Your Code

```javascript
const { secureCall } = require('./middleware/ueba');

// Example: DataAnalysis agent calling telematics
const result = await secureCall('DataAnalysis', 'telematics', async () => {
  return getTelemetryData(vehicleId);
});

if (result.status === 'success') {
  console.log('Data:', result.data);
} else if (result.status === 'blocked') {
  console.log('Access denied:', result.error);
}
```

### UEBA Log Structure
Each agent interaction is logged with:
- `event_id`: Unique identifier
- `timestamp`: When the event occurred
- `agent_name`: Name of the agent
- `service_name`: Service accessed
- `action`: allowed/blocked/error
- `reason`: Explanation

---

## 📊 Sample Test Data

### Available Test Vehicles
- `VEH_001`: Maruti Swift 2022 (High risk - brake wear 82%, DTC codes)
- `VEH_002`: Hyundai Creta 2021 (Low risk)
- `VEH_003`: Tata Nexon 2020 (High risk - engine temp 105°C)
- `VEH_004`: Honda City 2023 (Low risk)
- `VEH_005`: Mahindra XUV300 2022 (Medium-High risk)

### Available Service Centers
- `CENTER_001`: Main Service Center (3 slots)
- `CENTER_002`: Metropolitan Hub (3 slots)
- `CENTER_003`: Regional Center (3 slots)

---

## 🧪 Testing with Postman/cURL

### Complete End-to-End Test

```bash
# 1. Get vehicle telemetry
curl -X GET http://localhost:5000/telematics/VEH_001

# 2. Get maintenance history
curl -X GET http://localhost:5000/maintenance/VEH_001

# 3. Get available slots
curl -X GET "http://localhost:5000/scheduler/slots?center_id=CENTER_001&date=2025-12-10"

# 4. Run full orchestration flow (includes all agents)
curl -X POST http://localhost:5000/orchestration/run_flow \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH_001",
    "customer_name": "Test Customer"
  }'

# 5. Check UEBA logs
curl -X GET http://localhost:5000/orchestration/ueba-summary

# 6. View all bookings
curl -X GET http://localhost:5000/scheduler/bookings

# 7. Get notification stats
curl -X GET http://localhost:5000/notifications/stats
```

---

## 📝 API Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-12-10T10:30:00Z"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Resource created
- `400`: Bad request (missing/invalid parameters)
- `404`: Resource not found
- `500`: Server error

---

## 🚀 Demo Scenario

To demonstrate the complete system:

```bash
# Step 1: Start the server
npm start

# Step 2: Test with a vehicle that has issues
curl -X POST http://localhost:5000/orchestration/run_flow \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id": "VEH_001", "customer_name": "Rajesh Kumar"}'

# This will:
# - Fetch telemetry data (brake_wear: 82%, engine_temp: 98°C, DTC codes)
# - Analyze maintenance history
# - Predict HIGH risk
# - Generate customer engagement script
# - Autonomously book appointment
# - Create notification
# - Analyze manufacturing patterns
# - Log all agent interactions in UEBA
```

**Demo Output Shows:**
✅ Predictive failure detection (HIGH risk)
✅ Autonomous scheduling (appointment confirmed)
✅ Customer engagement (generated script)
✅ Manufacturing insights (thermal management recommendation)
✅ UEBA compliance (8 allowed calls, 0 blocked)

---

## 📈 Performance Notes

- **Telematics**: Real-time (JSON file reads)
- **Maintenance**: Async CSV parsing (optimized for large datasets)
- **Scheduling**: O(1) slot availability lookup
- **Orchestration**: ~500-800ms for full workflow
- **UEBA**: Minimal overhead (<5ms per call)

---

## 🔧 Configuration

Edit these files to customize:
- `src/middleware/ueba.js`: Modify `AGENT_PERMISSIONS` for different access policies
- `src/services/schedulerService.js`: Change `SERVICE_CENTER_SLOTS`
- `src/controllers/orchestrationController.js`: Adjust `predictiveModels` logic

---

## 📚 Documentation

For AI agent integration, refer to the `secureCall` wrapper in `src/middleware/ueba.js`.

Example Python agent integration:
```python
import requests

response = requests.post('http://localhost:5000/orchestration/run_flow', json={
  'vehicle_id': 'VEH_001',
  'customer_name': 'Test'
})

print(response.json())
```

---

## 📄 License

MIT License - EY Hackathon 2025

## 👥 Team

Built for Agentic AI in Predictive Vehicle Maintenance

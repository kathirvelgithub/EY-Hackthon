# Predictive Maintenance AI - Backend Integration Complete ✅

## Overview

The AI agent system has been fully integrated with your Node.js backend. All agents now call your REST APIs running on `http://localhost:5000` instead of using local JSON files.

---

## 🔧 Integration Changes Made

### 1. **Configuration System** (`app/config/settings.py`) ✅
- Centralized settings for all agents
- Backend API URL mapping
- LLM provider configuration (OpenRouter/Google)
- UEBA logging configuration
- Timeout and retry settings

### 2. **Data Repositories** (`app/data/repositories.py`) ✅
- **TelematicsRepo**: Calls `GET /telematics/{vehicle_id}`
- **VehicleRepo**: Calls `GET /telematics/{vehicle_id}` (metadata extraction)
- **MaintenanceRepo**: Calls `GET /maintenance/{vehicle_id}`
- **SchedulerRepo**: Calls `GET /scheduler/slots`, `POST /scheduler/book`
- **NotificationRepo**: Calls `GET /notifications`
- **UEBARepo**: Calls `POST /ueba/event` for security logging
- All with retry logic and error handling

### 3. **UEBA Security** (`app/ueba/middleware.py`) ✅
- Enhanced gatekeeper pattern
- Logs all agent-service interactions to backend `/ueba/event`
- Access control enforced before execution
- Error handling with security alerts

### 4. **Access Control Policies** (`app/ueba/policies.py`) ✅
Updated agent names to match your orchestration controller:
- `DataAnalysis` → Can access TelematicsRepo, VehicleRepo, MaintenanceRepo
- `Diagnosis` → Can access LLM_Inference
- `CustomerEngagement` → Can access LLM_Inference, NotificationRepo
- `Scheduling` → Can access SchedulerRepo (HIGH RISK)
- `Feedback` → Can access NotificationRepo
- `Manufacturing` → Can access LLM_Inference, MaintenanceRepo

### 5. **Agent Nodes** (Updated) ✅

#### **DataAnalysis Agent** (`data_analysis.py`)
- Fetches vehicle details from backend
- Calls `TelematicsRepo.get_latest_telematics()`
- Calls `MaintenanceRepo.get_maintenance_history()`
- Calculates risk score
- All secured with UEBA middleware

#### **Diagnosis Agent** (`diagnosis.py`)
- Uses LLM to analyze telematics and issues
- Configurable LLM provider (OpenRouter/Gemini)
- Fallback logic if LLM unavailable
- Extracts priority level from LLM response

#### **CustomerEngagement Agent** (`customer_engagement.py`)
- Drafts personalized service messages via LLM
- Logs action to backend via UEBA
- Simulates customer decision (in production: from customer interaction)
- Respects priority level for decision logic

#### **Scheduling Agent** (`scheduling.py`)
- Calls `SchedulerRepo.get_available_slots()`
- Books appointment via `SchedulerRepo.book_appointment()`
- HIGHEST RISK - all calls secured with UEBA
- Handles date selection based on priority

#### **Feedback Agent** (`feedback.py`)
- Generates post-service feedback requests via LLM
- Only runs if booking was confirmed
- Tracks feedback collection status

#### **Manufacturing Agent** (`manufacturing_insights.py`)
- Analyzes failures for fleet patterns
- Generates CAPA recommendations via LLM
- Only runs if risk score >= 40
- Detailed technical analysis

### 6. **FastAPI Server** (`app/api/main.py`) ✅
- RESTful HTTP interface for agent workflows
- **POST /orchestration/run_flow** - Trigger complete workflow
- **GET /health** - Health check
- **GET /agents** - List available agents
- **GET /status** - System status
- Integrated logging and error handling
- Ready for deployment

---

## 📋 Backend API Mapping

| Agent | Backend Endpoint | Method | Purpose |
|-------|-----------------|--------|---------|
| DataAnalysis | `/telematics/{vehicle_id}` | GET | Fetch telemetry |
| DataAnalysis | `/maintenance/{vehicle_id}` | GET | Fetch maintenance history |
| Diagnosis | (internal LLM) | - | Analyze issues |
| CustomerEngagement | (internal LLM) | - | Generate message |
| Scheduling | `/scheduler/slots` | GET | Get available times |
| Scheduling | `/scheduler/book` | POST | Book appointment |
| Feedback | (internal LLM) | - | Generate feedback request |
| Manufacturing | (internal LLM) | - | Generate CAPA |
| All Agents | `/ueba/event` | POST | Log security events |

---

## 🚀 Quick Start

### Step 1: Setup Environment

```bash
cd C:\kathir\EY-Hackthon\predictive_maintenance_ai-main

# Copy the example .env file
copy .env.example .env

# Edit .env with your settings:
# BACKEND_API_URL=http://localhost:5000
# OPENAI_API_KEY=your_openrouter_key_here
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Verify Backend is Running

```bash
# In another terminal, check backend health
curl http://localhost:5000/health
```

Expected response:
```json
{"status": "OK", "timestamp": "2025-12-11T..."}
```

### Step 4: Start AI Agents Server

```bash
# From predictive_maintenance_ai-main directory
uvicorn app.api.main:app --port 8000 --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     🚀 Predictive Maintenance AI Agents Starting
INFO:        Backend API: http://localhost:5000
```

### Step 5: Test the Workflow

**Option A: Using curl**
```bash
curl -X POST http://localhost:8000/orchestration/run_flow \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id": "VEH_001", "customer_name": "John Doe"}'
```

**Option B: Using Python requests**
```python
import requests

response = requests.post(
    "http://localhost:8000/orchestration/run_flow",
    json={"vehicle_id": "VEH_001"}
)
print(response.json())
```

**Option C: Interactive API Docs**
Visit: http://localhost:8000/docs

---

## 📊 Complete Workflow Example

### Request
```json
{
  "vehicle_id": "VEH_001",
  "customer_name": "Ramesh Kumar"
}
```

### Response
```json
{
  "success": true,
  "vehicle_id": "VEH_001",
  "risk_level": "HIGH",
  "risk_score": 65,
  "diagnosis": "Engine temperature elevated indicating cooling system stress...",
  "priority_level": "High",
  "customer_script": "Hi Ramesh, your Maruti Swift needs urgent service...",
  "customer_decision": "BOOKED",
  "booking_id": "BOOKING_9988",
  "selected_slot": "09:00 AM on 2025-12-12",
  "manufacturing_recommendations": "ROOT_CAUSE: Thermal management design flaw...",
  "feedback_request": "Hi Ramesh, thank you for servicing with us...",
  "error_message": null,
  "ueba_alert_triggered": false,
  "execution_time_ms": 2350.5,
  "timestamp": "2025-12-11T10:30:45.123Z"
}
```

---

## 🔐 Security & UEBA

All agent actions are logged to your backend UEBA system:

```
POST /ueba/event
{
  "agent_name": "DataAnalysis",
  "service_name": "TelematicsRepo",
  "status": "ALLOWED",
  "details": "Fetched telemetry for VEH_001",
  "timestamp": "2025-12-11T10:30:45.123Z"
}
```

View UEBA logs:
```bash
curl http://localhost:5000/ueba/summary
```

---

## 🤖 LLM Configuration

### Using OpenRouter (Recommended - Free)

1. Get API key: https://openrouter.ai/keys
2. Set in `.env`:
   ```
   LLM_PROVIDER=openrouter
   OPENAI_API_KEY=your_openrouter_api_key
   ```
3. Available free models:
   - `mistralai/mistral-7b-instruct:free`
   - `mistralai/devstral-2512:free` (default)

### Using Google Gemini

1. Get API key: https://makersuite.google.com/app/apikey
2. Set in `.env`:
   ```
   LLM_PROVIDER=google
   GOOGLE_API_KEY=your_google_api_key
   ```

### Fallback (No LLM)

If no LLM is configured, agents use heuristic logic with templated responses.

---

## 📦 Deployment Architecture

```
┌────────────────────────────────────────┐
│   Frontend (React on Port 3000)        │
│   - Dashboard, Fleet, Telemetry, etc   │
└────────────┬─────────────────────────┘
             │
             ├──→ Backend API (Node.js on Port 5000)
             │    - 21 REST endpoints
             │    - PostgreSQL database
             │    - UEBA security logging
             │
             └──→ AI Agents (FastAPI on Port 8000)
                  - 6 Worker agents
                  - LM orchestration
                  - Workflow management

```

---

## 🧪 Testing Agents Individually

### Test DataAnalysis Agent
```python
from app.agents.nodes.data_analysis import data_analysis_node
from app.agents.state import AgentState

state = AgentState(
    vehicle_id="VEH_001",
    risk_score=0,
    detected_issues=[],
    ueba_alert_triggered=False
)

result = data_analysis_node(state)
print(f"Risk Level: {result['risk_level']}")
print(f"Risk Score: {result['risk_score']}")
```

### Test Diagnosis Agent
```python
# (Requires DataAnalysis output)
from app.agents.nodes.diagnosis import diagnosis_node

result = diagnosis_node(state_from_data_analysis)
print(f"Priority: {result['priority_level']}")
print(f"Diagnosis: {result['diagnosis_report']}")
```

### Run Full Workflow
```python
from app.agents.master import run_predictive_flow

final_state = run_predictive_flow("VEH_001")
print(f"Success: {not final_state.get('error_message')}")
print(f"Booking ID: {final_state.get('booking_id')}")
```

---

## 📝 Troubleshooting

### Backend Connection Issues
```bash
# Test backend connectivity
curl http://localhost:5000/health

# Check backend logs
cd C:\kathir\EY-Hackthon\automotive-maintenance-backend
# (Backend should be running: node src/server.js)
```

### LLM API Errors
```
⚠️  LLM not configured or API key invalid
→ Set OPENAI_API_KEY in .env
→ Or use fallback logic (agents will work without LLM)
```

### UEBA Logging Failures
```
⚠️  Failed to log event to backend
→ Ensure backend /ueba/event endpoint is accessible
→ Check backend UEBA middleware is enabled
```

### Vehicle Not Found
```
❌ Vehicle VEH_001 not found
→ Verify vehicle exists in backend database
→ Check vehicle_id spelling and format
```

---

## 📚 API Documentation

Once running, visit interactive docs:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Or check this file for endpoint documentation.

---

## ✅ Integration Checklist

- ✅ Backend API running on port 5000
- ✅ Repositories updated to use REST calls
- ✅ Configuration system (settings.py)
- ✅ UEBA logging to backend
- ✅ FastAPI server created
- ✅ All 6 agents updated
- ✅ Error handling and fallbacks
- ✅ Documentation complete

---

## 🎯 Next Steps

1. **Run the agents**: `uvicorn app.api.main:app --port 8000`
2. **Test endpoints**: Visit http://localhost:8000/docs
3. **Monitor UEBA logs**: Check backend `/ueba/summary`
4. **Deploy**: Containerize both backend and agents (Docker)
5. **Scale**: Add more agents or workers as needed

---

## 📞 Support

For issues:
1. Check logs in console output
2. Verify backend connectivity
3. Check `.env` configuration
4. Review error messages in UEBA logs
5. Test individual agents with Python

---

**Integration Status**: ✅ COMPLETE AND READY FOR TESTING

All agents are now fully integrated with your Node.js backend and ready for production deployment.


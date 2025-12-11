# 🚀 Quick Start Guide - PostgreSQL Integration

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install PostgreSQL with Docker (Recommended)

```powershell
# Install Docker Desktop from https://www.docker.com/

# Run PostgreSQL container
docker run --name automotive-db `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=automotive_maintenance `
  -p 5432:5432 `
  -d postgres:15
```

### Step 2: Start Backend

```powershell
cd "c:\kathir\EY-Hackthon\automotive-maintenance-backend"
npm install
npm start
```

### Step 3: Test API

```powershell
# Health check
curl http://localhost:5000/health

# Get vehicles
curl http://localhost:5000/telematics

# Get specific vehicle
curl http://localhost:5000/telematics/VEH_001

# Run orchestration flow
curl -X POST http://localhost:5000/orchestration/run_flow `
  -H "Content-Type: application/json" `
  -d '{"vehicle_id":"VEH_001","customer_name":"Test User"}'
```

---

## 📋 Configuration Files

### `.env` (Database Connection)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=automotive_maintenance
PORT=5000
NODE_ENV=development
```

### Location
`c:\kathir\EY-Hackthon\automotive-maintenance-backend\.env`

---

## 🗂️ Project Structure

```
automotive-maintenance-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection pool
│   │   ├── initDb.js            # Database schema initialization
│   │   └── migrateData.js       # Data migration script
│   ├── middleware/
│   │   └── ueba.js              # Security enforcement (DB-backed)
│   ├── services/                # Now using PostgreSQL
│   │   ├── telemeticsService.js
│   │   ├── maintenanceService.js
│   │   ├── schedulerService.js
│   │   ├── notificationService.js
│   │   └── manufacturingService.js
│   ├── controllers/             # Express handlers
│   ├── routes/                  # API routes
│   └── server.js               # Entry point
├── data/                        # Sample data (JSON/CSV - for reference)
├── .env                        # Configuration
├── docker-compose.yml          # Docker setup
├── Dockerfile                  # Backend container
├── POSTGRESQL_SETUP.md         # Detailed PostgreSQL guide
└── README.md                   # API documentation
```

---

## 🎯 What's New

### PostgreSQL Tables Created
✅ `vehicles` - Vehicle master data
✅ `telemetry_stream` - Real-time sensor data (time-series)
✅ `maintenance_history` - Service records
✅ `service_bookings` - Appointment bookings
✅ `notifications` - Push/SMS notifications
✅ `ueba_events` - Security audit logs
✅ `rca_capa` - Manufacturing insights

### Automatic Data Migration
✅ Reads from JSON/CSV files
✅ Migrates to PostgreSQL on first startup
✅ No manual data entry needed

### Enhanced Services
✅ All services now use PostgreSQL queries
✅ Async/await patterns throughout
✅ Better performance & scalability

---

## 🔗 Connection Details

| Component | Host | Port | User | Password | Database |
|-----------|------|------|------|----------|----------|
| PostgreSQL | localhost | 5432 | postgres | postgres | automotive_maintenance |
| Backend | localhost | 5000 | - | - | - |
| pgAdmin | localhost | 5050 | admin@example.com | admin | - |

---

## 📊 Database Queries (Quick Reference)

### View All Vehicles
```sql
SELECT * FROM vehicles;
```

### View Latest Telemetry
```sql
SELECT vehicle_id, timestamp, engine_temp, brake_wear, battery_voltage
FROM telemetry_stream
ORDER BY timestamp DESC LIMIT 5;
```

### View UEBA Events
```sql
SELECT * FROM ueba_events ORDER BY timestamp DESC LIMIT 10;
```

### View Blocked Access Attempts
```sql
SELECT * FROM ueba_events WHERE action = 'blocked';
```

### View Recent Bookings
```sql
SELECT * FROM service_bookings ORDER BY booking_date DESC LIMIT 5;
```

---

## 🧪 API Endpoints (Key Examples)

### 1. Get Vehicle Telemetry
```bash
curl http://localhost:5000/telematics/VEH_001
```

### 2. Get Maintenance History
```bash
curl http://localhost:5000/maintenance/VEH_001
```

### 3. Get Available Slots
```bash
curl "http://localhost:5000/scheduler/slots?center_id=CENTER_001&date=2025-12-10"
```

### 4. Book Appointment
```bash
curl -X POST http://localhost:5000/scheduler/book \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH_001",
    "slot_id": "SLOT_001",
    "center_id": "CENTER_001",
    "customer_name": "John Doe"
  }'
```

### 5. Send Notification
```bash
curl -X POST http://localhost:5000/notifications/push \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH_001",
    "message": "Your service is ready",
    "channel": "app"
  }'
```

### 6. Run Full Orchestration Flow
```bash
curl -X POST http://localhost:5000/orchestration/run_flow \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH_001",
    "customer_name": "Rajesh Kumar"
  }'
```

### 7. Check UEBA Summary
```bash
curl http://localhost:5000/orchestration/ueba-summary
```

---

## 🐛 Troubleshooting

### Server won't start
```powershell
# Check if PostgreSQL is running
Get-Process postgres

# Check if port 5432 is in use
netstat -ano | findstr :5432

# Check logs
npm start
```

### Connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Fix:**
1. Ensure PostgreSQL is running: `docker ps | findstr automotive-db`
2. Verify `.env` settings match your PostgreSQL credentials
3. Restart server: `npm start`

### Database doesn't exist
```
database "automotive_maintenance" does not exist
```
**Fix:** Database is created automatically on first server start

### Tables don't exist
```
relation "vehicles" does not exist
```
**Fix:** Tables are created automatically from `initDb.js`

---

## 📚 Documentation Files

1. **README.md** - Complete API documentation
2. **POSTGRESQL_SETUP.md** - Detailed PostgreSQL guide
3. **.env** - Configuration (create from template)

---

## ✅ Verification Checklist

- [ ] Docker installed
- [ ] PostgreSQL container running
- [ ] `.env` file created and configured
- [ ] Dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm start`)
- [ ] Health check responds (`GET /health`)
- [ ] Can query vehicles (`GET /telematics`)
- [ ] Can run orchestration (`POST /orchestration/run_flow`)
- [ ] UEBA events logged in database

---

## 🚀 Next Steps

1. **Customize Configuration**
   - Edit `.env` for your PostgreSQL setup
   - Modify agent permissions in `src/middleware/ueba.js`

2. **Extend Functionality**
   - Add more predictive models
   - Integrate actual AI/LLM
   - Add WebSocket for real-time updates

3. **Deploy to Production**
   - Set up AWS RDS/Azure Database for PostgreSQL
   - Use Docker for containerization
   - Set up CI/CD pipeline

4. **Monitor & Maintain**
   - Check UEBA logs regularly
   - Monitor database performance
   - Backup data regularly

---

## 💡 Key Features Recap

✅ **Multi-Agent Orchestration** - Coordinated workflow
✅ **UEBA Security** - Permission enforcement with audit logs
✅ **Predictive Maintenance** - Risk assessment & failure prediction
✅ **Autonomous Scheduling** - Automatic appointment booking
✅ **Manufacturing Insights** - RCA/CAPA analysis
✅ **PostgreSQL Backend** - Scalable, enterprise-grade database
✅ **RESTful API** - Easy integration with AI systems
✅ **Real-time Monitoring** - Telemetry ingestion & analysis

---

**Status:** ✅ Ready for development & testing

For detailed guides, see `POSTGRESQL_SETUP.md` and `README.md`

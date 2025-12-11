# PostgreSQL Setup & Connection Guide

## 🗄️ PostgreSQL Installation & Connection

### Option 1: Install PostgreSQL Locally (Windows)

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 15 or latest version
   - Run the installer

2. **During Installation**
   - Set password for `postgres` user (default: `postgres`)
   - Keep default port: `5432`
   - Select components: PostgreSQL Server, pgAdmin, Command Line Tools

3. **Verify Installation**
   ```powershell
   psql --version
   ```

4. **Create Database**
   ```powershell
   psql -U postgres -c "CREATE DATABASE automotive_maintenance;"
   ```

---

### Option 2: Use Docker (Recommended for Quick Setup)

**Prerequisites:** Install Docker Desktop (https://www.docker.com/products/docker-desktop)

1. **Pull PostgreSQL Image**
   ```bash
   docker pull postgres:15
   ```

2. **Run PostgreSQL Container**
   ```bash
   docker run --name automotive-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=automotive_maintenance \
     -p 5432:5432 \
     -v automotive-db-volume:/var/lib/postgresql/data \
     -d postgres:15
   ```

3. **Verify Container is Running**
   ```bash
   docker ps | findstr automotive-db
   ```

4. **Access Database**
   ```bash
   docker exec -it automotive-db psql -U postgres -d automotive_maintenance
   ```

---

### Option 3: Use pgAdmin (GUI)

1. **Run pgAdmin with PostgreSQL**
   ```bash
   docker run --name pgadmin \
     -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
     -e PGADMIN_DEFAULT_PASSWORD=admin \
     -p 5050:80 \
     -d dpage/pgadmin4
   ```

2. **Access pgAdmin**
   - Open: http://localhost:5050
   - Login with email: `admin@example.com`, password: `admin`
   - Add new server with host: `host.docker.internal` or `localhost`

---

## 🔧 Configuring Backend Connection

### Step 1: Update `.env` File

Edit `c:\kathir\EY-Hackthon\automotive-maintenance-backend\.env`:

```env
# PostgreSQL Configuration
DB_HOST=localhost        # or your PostgreSQL host
DB_PORT=5432            # PostgreSQL port
DB_USER=postgres        # Database user
DB_PASSWORD=postgres    # Database password
DB_NAME=automotive_maintenance  # Database name

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 2: Verify Database Connection

```powershell
cd "c:\kathir\EY-Hackthon\automotive-maintenance-backend"
node -e "
const pool = require('./src/config/database');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ PostgreSQL connected:', res.rows[0].now);
    process.exit(0);
  }
});
"
```

---

## 🚀 Start Backend with PostgreSQL

### Start Server

```powershell
cd "c:\kathir\EY-Hackthon\automotive-maintenance-backend"
npm start
```

**Expected Output:**
```
🔄 Initializing database...
✅ vehicles table created
✅ telemetry_stream table created
✅ maintenance_history table created
✅ service_bookings table created
✅ notifications table created
✅ ueba_events table created
✅ rca_capa table created

📤 Migrating data to PostgreSQL...
🚗 Migrating vehicles...
✅ Migrated 5 vehicles
📡 Migrating telemetry data...
✅ Migrated 5 telemetry records
🔧 Migrating maintenance history...
✅ Migrated 12 maintenance records
📋 Migrating RCA/CAPA data...
✅ Migrated 5 RCA/CAPA records

✅ PostgreSQL connected
🚗 Automotive Maintenance Backend running on http://localhost:5000
📍 Health check: http://localhost:5000/health
🔄 Orchestration flow: POST http://localhost:5000/orchestration/run_flow
✅ PostgreSQL database connected
```

---

## 🧪 Test PostgreSQL Connection

### Test 1: Health Check
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -UseBasicParsing
$response.Content
```

**Expected Response:**
```json
{"status":"OK","timestamp":"2025-12-10T15:15:30Z"}
```

### Test 2: Get Vehicles
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/telematics" -Method GET -UseBasicParsing
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Test 3: Get Specific Vehicle
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/telematics/VEH_001" -Method GET -UseBasicParsing
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Test 4: Run Orchestration
```powershell
$body = @{ "vehicle_id" = "VEH_001"; "customer_name" = "Test User" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:5000/orchestration/run_flow" -Method POST `
  -Body $body -ContentType "application/json" -UseBasicParsing
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 📊 Database Management

### Connect to PostgreSQL CLI

```bash
# Direct connection
psql -U postgres -h localhost -d automotive_maintenance

# Or with password prompt
psql -U postgres -h localhost -W -d automotive_maintenance
```

### Useful PostgreSQL Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d vehicles
\d telemetry_stream
\d maintenance_history
\d service_bookings
\d notifications
\d ueba_events
\d rca_capa

-- Count records
SELECT COUNT(*) FROM vehicles;
SELECT COUNT(*) FROM telemetry_stream;
SELECT COUNT(*) FROM maintenance_history;
SELECT COUNT(*) FROM service_bookings;
SELECT COUNT(*) FROM ueba_events;

-- View recent UEBA events
SELECT * FROM ueba_events ORDER BY timestamp DESC LIMIT 10;

-- View blocked access attempts
SELECT * FROM ueba_events WHERE action = 'blocked' ORDER BY timestamp DESC;

-- View all vehicles with latest telemetry
SELECT v.vehicle_id, v.vehicle_name, t.engine_temp, t.brake_wear, t.battery_voltage
FROM vehicles v
LEFT JOIN LATERAL (
  SELECT * FROM telemetry_stream 
  WHERE vehicle_id = v.vehicle_id 
  ORDER BY timestamp DESC LIMIT 1
) t ON true;
```

---

## 🔄 Migration from JSON/CSV to PostgreSQL

The backend automatically migrates data on first startup:

1. Creates all required tables
2. Migrates vehicles from `telematics_stream.json`
3. Migrates telemetry readings
4. Migrates maintenance history from CSV
5. Migrates RCA/CAPA data

No manual data migration needed!

---

## 🚨 Troubleshooting

### Connection Refused
**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
- Verify PostgreSQL is running: `netstat -ano | findstr :5432`
- Check `.env` file settings
- Ensure database `automotive_maintenance` exists

### Database Not Found
**Problem:** `database "automotive_maintenance" does not exist`

**Solution:**
```sql
psql -U postgres -c "CREATE DATABASE automotive_maintenance;"
```

### Permission Denied
**Problem:** `role "postgres" does not exist`

**Solution:**
- Use correct username in `.env`
- Check PostgreSQL user creation

### Docker Connection Issues
**Problem:** Can't connect to Docker PostgreSQL

**Solution:**
```bash
# Use host.docker.internal instead of localhost
DB_HOST=host.docker.internal
```

---

## 📈 Performance Tips

1. **Add Indexes** (Done automatically)
   - Vehicle ID lookup: ✅ Indexed
   - Time-series queries: ✅ Indexed
   - UEBA filtering: ✅ Indexed

2. **Enable Logging**
   ```sql
   ALTER SYSTEM SET log_statement = 'all';
   SELECT pg_reload_conf();
   ```

3. **Monitor Connections**
   ```sql
   SELECT * FROM pg_stat_activity;
   ```

4. **Backup Database**
   ```bash
   pg_dump -U postgres automotive_maintenance > backup.sql
   ```

5. **Restore Database**
   ```bash
   psql -U postgres automotive_maintenance < backup.sql
   ```

---

## ✅ Verification Checklist

- [ ] PostgreSQL installed/running
- [ ] Database `automotive_maintenance` created
- [ ] `.env` file configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Server starts without errors (`npm start`)
- [ ] Health check works (`GET /health`)
- [ ] Data migrated to PostgreSQL
- [ ] UEBA events logged in database
- [ ] Orchestration flow runs end-to-end

---

## 🎯 Next Steps

After successful PostgreSQL setup:
1. Build AI agent integration layer
2. Implement real-time telemetry ingestion
3. Set up WebSocket for live updates
4. Deploy to cloud (AWS RDS, Azure Database, etc.)


#!/usr/bin/env node

/**
 * Database Initialization Script
 * Creates the automotive_maintenance database and schema
 */

require('dotenv').config();
const { Client } = require('pg');

const adminPool = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres' // Connect to default postgres DB first
});

const dbName = process.env.DB_NAME || 'automotive_maintenance';

async function initializeDatabase() {
  try {
    console.log('\n🔨 Initializing PostgreSQL Database\n');

    // Connect to admin database
    console.log('Connecting to PostgreSQL server...');
    await adminPool.connect();
    console.log('✅ Connected\n');

    // Create database if it doesn't exist
    console.log(`Creating database "${dbName}"...`);
    try {
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created\n`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`ℹ️  Database "${dbName}" already exists\n`);
      } else {
        throw err;
      }
    }

    // Close admin connection
    await adminPool.end();

    // Now create tables in the new database
    const { Pool } = require('pg');
    const appPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName
    });

    console.log('Creating database schema...\n');

    // Create tables
    const createTablesSQL = `
      -- Vehicles table
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_id VARCHAR(50) UNIQUE NOT NULL,
        vehicle_name VARCHAR(200),
        registration_number VARCHAR(50),
        model_year INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        owner_name VARCHAR(200),
        customer_contact VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Telemetry stream (time-series data)
      CREATE TABLE IF NOT EXISTS telemetry_stream (
        id BIGSERIAL PRIMARY KEY,
        vehicle_id VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        engine_temp FLOAT,
        brake_wear INTEGER,
        battery_voltage FLOAT,
        dtc_codes TEXT[],
        odometer INTEGER,
        fuel_level INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
      );

      -- Create index for time-series queries
      CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time 
        ON telemetry_stream(vehicle_id, timestamp DESC);

      -- Maintenance history
      CREATE TABLE IF NOT EXISTS maintenance_history (
        id SERIAL PRIMARY KEY,
        vehicle_id VARCHAR(50) NOT NULL,
        service_date DATE NOT NULL,
        component VARCHAR(100),
        issue TEXT,
        action_taken TEXT,
        status VARCHAR(20) DEFAULT 'completed',
        technician VARCHAR(100),
        cost DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
      );

      -- Service bookings
      CREATE TABLE IF NOT EXISTS service_bookings (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        vehicle_id VARCHAR(50) NOT NULL,
        center_id VARCHAR(50) NOT NULL,
        slot_id VARCHAR(50),
        booking_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'confirmed',
        customer_name VARCHAR(200),
        estimated_duration INTERVAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
      );

      -- Notifications
      CREATE TABLE IF NOT EXISTS notifications (
        id BIGSERIAL PRIMARY KEY,
        notification_id VARCHAR(50) UNIQUE NOT NULL,
        vehicle_id VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        channel VARCHAR(20) DEFAULT 'app',
        status VARCHAR(20) DEFAULT 'sent',
        metadata JSONB,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
      );

      -- UEBA events (security audit log)
      CREATE TABLE IF NOT EXISTS ueba_events (
        id BIGSERIAL PRIMARY KEY,
        event_id VARCHAR(50) UNIQUE NOT NULL,
        agent_name VARCHAR(100),
        service_name VARCHAR(100),
        action VARCHAR(50),
        reason TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create index for security queries
      CREATE INDEX IF NOT EXISTS idx_ueba_blocked 
        ON ueba_events(action, timestamp DESC)
        WHERE action = 'blocked';

      -- RCA/CAPA
      CREATE TABLE IF NOT EXISTS rca_capa (
        id SERIAL PRIMARY KEY,
        rca_id VARCHAR(50) UNIQUE NOT NULL,
        component_type VARCHAR(100),
        defect_description TEXT,
        root_cause TEXT,
        affected_vehicles_count INTEGER,
        capa_action TEXT,
        priority VARCHAR(20) DEFAULT 'MEDIUM',
        target_completion DATE,
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await appPool.query(createTablesSQL);
    console.log('✅ All tables created successfully\n');

    // Seed initial data from JSON/CSV files
    console.log('Migrating sample data...\n');

    const fs = require('fs');
    const path = require('path');

    // Read and insert vehicles
    const telematicsFile = path.join(__dirname, 'data', 'telematics_stream.json');
    if (fs.existsSync(telematicsFile)) {
      const telematicsData = JSON.parse(fs.readFileSync(telematicsFile, 'utf8'));
      
      for (const vehicle of telematicsData.vehicles) {
        await appPool.query(
          `INSERT INTO vehicles (vehicle_id, vehicle_name) VALUES ($1, $2) ON CONFLICT (vehicle_id) DO NOTHING`,
          [vehicle.vehicle_id, vehicle.vehicle_name]
        );

        await appPool.query(
          `INSERT INTO telemetry_stream (vehicle_id, timestamp, engine_temp, brake_wear, battery_voltage, dtc_codes, odometer, fuel_level) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [vehicle.vehicle_id, vehicle.timestamp, vehicle.engine_temp, vehicle.brake_wear, 
           vehicle.battery_voltage, vehicle.dtc_codes, vehicle.odometer, vehicle.fuel_level]
        );
      }
      console.log(`✅ Imported ${telematicsData.vehicles.length} vehicles\n`);
    }

    // Read and insert maintenance history from CSV
    const maintenanceFile = path.join(__dirname, 'data', 'maintenance_history.csv');
    if (fs.existsSync(maintenanceFile)) {
      const csv = require('csv-parser');
      const records = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(maintenanceFile)
          .pipe(csv())
          .on('data', (row) => records.push(row))
          .on('end', resolve)
          .on('error', reject);
      });

      for (const record of records) {
        await appPool.query(
          `INSERT INTO maintenance_history (vehicle_id, service_date, component, issue, action_taken, status, technician)
           VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
          [record.vehicle_id, record.service_date, record.component, record.issue, 
           record.action_taken, record.status, record.technician]
        );
      }
      console.log(`✅ Imported ${records.length} maintenance records\n`);
    }

    // Read and insert RCA/CAPA
    const rcaCapaFile = path.join(__dirname, 'data', 'rca_capa.json');
    if (fs.existsSync(rcaCapaFile)) {
      const rcaCapaData = JSON.parse(fs.readFileSync(rcaCapaFile, 'utf8'));

      for (const rca of rcaCapaData.records) {
        await appPool.query(
          `INSERT INTO rca_capa (rca_id, component_type, defect_description, root_cause, affected_vehicles_count, capa_action, priority, target_completion)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (rca_id) DO NOTHING`,
          [rca.rca_id, rca.component_type, rca.defect_description, rca.root_cause, 
           rca.affected_vehicles_count, rca.capa_action, rca.priority, rca.target_completion]
        );
      }
      console.log(`✅ Imported ${rcaCapaData.records.length} RCA/CAPA records\n`);
    }

    await appPool.end();

    console.log('═══════════════════════════════════════════════════');
    console.log('✅ DATABASE INITIALIZATION COMPLETE');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Database: automotive_maintenance');
    console.log('Tables: 7 (vehicles, telemetry_stream, maintenance_history,');
    console.log('           service_bookings, notifications, ueba_events, rca_capa)');
    console.log('Sample data: Loaded from JSON/CSV files\n');

  } catch (error) {
    console.error('\n❌ INITIALIZATION FAILED');
    console.error(`Error: ${error.message}\n`);
    process.exit(1);
  }
}

initializeDatabase();

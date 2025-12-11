const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('../config/database');

/**
 * Migrate data from JSON/CSV files to PostgreSQL
 */
async function migrateData() {
  try {
    console.log('\n📊 Starting data migration from JSON/CSV to PostgreSQL...\n');

    // Step 1: Migrate vehicles
    await migrateVehicles();

    // Step 2: Migrate telemetry
    await migrateTelemetry();

    // Step 3: Migrate maintenance history
    await migrateMaintenanceHistory();

    // Step 4: Migrate RCA/CAPA
    await migrateRCACAPAs();

    console.log('\n✅ Data migration completed successfully!\n');
    return true;

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    return false;
  }
}

/**
 * Migrate vehicles from telematics_stream.json
 */
async function migrateVehicles() {
  try {
    const telematicsFile = path.join(__dirname, '../../data/telematics_stream.json');
    const data = JSON.parse(fs.readFileSync(telematicsFile, 'utf8'));

    console.log('🚗 Migrating vehicles...');

    for (const vehicle of data.vehicles) {
      await pool.query(
        `INSERT INTO vehicles (vehicle_id, vehicle_name) 
         VALUES ($1, $2) 
         ON CONFLICT (vehicle_id) DO NOTHING`,
        [vehicle.vehicle_id, vehicle.vehicle_name]
      );
    }

    console.log(`✅ Migrated ${data.vehicles.length} vehicles`);
  } catch (error) {
    console.error('❌ Vehicle migration error:', error.message);
  }
}

/**
 * Migrate telemetry from telematics_stream.json
 */
async function migrateTelemetry() {
  try {
    const telematicsFile = path.join(__dirname, '../../data/telematics_stream.json');
    const data = JSON.parse(fs.readFileSync(telematicsFile, 'utf8'));

    console.log('📡 Migrating telemetry data...');

    let count = 0;
    for (const vehicle of data.vehicles) {
      await pool.query(
        `INSERT INTO telemetry_stream 
         (vehicle_id, timestamp, engine_temp, brake_wear, battery_voltage, dtc_codes, odometer, fuel_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          vehicle.vehicle_id,
          vehicle.timestamp,
          vehicle.engine_temp,
          vehicle.brake_wear,
          vehicle.battery_voltage,
          vehicle.dtc_codes,
          vehicle.odometer,
          vehicle.fuel_level
        ]
      );
      count++;
    }

    console.log(`✅ Migrated ${count} telemetry records`);
  } catch (error) {
    console.error('❌ Telemetry migration error:', error.message);
  }
}

/**
 * Migrate maintenance history from CSV
 */
async function migrateMaintenanceHistory() {
  try {
    const maintenanceFile = path.join(__dirname, '../../data/maintenance_history.csv');

    console.log('🔧 Migrating maintenance history...');

    const records = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(maintenanceFile)
        .pipe(csv())
        .on('data', (row) => {
          records.push(row);
        })
        .on('end', async () => {
          try {
            for (const record of records) {
              await pool.query(
                `INSERT INTO maintenance_history 
                 (vehicle_id, service_date, component, issue, action_taken, status, technician)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                  record.vehicle_id,
                  record.service_date,
                  record.component,
                  record.issue,
                  record.action_taken,
                  record.status,
                  record.technician
                ]
              );
            }
            console.log(`✅ Migrated ${records.length} maintenance records`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error('❌ Maintenance history migration error:', error.message);
  }
}

/**
 * Migrate RCA/CAPA data
 */
async function migrateRCACAPAs() {
  try {
    const rcaCapaFile = path.join(__dirname, '../../data/rca_capa.json');
    const data = JSON.parse(fs.readFileSync(rcaCapaFile, 'utf8'));

    console.log('📋 Migrating RCA/CAPA data...');

    let count = 0;
    for (const record of data.records) {
      await pool.query(
        `INSERT INTO rca_capa 
         (rca_id, component_type, defect_description, root_cause, affected_vehicles_count, capa_action, priority, target_completion)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          record.rca_id,
          record.component_type,
          record.defect_description,
          record.root_cause,
          record.affected_vehicles_count,
          record.capa_action,
          record.priority,
          record.target_completion
        ]
      );
      count++;
    }

    console.log(`✅ Migrated ${count} RCA/CAPA records`);
  } catch (error) {
    console.error('❌ RCA/CAPA migration error:', error.message);
  }
}

module.exports = { migrateData };

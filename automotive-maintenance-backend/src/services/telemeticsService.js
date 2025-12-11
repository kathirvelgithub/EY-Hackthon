const pool = require('../config/database');

/**
 * Fetch telematics data for a vehicle (latest record)
 */
async function getTelemetryByVehicleId(vehicleId) {
  try {
    const query = `
      SELECT 
        vehicle_id, 
        timestamp, 
        engine_temp, 
        brake_wear, 
        battery_voltage, 
        dtc_codes, 
        odometer, 
        fuel_level 
      FROM telemetry_stream 
      WHERE vehicle_id = $1 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;
    
    const result = await pool.query(query, [vehicleId]);
    
    if (result.rows.length === 0) {
      throw new Error(`Vehicle ${vehicleId} not found`);
    }

    const row = result.rows[0];
    
    // Get vehicle details
    const vehicleQuery = `SELECT vehicle_name FROM vehicles WHERE vehicle_id = $1`;
    const vehicleResult = await pool.query(vehicleQuery, [vehicleId]);
    const vehicleName = vehicleResult.rows[0]?.vehicle_name || 'Unknown';

    return {
      vehicle_id: row.vehicle_id,
      vehicle_name: vehicleName,
      timestamp: row.timestamp,
      brake_wear: row.brake_wear,
      engine_temp: row.engine_temp,
      battery_voltage: row.battery_voltage,
      dtc_codes: row.dtc_codes || [],
      odometer: row.odometer,
      fuel_level: row.fuel_level
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get all vehicles
 */
async function getAllVehicles() {
  try {
    const query = `
      SELECT 
        v.vehicle_id,
        v.vehicle_name,
        t.timestamp,
        t.engine_temp,
        t.brake_wear,
        t.battery_voltage,
        t.dtc_codes,
        t.odometer,
        t.fuel_level
      FROM vehicles v
      LEFT JOIN LATERAL (
        SELECT * FROM telemetry_stream 
        WHERE vehicle_id = v.vehicle_id 
        ORDER BY timestamp DESC 
        LIMIT 1
      ) t ON true
      ORDER BY v.vehicle_id
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Get telemetry history for a vehicle (time-series data)
 */
async function getTelemetryHistory(vehicleId, limit = 100) {
  try {
    const query = `
      SELECT 
        vehicle_id, 
        timestamp, 
        engine_temp, 
        brake_wear, 
        battery_voltage, 
        dtc_codes, 
        odometer, 
        fuel_level 
      FROM telemetry_stream 
      WHERE vehicle_id = $1 
      ORDER BY timestamp DESC 
      LIMIT $2
    `;
    
    const result = await pool.query(query, [vehicleId, limit]);
    return result.rows.reverse(); // Return in ascending order
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getTelemetryByVehicleId,
  getAllVehicles,
  getTelemetryHistory
};

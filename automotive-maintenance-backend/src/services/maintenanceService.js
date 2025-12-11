const pool = require('../config/database');

/**
 * Fetch maintenance history for a vehicle (last N records)
 */
async function getMaintenanceHistoryByVehicleId(vehicleId, limit = 5) {
  try {
    const query = `
      SELECT 
        vehicle_id,
        service_date,
        component,
        issue,
        action_taken,
        status,
        technician
      FROM maintenance_history
      WHERE vehicle_id = $1
      ORDER BY service_date DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [vehicleId, limit]);
    
    if (result.rows.length === 0) {
      throw new Error(`No maintenance records found for vehicle ${vehicleId}`);
    }

    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all maintenance records (for analytics)
 */
async function getAllMaintenanceRecords() {
  try {
    const query = `
      SELECT 
        vehicle_id,
        service_date,
        component,
        issue,
        action_taken,
        status,
        technician
      FROM maintenance_history
      ORDER BY service_date DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Get maintenance records by component type
 */
async function getMaintenanceByComponent(component) {
  try {
    const query = `
      SELECT 
        vehicle_id,
        service_date,
        component,
        issue,
        action_taken,
        status,
        technician
      FROM maintenance_history
      WHERE component ILIKE $1
      ORDER BY service_date DESC
    `;
    
    const result = await pool.query(query, [`%${component}%`]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getMaintenanceHistoryByVehicleId,
  getAllMaintenanceRecords,
  getMaintenanceByComponent
};

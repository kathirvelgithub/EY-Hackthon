const maintenanceService = require('../services/maintenanceService');

/**
 * GET /maintenance/:vehicle_id
 */
async function getMaintenanceHistory(req, res) {
  try {
    const { vehicle_id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;

    if (!vehicle_id) {
      return res.status(400).json({ error: 'vehicle_id is required' });
    }

    const history = await maintenanceService.getMaintenanceHistoryByVehicleId(
      vehicle_id,
      limit
    );

    res.status(200).json({
      success: true,
      vehicle_id: vehicle_id,
      records: history,
      count: history.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * GET /maintenance
 */
async function getAllMaintenanceRecords(req, res) {
  try {
    const records = await maintenanceService.getAllMaintenanceRecords();

    res.status(200).json({
      success: true,
      records: records,
      count: records.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  getMaintenanceHistory,
  getAllMaintenanceRecords
};

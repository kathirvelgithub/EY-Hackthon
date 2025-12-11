const telematicsService = require('../services/telemeticsService');

/**
 * GET /telematics/:vehicle_id
 */
async function getTelemetrics(req, res) {
  try {
    const { vehicle_id } = req.params;
    
    if (!vehicle_id) {
      return res.status(400).json({ error: 'vehicle_id is required' });
    }

    const telemetry = await telematicsService.getTelemetryByVehicleId(vehicle_id);
    
    res.status(200).json({
      success: true,
      data: telemetry,
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
 * GET /telematics
 */
async function getAllTelemetrics(req, res) {
  try {
    const vehicles = await telematicsService.getAllVehicles();
    
    res.status(200).json({
      success: true,
      data: vehicles,
      count: vehicles.length,
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
  getTelemetrics,
  getAllTelemetrics
};

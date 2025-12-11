const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// GET /maintenance/:vehicle_id
router.get('/:vehicle_id', maintenanceController.getMaintenanceHistory);

// GET /maintenance
router.get('/', maintenanceController.getAllMaintenanceRecords);

module.exports = router;

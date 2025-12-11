const express = require('express');
const router = express.Router();
const telematicsController = require('../controllers/telematicsController');

// GET /telematics/:vehicle_id
router.get('/:vehicle_id', telematicsController.getTelemetrics);

// GET /telematics
router.get('/', telematicsController.getAllTelemetrics);

module.exports = router;

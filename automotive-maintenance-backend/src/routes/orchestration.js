const express = require('express');
const router = express.Router();
const orchestrationController = require('../controllers/orchestrationController');

// POST /orchestration/run_flow
router.post('/run_flow', orchestrationController.runPredictiveFlow);

// GET /orchestration/ueba-summary
router.get('/ueba-summary', orchestrationController.getUEBASummaryEndpoint);

module.exports = router;

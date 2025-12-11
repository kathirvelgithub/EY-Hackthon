const express = require('express');
const router = express.Router();
const { logUEBAEvent, getAllUEBAEvents, getUEBASummary } = require('../middleware/ueba');

// POST /ueba/event - Log UEBA event from AI agents
router.post('/event', async (req, res) => {
  try {
    const { agent_name, service_name, status, details } = req.body;

    if (!agent_name || !service_name || !status) {
      return res.status(400).json({
        success: false,
        error: 'agent_name, service_name, and status are required',
        timestamp: new Date().toISOString()
      });
    }

    const event = {
      event_id: require('uuid').v4(),
      agent_name,
      service_name,
      action: status.toLowerCase(),
      reason: details || ''
    };

    await logUEBAEvent(event);

    return res.status(201).json({
      success: true,
      data: event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging UEBA event:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /ueba/events - Get all UEBA events
router.get('/events', async (req, res) => {
  try {
    const events = await getAllUEBAEvents();
    return res.status(200).json({
      success: true,
      data: events,
      count: events.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching UEBA events:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /ueba/summary - Get UEBA summary
router.get('/summary', async (req, res) => {
  try {
    const summary = await getUEBASummary();
    return res.status(200).json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching UEBA summary:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

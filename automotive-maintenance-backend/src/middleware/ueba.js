const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Agent-Service Permission Matrix
const AGENT_PERMISSIONS = {
  'DataAnalysis': ['telematics', 'maintenance'],
  'Diagnosis': ['telematics', 'maintenance'],
  'CustomerEngagement': ['maintenance', 'notifications'],
  'Scheduling': ['scheduler', 'notifications'],
  'Feedback': ['notifications', 'maintenance'],
  'ManufacturingInsights': ['maintenance']
};

/**
 * Secure call wrapper: enforces UEBA policies
 * @param {string} agentName - Name of the agent making the call
 * @param {string} serviceName - Name of the service being accessed
 * @param {function} handler - The actual handler function to execute
 * @returns {Promise<object>} Result object with status and data
 */
async function secureCall(agentName, serviceName, handler) {
  const callId = uuidv4();
  const timestamp = new Date().toISOString();

  // Check if agent has permission to access service
  const allowedServices = AGENT_PERMISSIONS[agentName] || [];
  const isAllowed = allowedServices.includes(serviceName);

  const uebEvent = {
    event_id: callId,
    agent_name: agentName,
    service_name: serviceName,
    action: isAllowed ? 'allowed' : 'blocked',
    reason: isAllowed ? 'Permission granted' : `Agent not authorized. Allowed services: ${allowedServices.join(', ')}`
  };

  // Log the event
  await logUEBAEvent(uebEvent);

  if (!isAllowed) {
    console.warn(`❌ UEBA BLOCK: Agent '${agentName}' attempted unauthorized access to '${serviceName}'`);
    return {
      status: 'blocked',
      error: `Agent '${agentName}' is not authorized to access '${serviceName}' service`,
      eventId: callId
    };
  }

  try {
    console.log(`✅ UEBA ALLOW: Agent '${agentName}' calling '${serviceName}'`);
    const result = await handler();
    return {
      status: 'success',
      data: result,
      eventId: callId
    };
  } catch (error) {
    const errorEvent = {
      event_id: callId,
      agent_name: agentName,
      service_name: serviceName,
      action: 'error',
      reason: error.message
    };
    await logUEBAEvent(errorEvent);

    return {
      status: 'error',
      error: error.message,
      eventId: callId
    };
  }
}

/**
 * Log UEBA event to database
 */
async function logUEBAEvent(event) {
  try {
    const query = `
      INSERT INTO ueba_events (event_id, agent_name, service_name, action, reason)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (event_id)
      DO UPDATE SET action = EXCLUDED.action, reason = EXCLUDED.reason, timestamp = NOW();
    `;

    await pool.query(query, [
      event.event_id,
      event.agent_name,
      event.service_name,
      event.action,
      event.reason
    ]);
  } catch (error) {
    console.error('Failed to log UEBA event:', error.message);
  }
}

/**
 * Get all UEBA events
 */
async function getAllUEBAEvents() {
  try {
    const query = `
      SELECT * FROM ueba_events
      ORDER BY timestamp DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Failed to read UEBA events:', error.message);
    return [];
  }
}

/**
 * Get blocked events only
 */
async function getBlockedEvents() {
  try {
    const query = `
      SELECT * FROM ueba_events
      WHERE action = 'blocked'
      ORDER BY timestamp DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Failed to read blocked events:', error.message);
    return [];
  }
}

/**
 * Get UEBA summary
 */
async function getUEBASummary() {
  try {
    const allEvents = await getAllUEBAEvents();
    const blockedEvents = await getBlockedEvents();

    const summary = {
      total_events: allEvents.length,
      allowed: allEvents.filter(e => e.action === 'allowed').length,
      blocked: allEvents.filter(e => e.action === 'blocked').length,
      errors: allEvents.filter(e => e.action === 'error').length,
      unique_agents: [...new Set(allEvents.map(e => e.agent_name))],
      recent_blocks: blockedEvents.slice(0, 5)
    };
    return summary;
  } catch (error) {
    console.error('Failed to get UEBA summary:', error.message);
    return {};
  }
}

/**
 * Clear UEBA logs (for testing)
 */
async function clearUEBALogs() {
  try {
    const query = `DELETE FROM ueba_events`;
    await pool.query(query);
    console.log('✅ UEBA logs cleared');
  } catch (error) {
    console.error('Failed to clear UEBA logs:', error.message);
  }
}

module.exports = {
  secureCall,
  logUEBAEvent,
  getAllUEBAEvents,
  getBlockedEvents,
  getUEBASummary,
  clearUEBALogs,
  AGENT_PERMISSIONS
};

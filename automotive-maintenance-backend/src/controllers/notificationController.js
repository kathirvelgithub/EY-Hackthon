const notificationService = require('../services/notificationService');

/**
 * POST /notifications/push
 * Body: { vehicle_id, message, channel, metadata }
 */
async function sendNotification(req, res) {
  try {
    const { vehicle_id, message, channel = 'app', metadata } = req.body;

    if (!vehicle_id || !message) {
      return res.status(400).json({
        error: 'vehicle_id and message are required'
      });
    }

    const notification = notificationService.sendPushNotification(
      vehicle_id,
      message,
      channel,
      metadata || {}
    );

    res.status(201).json({
      success: true,
      notification: notification,
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

/**
 * GET /notifications/history
 */
async function getNotificationHistory(req, res) {
  try {
    const { vehicle_id } = req.query;

    const history = notificationService.getNotificationHistory(vehicle_id);

    res.status(200).json({
      success: true,
      vehicle_id: vehicle_id || 'all',
      notifications: history,
      count: history.length,
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

/**
 * GET /notifications/stats
 */
async function getNotificationStats(req, res) {
  try {
    const stats = notificationService.getNotificationStats();

    res.status(200).json({
      success: true,
      stats: stats,
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
  sendNotification,
  getNotificationHistory,
  getNotificationStats
};

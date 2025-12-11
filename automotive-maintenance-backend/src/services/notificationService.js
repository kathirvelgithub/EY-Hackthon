const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

/**
 * Send push notification
 */
async function sendPushNotification(vehicleId, message, channel = 'app', metadata = {}) {
  try {
    const notificationId = `NOTIF_${uuidv4().substring(0, 8).toUpperCase()}`;
    const query = `
      INSERT INTO notifications 
      (notification_id, vehicle_id, message, channel, status, metadata, sent_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [
      notificationId,
      vehicleId,
      message,
      channel,
      'sent',
      JSON.stringify(metadata)
    ]);

    const notification = result.rows[0];
    console.log(`📱 Notification sent to vehicle ${vehicleId} via ${channel}`);

    return {
      notification_id: notification.notification_id,
      vehicle_id: notification.vehicle_id,
      timestamp: notification.created_at,
      message: notification.message,
      channel: notification.channel,
      status: notification.status,
      metadata: metadata
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get notification history
 */
async function getNotificationHistory(vehicleId = null) {
  try {
    let query = `
      SELECT notification_id, vehicle_id, message, channel, status, metadata, created_at
      FROM notifications
      ORDER BY created_at DESC
    `;
    
    let result;
    if (vehicleId) {
      query = `
        SELECT notification_id, vehicle_id, message, channel, status, metadata, created_at
        FROM notifications
        WHERE vehicle_id = $1
        ORDER BY created_at DESC
      `;
      result = await pool.query(query, [vehicleId]);
    } else {
      result = await pool.query(query);
    }

    return result.rows.map(row => ({
      notification_id: row.notification_id,
      vehicle_id: row.vehicle_id,
      timestamp: row.created_at,
      message: row.message,
      channel: row.channel,
      status: row.status
    }));
  } catch (error) {
    console.error('Error reading notification history:', error.message);
    return [];
  }
}

/**
 * Get notification statistics
 */
async function getNotificationStats() {
  try {
    const query = `
      SELECT 
        COUNT(*) as total,
        channel,
        status
      FROM notifications
      GROUP BY channel, status
    `;

    const result = await pool.query(query);
    const stats = {
      total_notifications: 0,
      by_channel: { app: 0, sms: 0 },
      by_status: { sent: 0, pending: 0, failed: 0 },
      recent: []
    };

    result.rows.forEach(row => {
      stats.total_notifications += row.total;
      if (row.channel === 'app') {
        stats.by_channel.app = row.total;
      } else if (row.channel === 'sms') {
        stats.by_channel.sms = row.total;
      }
      stats.by_status[row.status] = row.total;
    });

    // Get recent notifications
    const recentQuery = `
      SELECT notification_id, vehicle_id, message, channel, status, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    const recentResult = await pool.query(recentQuery);
    stats.recent = recentResult.rows;

    return stats;
  } catch (error) {
    console.error('Error getting notification stats:', error.message);
    return {};
  }
}

module.exports = {
  sendPushNotification,
  getNotificationHistory,
  getNotificationStats
};

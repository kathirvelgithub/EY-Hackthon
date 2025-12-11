const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /notifications/push
router.post('/push', notificationController.sendNotification);

// GET /notifications/history
router.get('/history', notificationController.getNotificationHistory);

// GET /notifications/stats
router.get('/stats', notificationController.getNotificationStats);

module.exports = router;

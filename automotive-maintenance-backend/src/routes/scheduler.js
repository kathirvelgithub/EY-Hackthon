const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedulerController');

// GET /scheduler/slots?center_id=XYZ&date=YYYY-MM-DD
router.get('/slots', schedulerController.getAvailableSlots);

// POST /scheduler/book
router.post('/book', schedulerController.bookAppointment);

// GET /scheduler/bookings
router.get('/bookings', schedulerController.getAllBookings);

// GET /scheduler/bookings/:vehicle_id
router.get('/bookings/:vehicle_id', schedulerController.getVehicleBookings);

module.exports = router;

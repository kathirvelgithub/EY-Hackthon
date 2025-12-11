const schedulerService = require('../services/schedulerService');

/**
 * GET /scheduler/slots?center_id=XYZ&date=YYYY-MM-DD
 */
async function getAvailableSlots(req, res) {
  try {
    const { center_id, date } = req.query;

    if (!center_id || !date) {
      return res.status(400).json({
        error: 'center_id and date (YYYY-MM-DD) are required'
      });
    }

    const slots = schedulerService.getAvailableSlots(center_id, date);

    res.status(200).json({
      success: true,
      center_id: center_id,
      date: date,
      slots: slots,
      available_count: slots.filter(s => s.available).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * POST /scheduler/book
 * Body: { vehicle_id, slot_id, center_id, customer_name }
 */
async function bookAppointment(req, res) {
  try {
    const { vehicle_id, slot_id, center_id, customer_name } = req.body;

    // Validation
    if (!vehicle_id || !slot_id || !center_id) {
      return res.status(400).json({
        error: 'vehicle_id, slot_id, and center_id are required'
      });
    }

    const booking = schedulerService.bookAppointment(
      vehicle_id,
      slot_id,
      center_id,
      customer_name || 'Customer'
    );

    res.status(201).json({
      success: true,
      booking: booking,
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
 * GET /scheduler/bookings
 */
async function getAllBookings(req, res) {
  try {
    const bookings = schedulerService.getAllBookings();

    res.status(200).json({
      success: true,
      bookings: bookings,
      count: bookings.length,
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
 * GET /scheduler/bookings/:vehicle_id
 */
async function getVehicleBookings(req, res) {
  try {
    const { vehicle_id } = req.params;

    const bookings = schedulerService.getBookingsByVehicleId(vehicle_id);

    res.status(200).json({
      success: true,
      vehicle_id: vehicle_id,
      bookings: bookings,
      count: bookings.length,
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
  getAvailableSlots,
  bookAppointment,
  getAllBookings,
  getVehicleBookings
};

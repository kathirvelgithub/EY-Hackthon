const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Fixed slots for each service center
const SERVICE_CENTER_SLOTS = {
  'CENTER-001': [
    { slot_id: 'SLOT-001', time: '09:00-11:00', capacity: 2, available: true },
    { slot_id: 'SLOT-002', time: '14:00-16:00', capacity: 2, available: true },
    { slot_id: 'SLOT-003', time: '16:00-18:00', capacity: 1, available: true }
  ],
  'CENTER-002': [
    { slot_id: 'SLOT-004', time: '10:00-12:00', capacity: 3, available: true },
    { slot_id: 'SLOT-005', time: '13:00-15:00', capacity: 2, available: true },
    { slot_id: 'SLOT-006', time: '15:00-17:00', capacity: 2, available: true }
  ],
  'CENTER-003': [
    { slot_id: 'SLOT-007', time: '08:00-10:00', capacity: 1, available: true },
    { slot_id: 'SLOT-008', time: '11:00-13:00', capacity: 2, available: true },
    { slot_id: 'SLOT-009', time: '17:00-19:00', capacity: 3, available: true }
  ]
};

/**
 * Get available slots for a service center on a given date
 */
function getAvailableSlots(centerId, date) {
  // Normalize center ID: convert underscore to hyphen for lookup
  const normalizedId = centerId.replace(/_/g, '-');
  const slots = SERVICE_CENTER_SLOTS[normalizedId] || [];
  if (slots.length === 0) {
    throw new Error(`Service center ${centerId} not found`);
  }
  
  return slots.map(slot => ({
    slot_id: slot.slot_id,
    center_id: centerId,
    date: date,
    time: slot.time,
    capacity: slot.capacity,
    available: slot.available
  }));
}

/**
 * Book a service appointment
 */
async function bookAppointment(vehicleId, slotId, centerId, customerName = 'Customer') {
  try {
    const bookingId = `BK_${uuidv4().substring(0, 8).toUpperCase()}`;
    const query = `
      INSERT INTO service_bookings 
      (booking_id, vehicle_id, center_id, slot_id, booking_date, status, customer_name, estimated_duration)
      VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      bookingId,
      vehicleId,
      centerId,
      slotId,
      'confirmed',
      customerName,
      '1-2 hours'
    ]);

    const booking = result.rows[0];
    return {
      booking_id: booking.booking_id,
      vehicle_id: booking.vehicle_id,
      customer_name: booking.customer_name,
      slot_id: booking.slot_id,
      center_id: booking.center_id,
      booking_date: booking.booking_date,
      status: booking.status,
      estimated_duration: booking.estimated_duration
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Get all bookings
 */
async function getAllBookings() {
  try {
    const query = `
      SELECT booking_id, vehicle_id, customer_name, slot_id, center_id, booking_date, status, estimated_duration
      FROM service_bookings
      ORDER BY booking_date DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Get bookings for a vehicle
 */
async function getBookingsByVehicleId(vehicleId) {
  try {
    const query = `
      SELECT booking_id, vehicle_id, customer_name, slot_id, center_id, booking_date, status, estimated_duration
      FROM service_bookings
      WHERE vehicle_id = $1
      ORDER BY booking_date DESC
    `;
    
    const result = await pool.query(query, [vehicleId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getAllBookings,
  getBookingsByVehicleId,
  SERVICE_CENTER_SLOTS
};

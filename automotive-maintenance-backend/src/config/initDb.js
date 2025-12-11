const pool = require('../config/database');

/**
 * Initialize database schema
 */
async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database schema...');

    // 1. Create vehicles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_id VARCHAR(50) UNIQUE NOT NULL,
        vehicle_name VARCHAR(200),
        registration_number VARCHAR(50),
        model_year INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        owner_name VARCHAR(200),
        customer_contact VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ vehicles table created');

    // 2. Create telemetry_stream table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS telemetry_stream (
        id BIGSERIAL PRIMARY KEY,
        vehicle_id VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        engine_temp FLOAT,
        brake_wear INTEGER,
        battery_voltage FLOAT,
        dtc_codes TEXT[],
        odometer INTEGER,
        fuel_level INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
      );
    `);
    console.log('✅ telemetry_stream table created');

    // Create index for fast time-series queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_time 
      ON telemetry_stream(vehicle_id, timestamp DESC);
    `);

    // 3. Create maintenance_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS maintenance_history (
        id SERIAL PRIMARY KEY,
        vehicle_id VARCHAR(50) NOT NULL,
        service_date DATE NOT NULL,
        component VARCHAR(100),
        issue TEXT,
        action_taken TEXT,
        status VARCHAR(20),
        technician VARCHAR(100),
        cost DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
      );
    `);
    console.log('✅ maintenance_history table created');

    // 4. Create service_bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_bookings (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        vehicle_id VARCHAR(50) NOT NULL,
        center_id VARCHAR(50),
        slot_id VARCHAR(50),
        booking_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'confirmed',
        customer_name VARCHAR(200),
        estimated_duration VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
      );
    `);
    console.log('✅ service_bookings table created');

    // 5. Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id BIGSERIAL PRIMARY KEY,
        notification_id VARCHAR(50) UNIQUE NOT NULL,
        vehicle_id VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        channel VARCHAR(20),
        status VARCHAR(20) DEFAULT 'sent',
        metadata JSONB,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
      );
    `);
    console.log('✅ notifications table created');

    // 6. Create ueba_events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ueba_events (
        id BIGSERIAL PRIMARY KEY,
        event_id VARCHAR(50) UNIQUE NOT NULL,
        agent_name VARCHAR(100),
        service_name VARCHAR(100),
        action VARCHAR(50),
        reason TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ ueba_events table created');

    // Create index for security queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ueba_blocked 
      ON ueba_events(action, timestamp DESC);
    `);

    // 7. Create rca_capa table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rca_capa (
        id SERIAL PRIMARY KEY,
        rca_id VARCHAR(50) UNIQUE NOT NULL,
        component_type VARCHAR(100),
        defect_description TEXT,
        root_cause TEXT,
        affected_vehicles_count INTEGER,
        capa_action TEXT,
        priority VARCHAR(20),
        target_completion DATE,
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ rca_capa table created');

    console.log('\n🎉 Database schema initialized successfully!\n');
    return true;

  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    return false;
  }
}

module.exports = { initializeDatabase };

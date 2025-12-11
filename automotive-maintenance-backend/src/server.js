const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { initializeDatabase } = require('./config/initDb');
const { migrateData } = require('./config/migrateData');

// Import routes
const telematicsRoutes = require('./routes/telematics');
const maintenanceRoutes = require('./routes/maintenance');
const schedulerRoutes = require('./routes/scheduler');
const notificationRoutes = require('./routes/notifications');
const orchestrationRoutes = require('./routes/orchestration');
const uebaRoutes = require('./routes/ueba');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/telematics', telematicsRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/scheduler', schedulerRoutes);
app.use('/notifications', notificationRoutes);
app.use('/orchestration', orchestrationRoutes);
app.use('/ueba', uebaRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    
    console.log('📤 Migrating data to PostgreSQL...');
    await migrateData();

    app.listen(PORT, () => {
      console.log(`\n🚗 Automotive Maintenance Backend running on http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔄 Orchestration flow: POST http://localhost:${PORT}/orchestration/run_flow`);
      console.log(`✅ PostgreSQL database connected\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;

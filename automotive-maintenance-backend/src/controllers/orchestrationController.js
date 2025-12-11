const { secureCall, getUEBASummary } = require('../middleware/ueba');
const telematicsService = require('../services/telemeticsService');
const maintenanceService = require('../services/maintenanceService');
const schedulerService = require('../services/schedulerService');
const notificationService = require('../services/notificationService');
const manufacturingService = require('../services/manufacturingService');

/**
 * Mock AI Predictive Models
 */
const predictiveModels = {
  diagnosisModel: (telematics, maintenance) => {
    const issues = [];
    let riskLevel = 'LOW';

    // Simulate diagnosis based on sensor data
    if (telematics.brake_wear > 80) {
      issues.push('Brake pads near end of life');
      riskLevel = 'HIGH';
    }
    if (telematics.engine_temp > 100) {
      issues.push('Engine temperature elevated');
      riskLevel = 'MEDIUM';
    }
    if (telematics.battery_voltage < 12) {
      issues.push('Battery voltage low');
      riskLevel = 'MEDIUM';
    }
    if (telematics.dtc_codes.length > 0) {
      issues.push(`${telematics.dtc_codes.length} diagnostic trouble codes detected`);
      riskLevel = 'HIGH';
    }

    // Check for recurring issues in maintenance history
    if (maintenance.length > 0) {
      const recentIssues = maintenance.slice(0, 2).map(m => m.issue);
      if (recentIssues.some(issue => issue.includes('Engine'))) {
        riskLevel = 'HIGH';
      }
    }

    return {
      risk_level: riskLevel || 'LOW',
      predicted_issues: issues.length > 0 ? issues : ['No major issues detected'],
      confidence: 0.85
    };
  },

  customerScript: (diagnosis) => {
    const scripts = {
      HIGH: "I've detected some important maintenance needs for your vehicle that require urgent attention. Your vehicle's current condition suggests potential safety concerns. I'd like to help you schedule a service appointment immediately to prevent any inconvenience.",
      MEDIUM: "Your vehicle has shown some signs of wear that we should address soon. I'd recommend scheduling a service appointment within the next week to keep your vehicle in optimal condition.",
      LOW: "Your vehicle is running well! Routine maintenance is coming up, so let's schedule a convenient service appointment for you."
    };
    return scripts[diagnosis.risk_level] || scripts.LOW;
  },

  manufacturingInsights: (telematics, rcaCapa) => {
    const insights = [];

    // Simulate insight generation
    if (telematics.engine_temp > 95) {
      insights.push({
        issue: 'Elevated engine temperatures detected',
        pattern: 'Recurring in 12% of Q4 fleet',
        recommendation: 'Review thermal management design for improvement',
        priority: 'HIGH'
      });
    }

    if (telematics.brake_wear > 75) {
      insights.push({
        issue: 'Accelerated brake wear patterns',
        pattern: 'Found in 8% of high-mileage vehicles',
        recommendation: 'Evaluate brake material composition and friction coefficients',
        priority: 'MEDIUM'
      });
    }

    return insights;
  }
};

/**
 * POST /orchestration/run_flow
 * Body: { vehicle_id, customer_name }
 */
async function runPredictiveFlow(req, res) {
  try {
    const { vehicle_id, customer_name = 'Customer' } = req.body;

    if (!vehicle_id) {
      return res.status(400).json({ error: 'vehicle_id is required' });
    }

    console.log(`\n🚀 Starting orchestration flow for vehicle: ${vehicle_id}`);

    // Step 1: Data Analysis Agent - Fetch telemetry
    console.log('📊 [DataAnalysis Agent] Fetching telemetry...');
    const telemetryResult = await secureCall(
      'DataAnalysis',
      'telematics',
      () => telematicsService.getTelemetryByVehicleId(vehicle_id)
    );

    if (telemetryResult.status !== 'success') {
      return res.status(404).json({
        error: `Vehicle ${vehicle_id} not found`,
        ueba_event_id: telemetryResult.eventId
      });
    }

    const telematics = telemetryResult.data;

    // Step 2: Data Analysis Agent - Fetch maintenance history
    console.log('📚 [DataAnalysis Agent] Fetching maintenance history...');
    const maintenanceResult = await secureCall(
      'DataAnalysis',
      'maintenance',
      () => maintenanceService.getMaintenanceHistoryByVehicleId(vehicle_id, 5)
    );

    const maintenance = maintenanceResult.status === 'success' ? maintenanceResult.data : [];

    // Step 3: Diagnosis Agent - Predict issues
    console.log('🔬 [Diagnosis Agent] Analyzing vehicle health...');
    const diagnosisResult = await secureCall(
      'Diagnosis',
      'telematics',
      () => Promise.resolve(predictiveModels.diagnosisModel(telematics, maintenance))
    );

    const diagnosis = diagnosisResult.data || { risk_level: 'LOW', predicted_issues: [] };

    // Step 4: Customer Engagement Agent - Generate script
    console.log('💬 [CustomerEngagement Agent] Generating engagement script...');
    const customerScript = predictiveModels.customerScript(diagnosis);

    // Step 5: Simulate customer decision
    // In real scenario, this would come from customer interaction
    const customerDecision = diagnosis.risk_level === 'LOW' ? 'defer' : 'schedule';

    let bookingConfirmation = null;

    // Step 6: Scheduling Agent - Book appointment if customer agrees
    if (customerDecision === 'schedule') {
      console.log('📅 [Scheduling Agent] Booking appointment...');
      
      const slotsResult = await secureCall(
        'Scheduling',
        'scheduler',
        () => {
          const slots = schedulerService.getAvailableSlots('CENTER_001', new Date().toISOString().split('T')[0]);
          return slots[0]; // Select first available slot
        }
      );

      if (slotsResult.status === 'success') {
        const bookingResult = await secureCall(
          'Scheduling',
          'scheduler',
          () => schedulerService.bookAppointment(
            vehicle_id,
            slotsResult.data.slot_id,
            'CENTER_001',
            customer_name
          )
        );

        bookingConfirmation = bookingResult.data;

        // Step 7: Send notification
        console.log('📱 [Scheduling Agent] Sending confirmation...');
        await secureCall(
          'Scheduling',
          'notifications',
          () => notificationService.sendPushNotification(
            vehicle_id,
            `Your service appointment is confirmed. Booking ID: ${bookingConfirmation.booking_id}`,
            'app'
          )
        );
      }
    }

    // Step 8: Manufacturing Insights Agent
    console.log('🏭 [ManufacturingInsights Agent] Analyzing manufacturing patterns...');
    const rcaCapaResult = await secureCall(
      'ManufacturingInsights',
      'maintenance',
      () => manufacturingService.analyzeRecurringDefects()
    );

    const manufacturingInsights = rcaCapaResult.data || [];
    const specificInsights = predictiveModels.manufacturingInsights(telematics, manufacturingInsights);

    // Step 9: Feedback collection setup
    console.log('⭐ [Feedback Agent] Setting up feedback collection...');
    const feedbackSetup = {
      feedback_id: `FB_${Date.now()}`,
      scheduled_at: bookingConfirmation ? new Date(Date.now() + 86400000).toISOString() : null,
      status: 'pending'
    };

    // Get UEBA summary
    const uebaAlerts = getUEBASummary();

    // Compile full flow result
    const flowResult = {
      orchestration_id: `ORK_${Date.now()}`,
      vehicle_id: vehicle_id,
      vehicle_name: telematics.vehicle_name,
      timestamp: new Date().toISOString(),
      
      // Telemetry
      telemetry: {
        engine_temp: telematics.engine_temp,
        brake_wear: telematics.brake_wear,
        battery_voltage: telematics.battery_voltage,
        dtc_codes: telematics.dtc_codes,
        odometer: telematics.odometer
      },

      // Diagnosis
      diagnosis: {
        risk_level: diagnosis.risk_level,
        predicted_issues: diagnosis.predicted_issues,
        confidence: diagnosis.confidence
      },

      // Customer Engagement
      customer_engagement: {
        customer_name: customer_name,
        engagement_script: customerScript,
        customer_decision: customerDecision
      },

      // Scheduling
      scheduling: bookingConfirmation ? {
        booking_id: bookingConfirmation.booking_id,
        slot_id: bookingConfirmation.slot_id,
        center_id: bookingConfirmation.center_id,
        booking_date: bookingConfirmation.booking_date,
        status: 'confirmed'
      } : {
        status: 'deferred',
        reason: 'Low risk - customer opted to defer'
      },

      // Manufacturing Insights
      manufacturing_insights: specificInsights,

      // Feedback
      feedback: feedbackSetup,

      // UEBA Security
      ueba_summary: {
        total_events: uebaAlerts.total_events,
        allowed_calls: uebaAlerts.allowed,
        blocked_calls: uebaAlerts.blocked,
        error_calls: uebaAlerts.errors,
        blocked_details: uebaAlerts.recent_blocks
      }
    };

    res.status(200).json({
      success: true,
      data: flowResult,
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Orchestration flow completed for vehicle: ${vehicle_id}\n`);

  } catch (error) {
    console.error('❌ Orchestration error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * GET /orchestration/ueba-summary
 */
async function getUEBASummaryEndpoint(req, res) {
  try {
    const summary = getUEBASummary();

    res.status(200).json({
      success: true,
      ueba_summary: summary,
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
  runPredictiveFlow,
  getUEBASummaryEndpoint
};

const Prediction = require('../models/Prediction');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Get live tsunami risk status and buoy monitoring telemetry.
 * Endpoint: GET /api/tsunami/live
 */
const getLiveTsunamiStatus = (req, res, next) => {
  try {
    const buoyStatus = {
      alert_level: 'NORMAL',
      tsunami_warning_active: false,
      oceanic_earthquake_detected: false,
      seismic_magnitude: 4.1,
      epicenter_distance_km: 420,
      deep_ocean_buoy_pressure: '1013.25 hPa',
      wave_amplitude_meters: 0.35,
      last_updated: new Date().toISOString(),
    };

    return successResponse(res, buoyStatus);
  } catch (error) {
    next(error);
  }
};

/**
 * Perform custom tsunami risk assessment based on magnitude and depth.
 * Endpoint: POST /api/tsunami/assess
 */
const assessTsunamiRisk = async (req, res, next) => {
  try {
    const { earthquake_magnitude, epicenter_depth_km, distance_to_coast_km } = req.body;

    if (!earthquake_magnitude || !epicenter_depth_km) {
      return errorResponse(res, 'earthquake_magnitude and epicenter_depth_km are required', 400);
    }

    const mag = parseFloat(earthquake_magnitude);
    const depth = parseFloat(epicenter_depth_km);
    const distance = parseFloat(distance_to_coast_km || 100);

    let riskLevel = 'LOW';
    let probability = 10.0;
    let alertMessage = 'No immediate tsunami threat detected.';

    if (mag >= 7.5 && depth <= 70) {
      riskLevel = 'HIGH';
      probability = 92.5;
      alertMessage = 'HIGH TSUNAMI RISK: Severe undersea earthquake detected. Immediate coastal evacuation advisory!';
    } else if (mag >= 6.5 && depth <= 100) {
      riskLevel = 'MEDIUM';
      probability = 58.4;
      alertMessage = 'MODERATE TSUNAMI RISK: Monitor official maritime security channels.';
    }

    const assessmentResult = {
      risk_level: riskLevel,
      probability: probability,
      alert_message: alertMessage,
      parameters: {
        earthquake_magnitude: mag,
        epicenter_depth_km: depth,
        distance_to_coast_km: distance,
      },
      timestamp: new Date().toISOString(),
    };

    await Prediction.saveRecord({
      type: 'TSUNAMI_ASSESSMENT',
      inputParameters: assessmentResult.parameters,
      prediction: alertMessage,
      probability: probability,
      riskLevel: riskLevel,
    });

    return successResponse(res, assessmentResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLiveTsunamiStatus,
  assessTsunamiRisk,
};

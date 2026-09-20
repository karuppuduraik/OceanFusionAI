const OceanService = require('../services/oceanService');
const { successResponse } = require('../utils/responseHandler');

/**
 * Controller to fetch live ocean metrics.
 * Endpoint: GET /api/ocean/live
 */
const getLiveOcean = (req, res, next) => {
  try {
    const oceanData = OceanService.getLiveOceanData();

    return successResponse(res, {
      sea_surface_temperature: oceanData.sea_surface_temperature,
      wave_height: oceanData.wave_height,
      sea_level: oceanData.sea_level,
      ocean_current: oceanData.ocean_current,
      unit: oceanData.unit,
      status: oceanData.status,
      timestamp: oceanData.timestamp,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLiveOcean,
};

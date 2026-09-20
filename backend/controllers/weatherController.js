const WeatherService = require('../services/weatherService');
const { successResponse } = require('../utils/responseHandler');

/**
 * Controller to fetch live operational weather metrics.
 * Endpoint: GET /api/weather/live
 */
const getLiveWeather = (req, res, next) => {
  try {
    const weatherData = WeatherService.getLiveWeather();
    
    // Return standard response matching required API specification
    return successResponse(res, {
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      pressure: weatherData.pressure,
      wind_speed: weatherData.wind_speed,
      unit: weatherData.unit,
      timestamp: weatherData.timestamp,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLiveWeather,
};

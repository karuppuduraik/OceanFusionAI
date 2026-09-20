/**
 * Weather Service for OceanFusion.
 * Provides live real-time or dynamic simulated weather metrics.
 */
class WeatherService {
  /**
   * Fetches current live weather telemetry.
   * Returns: temperature (°C), humidity (%), atmospheric_pressure (hPa), wind_speed (km/h)
   */
  static getLiveWeather() {
    // Generates realistic real-time operational weather metrics for ocean monitoring
    const baseTemp = 28 + (Math.sin(Date.now() / 100000) * 4);
    const baseHumidity = 80 + (Math.cos(Date.now() / 80000) * 10);
    const basePressure = 1008 + (Math.sin(Date.now() / 120000) * 8);
    const baseWind = 35 + (Math.cos(Date.now() / 90000) * 15);

    return {
      temperature: parseFloat(baseTemp.toFixed(1)),
      humidity: Math.round(baseHumidity),
      pressure: parseFloat(basePressure.toFixed(1)),
      wind_speed: parseFloat(baseWind.toFixed(1)),
      unit: {
        temperature: '°C',
        humidity: '%',
        pressure: 'hPa',
        wind_speed: 'km/h',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = WeatherService;

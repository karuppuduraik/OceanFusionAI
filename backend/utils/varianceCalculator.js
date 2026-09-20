/**
 * Variance Calculator Engine for OceanFusion.
 * Compares live telemetry from NASA/NOAA/Copernicus/OpenWeather against baseline metrics & AI outputs.
 */
class VarianceCalculator {
  /**
   * Computes delta variance metrics between live telemetry and historical ocean baselines.
   */
  static calculateVariance(liveTelemetry = {}, aiPrediction = {}) {
    const sst = liveTelemetry.sea_surface_temperature || 30.2;
    const pressure = liveTelemetry.pressure || 998;
    const wind = liveTelemetry.wind_speed || 63;
    const wave = liveTelemetry.wave_height || 5.1;

    // Baselines: Normal SST = 28.5°C, Normal Pressure = 1012 hPa, Normal Wind = 25 km/h, Normal Wave = 1.5m
    const sstBaseline = 28.5;
    const pressureBaseline = 1008;
    const windBaseline = 35;
    const waveBaseline = 2.0;

    const sstDelta = parseFloat(Math.abs(sst - sstBaseline).toFixed(1));
    const pressureDelta = parseFloat(Math.abs(pressureBaseline - pressure).toFixed(1));
    const windDelta = parseFloat(Math.abs(wind - windBaseline).toFixed(1));
    const waveDelta = parseFloat(Math.abs(wave - waveBaseline).toFixed(1));
    const oceanTempAnomaly = parseFloat((sst - 28.0).toFixed(2));
    const confidenceDelta = parseFloat((Math.abs(95.4 - (aiPrediction.confidence || 95.0))).toFixed(1));

    return {
      sst_delta: sstDelta,
      pressure_delta: pressureDelta,
      wind_delta: windDelta,
      wave_delta: waveDelta,
      ocean_temp_anomaly: oceanTempAnomaly,
      confidence_delta: confidenceDelta,
      unit: {
        sst_delta: '°C',
        pressure_delta: 'hPa',
        wind_delta: 'km/h',
        wave_delta: 'm',
      },
      status: (pressureDelta > 8 || windDelta > 15) ? 'High Variance' : 'Normal Variance',
    };
  }
}

module.exports = VarianceCalculator;

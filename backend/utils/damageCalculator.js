/**
 * Coastal Damage & Disaster Impact Estimation Calculator for OceanFusion.
 * Calculates storm surge height, damage index score (0-100), population risk, and evacuation advisories.
 */
class DamageCalculator {
  /**
   * Calculates comprehensive coastal impact and damage estimates.
   */
  static calculateDamage(liveTelemetry = {}, aiPrediction = {}) {
    const windSpeed = liveTelemetry.wind_speed || aiPrediction.wind_speed || 63;
    const waveHeight = liveTelemetry.wave_height || 5.1;
    const pressure = liveTelemetry.pressure || 998;
    const cycloneProb = aiPrediction.cyclone_probability || aiPrediction.probability || 95.4;

    // 1. Determine Cyclone Intensity Category
    let category = 'Tropical Depression';
    if (windSpeed >= 165) category = 'Category 5';
    else if (windSpeed >= 135) category = 'Category 4';
    else if (windSpeed >= 108) category = 'Category 3';
    else if (windSpeed >= 85) category = 'Category 2';
    else if (windSpeed >= 62) category = 'Category 1';

    // 2. Compute Storm Surge (Meters above Mean Sea Level)
    const pressureDrop = Math.max(0, 1013 - pressure);
    const stormSurgeMeters = parseFloat((0.15 * pressureDrop + waveHeight * 0.45).toFixed(1));

    // 3. Compute Damage Index Score (0 to 100 Scale)
    let rawDamageScore = (windSpeed * 0.4) + (stormSurgeMeters * 8.5) + (cycloneProb * 0.25);
    const damageIndex = Math.min(100, Math.max(5, Math.round(rawDamageScore)));

    // 4. Determine Population & Infrastructure Risk Levels
    let populationRisk = 'Low';
    let infrastructureRisk = 'Low';
    let evacuationNeeded = false;

    if (damageIndex >= 75 || stormSurgeMeters >= 4.0 || category.includes('Category 3') || category.includes('Category 4') || category.includes('Category 5')) {
      populationRisk = 'Critical';
      infrastructureRisk = 'High';
      evacuationNeeded = true;
    } else if (damageIndex >= 50 || stormSurgeMeters >= 2.5) {
      populationRisk = 'High';
      infrastructureRisk = 'Moderate';
      evacuationNeeded = true;
    } else if (damageIndex >= 30) {
      populationRisk = 'Moderate';
      infrastructureRisk = 'Low';
      evacuationNeeded = false;
    }

    return {
      damage_index: damageIndex,
      storm_surge: stormSurgeMeters,
      population_risk: populationRisk,
      infrastructure_risk: infrastructureRisk,
      evacuation: evacuationNeeded,
      cyclone_category: category,
      estimated_wind_speed: windSpeed,
      wave_height_risk: waveHeight > 4.0 ? 'Severe' : waveHeight > 2.5 ? 'High' : 'Moderate',
      flood_risk: stormSurgeMeters > 3.0 ? 'Extreme' : 'Moderate',
      confidence: parseFloat((aiPrediction.confidence || 94.8).toFixed(1)),
    };
  }
}

module.exports = DamageCalculator;

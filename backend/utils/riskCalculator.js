/**
 * Multi-Hazard Disaster Risk Calculator for OceanFusion.
 */
class RiskCalculator {
  static computeOverallRisk(sst, wind, wave, pressure) {
    let riskScore = 0;
    if (sst >= 29.5) riskScore += 25;
    if (wind >= 50) riskScore += 35;
    if (wave >= 3.0) riskScore += 25;
    if (pressure <= 1004) riskScore += 15;

    let alertLevel = 'NORMAL';
    if (riskScore >= 75) alertLevel = 'CRITICAL';
    else if (riskScore >= 45) alertLevel = 'WARNING';
    else if (riskScore >= 25) alertLevel = 'WATCH';

    return {
      score: riskScore,
      level: alertLevel,
    };
  }
}

module.exports = RiskCalculator;

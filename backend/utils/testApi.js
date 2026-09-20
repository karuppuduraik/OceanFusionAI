const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_BASE = 'http://localhost:5000/api';

async function runApiTests() {
  console.log('====================================================');
  console.log(' Running Complete OceanFusion API Test Suite...');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function testEndpoint(name, testFn) {
    try {
      console.log(`[TEST] ${name}...`);
      await testFn();
      console.log(` -> PASSED [✓]\n`);
      passed++;
    } catch (err) {
      console.error(` -> FAILED [✗]: ${err.message}`);
      if (err.response) {
        console.error('    Status:', err.response.status);
        console.error('    Data:', JSON.stringify(err.response.data));
      }
      console.log('');
      failed++;
    }
  }

  // 1. Weather API
  await testEndpoint('GET /api/weather/live', async () => {
    const res = await axios.get(`${API_BASE}/weather/live`);
    if (res.status !== 200 || !res.data.temperature || !res.data.humidity) {
      throw new Error('Invalid response structure for /weather/live');
    }
    console.log('    Response Data:', JSON.stringify(res.data));
  });

  // 2. Ocean API
  await testEndpoint('GET /api/ocean/live', async () => {
    const res = await axios.get(`${API_BASE}/ocean/live`);
    if (res.status !== 200 || !res.data.sea_surface_temperature || !res.data.wave_height) {
      throw new Error('Invalid response structure for /ocean/live');
    }
    console.log('    Response Data:', JSON.stringify(res.data));
  });

  // 3. Tsunami Status & Risk API
  await testEndpoint('GET /api/tsunami/live', async () => {
    const res = await axios.get(`${API_BASE}/tsunami/live`);
    if (res.status !== 200 || !res.data.alert_level) {
      throw new Error('Invalid response structure for /tsunami/live');
    }
    console.log('    Response Data:', JSON.stringify(res.data));
  });

  // 4. Dashboard API
  await testEndpoint('GET /api/dashboard', async () => {
    const res = await axios.get(`${API_BASE}/dashboard`);
    if (res.status !== 200 || !res.data.weather || !res.data.ocean) {
      throw new Error('Invalid response structure for /dashboard');
    }
    console.log('    Response Data (Summary):', JSON.stringify({
      overall_risk: res.data.system_status.overall_risk_level,
      weather_temp: res.data.weather.temperature,
      ocean_sst: res.data.ocean.sea_surface_temperature
    }));
  });

  // 5. Realtime Compare & Damage Estimation Analytics API
  await testEndpoint('GET /api/analytics/realtime-compare', async () => {
    const res = await axios.get(`${API_BASE}/analytics/realtime-compare`);
    if (
      res.status !== 200 ||
      !res.data.live_nasa_telemetry ||
      !res.data.ai_model_prediction ||
      !res.data.variance_analysis ||
      !res.data.damage_estimation
    ) {
      throw new Error('Invalid response structure for /analytics/realtime-compare');
    }
    console.log('    Response Data:', JSON.stringify(res.data, null, 2));
  });

  // 6. Numerical Cyclone Prediction API
  await testEndpoint('POST /api/predict/cyclone (Valid Data)', async () => {
    const payload = {
      sea_surface_temperature: 30,
      atmospheric_pressure: 1005,
      wind_speed: 42,
      humidity: 84,
      latitude: 13.2,
      longitude: 82.5,
      ocean_depth: 3200,
      vorticity: 4.2,
      wind_shear: 18,
      proximity_to_coastline: 260,
      pre_existing_disturbance: 1,
    };
    const res = await axios.post(`${API_BASE}/predict/cyclone`, payload);
    if (res.status !== 200 || !res.data.prediction || res.data.probability === undefined) {
      throw new Error('Invalid response structure for /predict/cyclone');
    }
    console.log('    Response Data:', JSON.stringify(res.data));
  });

  // Validation Rejection Test
  await testEndpoint('POST /api/predict/cyclone (Invalid Data - Should return 400)', async () => {
    try {
      await axios.post(`${API_BASE}/predict/cyclone`, {
        sea_surface_temperature: 'invalid_string',
      });
      throw new Error('Expected validation error 400, but request succeeded');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log('    Correctly rejected invalid input with 400 Bad Request.');
      } else {
        throw err;
      }
    }
  });

  // 7. Satellite Image Cyclone Prediction API
  await testEndpoint('POST /api/predict/image', async () => {
    const dummyImagePath = path.join(__dirname, 'test_satellite.png');
    const dummyPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(dummyImagePath, dummyPngBuffer);

    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(dummyImagePath), 'test_satellite.png');

      const res = await axios.post(`${API_BASE}/predict/image`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (res.status !== 200 || !res.data.category || !res.data.wind_speed) {
        throw new Error('Invalid response structure for /predict/image');
      }
      console.log('    Response Data:', JSON.stringify(res.data));
    } finally {
      if (fs.existsSync(dummyImagePath)) {
        fs.unlinkSync(dummyImagePath);
      }
    }
  });

  console.log('====================================================');
  console.log(` API TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runApiTests();
}

module.exports = runApiTests;

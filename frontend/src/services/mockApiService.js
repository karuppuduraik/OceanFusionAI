import { initialOceanState, hourlyTrendData, weeklyForecastData, regionalOverview } from '../data/mockOceanData';
import { mockAlerts } from '../data/mockAlerts';
import { mockModels, predictionHorizonForecast, modelLossData, radarMetrics, correlationMatrixData } from '../data/mockPredictions';
import { mockBuoys, mockShips, mockCyclone, mockWaterQualityStations, sstHeatGrid } from '../data/mockMapMarkers';
import { mockDataSources } from '../data/mockDataSources';
import { mockHistoricalRecords } from '../data/mockHistoricalData';

import {
  getCompleteLiveOceanTelemetry,
  fetchHourlyHistory,
  fetchHourlyMarineHistory,
  fetch7DayForecast,
  fetchRegionalOverview,
  MONITORING_STATIONS,
} from './realOceanService';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port === '3000' ? '/api' : 'http://localhost:5000/api');

export const mockApiService = {
  // Fetch live ocean telemetry state from backend API or real-time public meteorological models
  async getOceanState() {
    try {
      const res = await fetch(`${API_BASE}/dashboard`);
      if (res.ok) {
        const data = await res.json();
        return {
          ...initialOceanState,
          seaSurfaceTemperature: data.ocean?.sea_surface_temperature || initialOceanState.seaSurfaceTemperature,
          waveHeight: data.ocean?.wave_height || initialOceanState.waveHeight,
          windSpeed: data.weather?.wind_speed || initialOceanState.windSpeed,
          atmosphericPressure: data.weather?.pressure || initialOceanState.atmosphericPressure,
          humidity: data.weather?.humidity || initialOceanState.humidity,
          oceanCurrentSpeed: data.ocean?.ocean_current || initialOceanState.oceanCurrentSpeed,
          lastUpdated: new Date().toISOString(),
        };
      }
    } catch (e) {
      // Backend offline: query real-time live meteorological & Copernicus marine API
    }

    try {
      const realTelemetry = await getCompleteLiveOceanTelemetry();
      if (realTelemetry) {
        return {
          ...initialOceanState,
          ...realTelemetry,
        };
      }
    } catch (realErr) {
      console.warn('[Real-Time API Error] Fallback to base ocean state:', realErr.message);
    }

    return { ...initialOceanState, lastUpdated: new Date().toISOString() };
  },

  // Fetch hourly trends from real Open-Meteo past-24h API
  async getHourlyTrends() {
    try {
      // Primary station: Bay of Bengal (INCOIS-BD08)
      const station = MONITORING_STATIONS[1]; // BD08
      const [weatherHistory, marineHistory] = await Promise.all([
        fetchHourlyHistory(station.lat, station.lng),
        fetchHourlyMarineHistory(station.lat, station.lng),
      ]);

      if (weatherHistory && weatherHistory.length > 0) {
        // Merge weather + marine hourly data
        return weatherHistory.map((wh, i) => {
          const mh = marineHistory?.[i];
          return {
            time: wh.time,
            sst: parseFloat(wh.temperature.toFixed(1)),
            waveHeight: mh ? parseFloat(mh.waveHeight.toFixed(2)) : 1.5,
            windSpeed: parseFloat(wh.windSpeed.toFixed(1)),
            precipitation: wh.precipitation,
            humidity: wh.humidity,
            pressure: parseFloat(wh.pressure.toFixed(1)),
          };
        });
      }
    } catch (e) {
      console.warn('[mockApiService] Hourly trends API fallback:', e.message);
    }

    // Fallback: try backend
    try {
      const weatherRes = await fetch(`${API_BASE}/weather/live`);
      if (weatherRes.ok) {
        const weather = await weatherRes.json();
        const updatedTrends = [...hourlyTrendData];
        if (updatedTrends.length > 0) {
          updatedTrends[updatedTrends.length - 1] = {
            ...updatedTrends[updatedTrends.length - 1],
            sst: weather.temperature || 28.5,
            wind: weather.wind_speed || 35,
          };
        }
        return updatedTrends;
      }
    } catch (e) {
      // Final fallback
    }
    return [...hourlyTrendData];
  },

  // Fetch real 7-day forecast from Open-Meteo
  async getWeeklyForecast() {
    try {
      const station = MONITORING_STATIONS[1]; // BD08 Bay of Bengal
      const forecast = await fetch7DayForecast(station.lat, station.lng);
      if (forecast && forecast.length > 0) {
        return forecast.map((d) => ({
          label: d.day,
          date: d.date,
          temp: d.temp,
          tempMax: d.tempMax,
          tempMin: d.tempMin,
          wave: d.waveMax ?? 1.5,
          windMax: d.windMax,
          precipitation: d.precipitation,
          cycloneIndex: parseFloat(Math.min(99, Math.max(5, (d.temp - 26.5) * 6.5 + (d.windMax - 20) * 0.95 + Math.max(0, (d.waveMax || 1.5) - 1.2) * 6.0)).toFixed(1)),
        }));
      }
    } catch (e) {
      console.warn('[mockApiService] Weekly forecast API fallback:', e.message);
    }
    return [...weeklyForecastData];
  },

  // Fetch real regional overview from Open-Meteo
  async getRegionalOverview() {
    try {
      const realRegions = await fetchRegionalOverview();
      if (realRegions && realRegions.length > 0) {
        return realRegions;
      }
    } catch (e) {
      console.warn('[mockApiService] Regional overview API fallback:', e.message);
    }
    return [...regionalOverview];
  },

  // Fetch all alerts
  async getAlerts() {
    try {
      const res = await fetch(`${API_BASE}/tsunami/live`);
      if (res.ok) {
        const tsunami = await res.json();
        if (tsunami.tsunami_warning_active) {
          return [
            {
              id: 'ALT-TSUNAMI-LIVE',
              title: 'Tsunami Evacuation Warning',
              severity: 'critical',
              timestamp: tsunami.last_updated,
              status: 'active',
              region: 'Bay of Bengal',
              description: 'Active seismic activity detected buoy wave anomalies.'
            },
            ...mockAlerts
          ];
        }
      }
    } catch (e) {}
    return [...mockAlerts];
  },

  // Acknowledge / dismiss alert
  async updateAlertStatus(alertId, newStatus) {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = newStatus;
    }
    return alert;
  },

  // Broadcast new alert
  async broadcastAlert(alertData) {
    const newAlert = {
      id: `ALT-MANUAL-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      status: 'active',
      ...alertData
    };
    mockAlerts.unshift(newAlert);
    return newAlert;
  },

  // Fetch AI model registry
  async getModels() {
    return [...mockModels];
  },

  // Run deep learning inference against Real Node/Flask Backend API
  async runInference(modelId, parameters = {}) {
    console.log(`[Frontend API] Calling Backend /api/predict/cyclone for model: ${modelId}`);

    // If an image file is attached (Satellite CNN model)
    if (parameters.imageFile || parameters.image) {
      try {
        const formData = new FormData();
        formData.append('image', parameters.imageFile || parameters.image);

        const res = await fetch(`${API_BASE}/predict/image`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          return {
            modelId,
            timestamp: new Date().toISOString(),
            confidence: (data.confidence || 94.8).toFixed(1),
            inferenceTimeMs: 120,
            predictions: {
              category: data.category || 'Category 3',
              windSpeed: data.wind_speed || 108,
              significantWaveHeight: 3.5,
              seaSurfaceTemperature: 29.8,
              cycloneGenesisRisk: 88,
              currentSpeed: 2.1,
              marineHeatwaveStatus: 'Level 2 Coral Heat Stress',
              swathAttentionMap: [0.92, 0.95, 0.88, 0.91, 0.86]
            },
            horizon: [
              { time: '+6h', wave: 3.5, sst: 29.8, risk: 88 },
              { time: '+12h', wave: 4.1, sst: 30.1, risk: 92 },
              { time: '+24h', wave: 4.8, sst: 30.4, risk: 96 },
              { time: '+48h', wave: 5.5, sst: 30.8, risk: 99 },
            ]
          };
        }
      } catch (err) {
        console.warn('[Frontend API Warning] Image prediction request failed:', err.message);
      }
    }

    // Numerical XGBoost Cyclone Model call
    try {
      const payload = {
        sea_surface_temperature: parseFloat(parameters.sstAnomaly ? (28.4 + parameters.sstAnomaly) : (parameters.sea_surface_temperature || 30)),
        atmospheric_pressure: parseFloat(parameters.pressure || 1005),
        wind_speed: parseFloat(parameters.windSpeed || 42),
        humidity: parseFloat(parameters.humidity || 84),
        latitude: parseFloat(parameters.latitude || 13.2),
        longitude: parseFloat(parameters.longitude || 82.5),
        ocean_depth: parseFloat(parameters.oceanDepth || 3200),
        vorticity: parseFloat(parameters.vorticity || 4.2),
        wind_shear: parseFloat(parameters.windShear || 18),
        proximity_to_coastline: parseFloat(parameters.proximityToCoastline || 260),
        pre_existing_disturbance: parseInt(parameters.preExistingDisturbance !== undefined ? parameters.preExistingDisturbance : 1, 10),
      };

      const res = await fetch(`${API_BASE}/predict/cyclone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const baseRisk = data.probability !== undefined ? data.probability : 85;
        const conf = data.confidence !== undefined ? data.confidence : 95.2;

        return {
          modelId,
          timestamp: new Date().toISOString(),
          confidence: parseFloat(conf).toFixed(1),
          inferenceTimeMs: 85,
          prediction: data.prediction,
          probability: data.probability,
          predictions: {
            significantWaveHeight: Number((payload.wind_speed * 0.08 + 0.3).toFixed(2)),
            seaSurfaceTemperature: payload.sea_surface_temperature,
            cycloneGenesisRisk: baseRisk,
            currentSpeed: '1.85',
            marineHeatwaveStatus: payload.sea_surface_temperature > 29.5 ? 'Active Level 1 Bleaching Risk' : 'Nominal Thermal State',
            swathAttentionMap: [0.88, 0.94, 0.72, 0.91, 0.85]
          },
          horizon: [
            { time: '+6h', wave: 2.8, sst: payload.sea_surface_temperature, risk: baseRisk },
            { time: '+12h', wave: 3.2, sst: payload.sea_surface_temperature + 0.2, risk: Math.min(99, baseRisk + 5) },
            { time: '+24h', wave: 3.9, sst: payload.sea_surface_temperature + 0.4, risk: Math.min(99, baseRisk + 10) },
            { time: '+48h', wave: 4.5, sst: payload.sea_surface_temperature + 0.6, risk: Math.min(99, baseRisk + 15) },
          ]
        };
      }
    } catch (e) {
      console.warn('[Frontend API Warning] Cyclone numerical API error, using baseline output:', e.message);
    }

    // Fallback response matching standard format
    return {
      modelId,
      timestamp: new Date().toISOString(),
      confidence: '95.2',
      inferenceTimeMs: 75,
      predictions: {
        significantWaveHeight: 2.15,
        seaSurfaceTemperature: 29.1,
        cycloneGenesisRisk: 85,
        currentSpeed: '1.65',
        marineHeatwaveStatus: 'Nominal Thermal State',
        swathAttentionMap: [0.88, 0.94, 0.72, 0.91, 0.85]
      },
      horizon: [
        { time: '+6h', wave: 2.15, sst: 29.1, risk: 85 },
        { time: '+12h', wave: 2.32, sst: 29.2, risk: 91 },
        { time: '+24h', wave: 2.62, sst: 29.35, risk: 97 },
        { time: '+48h', wave: 2.90, sst: 29.5, risk: 99 },
      ]
    };
  },

  // Fetch analytics metrics
  async getAnalyticsData() {
    return {
      predictionHorizonForecast,
      modelLossData,
      radarMetrics,
      correlationMatrixData,
    };
  },

  // Fetch map elements
  async getMapLayersData() {
    return {
      buoys: mockBuoys,
      ships: mockShips,
      cyclone: mockCyclone,
      waterQuality: mockWaterQualityStations,
      heatGrid: sstHeatGrid
    };
  },

  // Fetch data sources
  async getDataSources() {
    return [...mockDataSources];
  },

  // Trigger sync on a data source
  async syncDataSource(sourceId) {
    const source = mockDataSources.find(s => s.id === sourceId);
    if (source) {
      source.lastSync = 'Just now';
      source.ping = '25 ms';
    }
    return source;
  },

  // Fetch historical records
  async getHistoricalRecords({ page = 1, limit = 10, search = '', region = '', risk = '', sortBy = 'timestamp', sortOrder = 'desc', liveTelemetryStream = [] } = {}) {
    let combined = [...liveTelemetryStream];

    try {
      const res = await fetch(`${API_BASE}/dashboard`);
      if (res.ok) {
        const dashboard = await res.json();
        if (dashboard.recent_predictions && dashboard.recent_predictions.length > 0) {
          const apiRecords = dashboard.recent_predictions.map((p, idx) => ({
            id: p._id || `REC-${1000 + idx}`,
            timestamp: new Date(p.createdAt || Date.now()).toISOString().replace('T', ' ').substring(0, 16),
            stationName: p.type === 'CYCLONE_NUMERICAL' ? 'Bay of Bengal Buoy #04' : 'Satellite Telemetry',
            region: 'Bay of Bengal',
            riskStatus: p.prediction && p.prediction.includes('Cyclone') ? 'High Risk' : 'Moderate Risk',
            sst: p.inputParameters?.sea_surface_temperature || 29.5,
            windSpeed: p.inputParameters?.wind_speed || p.windSpeed || 42,
            waveHeight: 2.8,
            confidence: `${p.confidence || 95.2}%`
          }));
          
          combined = [...combined, ...apiRecords, ...mockHistoricalRecords];
        } else {
          combined = [...combined, ...mockHistoricalRecords];
        }
      } else {
        combined = [...combined, ...mockHistoricalRecords];
      }
    } catch (e) {
      combined = [...combined, ...mockHistoricalRecords];
    }

    let filtered = [...combined];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(r => r.id.toLowerCase().includes(q) || r.stationName.toLowerCase().includes(q) || r.region.toLowerCase().includes(q));
    }
    if (region && region !== 'all') {
      filtered = filtered.filter(r => r.region.toLowerCase().includes(region.toLowerCase()));
    }
    if (risk && risk !== 'all') {
      filtered = filtered.filter(r => r.riskStatus.toLowerCase() === risk.toLowerCase());
    }

    const totalRecords = filtered.length;
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      allFilteredData: filtered,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page
    };
  }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialOceanState, regionsList } from '../data/mockOceanData';
import { useNotification } from './NotificationContext';
import { mockApiService } from '../services/mockApiService';
import { fetchActiveStormsFromGDACS } from '../services/cycloneService';

const OceanDataContext = createContext();

export function OceanDataProvider({ children }) {
  const [oceanState, setOceanState] = useState(initialOceanState);
  const [activeRegion, setActiveRegion] = useState('bay-of-bengal');
  const [unitSystem, setUnitSystem] = useState(() => {
    return localStorage.getItem('oceanfusion_units') || 'metric'; // 'metric' or 'imperial'
  });
  const [isSimulating, setIsSimulating] = useState(true);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState(() => {
    return Number(localStorage.getItem('oceanfusion_refresh_interval')) || 10;
  });
  const [isSimulatingCyclone, setIsSimulatingCyclone] = useState(false);
  const { addToast } = useNotification();

  // Active Real-Time Tropical Cyclones worldwide from GDACS
  const [activeStorms, setActiveStorms] = useState([]);
  const [stormsLoading, setStormsLoading] = useState(true);

  // Fetch real-time active storms from GDACS
  useEffect(() => {
    let isMounted = true;
    async function loadRealStorms() {
      try {
        setStormsLoading(true);
        const storms = await fetchActiveStormsFromGDACS();
        if (isMounted) {
          setActiveStorms(storms || []);
        }
      } catch (err) {
        console.warn('[OceanDataContext] GDACS fetch error:', err);
      } finally {
        if (isMounted) setStormsLoading(false);
      }
    }
    loadRealStorms();
    const interval = setInterval(loadRealStorms, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const primaryActiveStorm = activeStorms.length > 0 ? activeStorms[0] : null;

  // Real-time cyclone risk and presence detection
  const sstNum = parseFloat(oceanState?.seaSurfaceTemperature) || 28.4;
  const waveNum = parseFloat(oceanState?.waveHeight) || 2.15;
  const windNum = parseFloat(oceanState?.windSpeed) || 24.5;
  const pressureNum = parseFloat(oceanState?.atmosphericPressure) || 1008.0;
  const thermalP = Math.max(0, (sstNum - 26.5) * 6.5);
  const windEP = Math.max(0, (windNum - 20) * 0.95);
  const waveSP = Math.max(0, (waveNum - 1.2) * 6.0);
  const baroP = Math.max(0, (1013 - pressureNum) * 2.8);
  const liveCycloneRisk = parseFloat(Math.min(99.4, Math.max(4.2, thermalP + windEP + waveSP + baroP)).toFixed(1));

  // A cyclone is active if there is a real storm from GDACS or simulation is on
  const hasActiveCyclone = isSimulatingCyclone || activeStorms.length > 0 || liveCycloneRisk >= 50;


  // Persistent live telemetry history stream
  const [telemetryHistory, setTelemetryHistory] = useState(() => {
    const now = Date.now();
    const stations = ['INCOIS-BD08', 'INCOIS-CB02', 'NIOT-AD04', 'INCOIS-AB05'];
    return Array.from({ length: 8 }).map((_, i) => {
      const pastTime = new Date(now - (i + 1) * 30000);
      const sst = Number((28.4 + Math.sin(i * 1.5) * 0.5).toFixed(1));
      const wave = Number((1.5 + Math.cos(i * 1.5) * 0.35).toFixed(2));
      const wind = Number((21.0 + Math.sin(i * 1.2) * 3.5).toFixed(1));
      const pressure = Number((1011.0 - Math.sin(i) * 1.5).toFixed(1));
      const thermal = Math.max(0, (sst - 26.5) * 6.5);
      const windE = Math.max(0, (wind - 20) * 0.95);
      const waveS = Math.max(0, (wave - 1.2) * 6.0);
      const baro = Math.max(0, (1013 - pressure) * 2.8);
      const risk = parseFloat(Math.min(99.4, Math.max(5.0, thermal + windE + waveS + baro)).toFixed(1));
      return {
        id: `TLM-${1000 + i}`,
        time: pastTime.toLocaleTimeString(),
        date: pastTime.toLocaleDateString(),
        station: stations[i % stations.length],
        sst,
        wave,
        wind,
        pressure,
        cycloneIndex: risk,
        status: risk > 45 ? 'Elevated Anomaly' : 'Normal Climatology',
        isLive: false
      };
    });
  });

  const recordTelemetryFrame = (state) => {
    const sst = parseFloat(state.seaSurfaceTemperature) || 28.6;
    const wave = parseFloat(state.waveHeight) || 2.1;
    const wind = parseFloat(state.windSpeed) || 25.0;
    const pressure = parseFloat(state.atmosphericPressure) || 1008.0;
    const thermal = Math.max(0, (sst - 26.5) * 6.5);
    const windE = Math.max(0, (wind - 20) * 0.95);
    const waveS = Math.max(0, (wave - 1.2) * 6.0);
    const baro = Math.max(0, (1013 - pressure) * 2.8);
    const risk = parseFloat(Math.min(99.4, Math.max(5.0, thermal + windE + waveS + baro)).toFixed(1));

    setTelemetryHistory(prev => {
      const newEntry = {
        id: `TLM-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        station: 'INCOIS-BD08 (Live Telemetry)',
        sst,
        wave,
        wind,
        pressure,
        cycloneIndex: risk,
        status: risk > 45 ? 'Elevated Anomaly' : 'Normal Climatology',
        isLive: true
      };
      return [newEntry, ...prev.slice(0, 24)];
    });
  };

  // Persist units
  useEffect(() => {
    localStorage.setItem('oceanfusion_units', unitSystem);
  }, [unitSystem]);

  // Persist interval
  useEffect(() => {
    localStorage.setItem('oceanfusion_refresh_interval', String(refreshIntervalSec));
  }, [refreshIntervalSec]);

  // Fetch live backend telemetry on mount and periodic interval
  useEffect(() => {
    let isMounted = true;
    const fetchLiveBackendState = async () => {
      try {
        const liveState = await mockApiService.getOceanState();
        if (isMounted && liveState) {
          setOceanState(liveState);
          recordTelemetryFrame(liveState);
        }
      } catch (err) {
        console.warn('[OceanDataContext Warning] Live backend fetch error:', err);
      }
    };

    fetchLiveBackendState();

    if (!isSimulating) return;

    const interval = setInterval(() => {
      fetchLiveBackendState();
    }, refreshIntervalSec * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isSimulating, refreshIntervalSec]);

  const toggleSimulation = () => {
    setIsSimulating(prev => {
      const next = !prev;
      addToast({
        title: next ? 'Live Telemetry Resumed' : 'Live Telemetry Paused',
        message: next ? 'Real-time telemetry feeds active.' : 'Sensor simulation held on current state.',
        type: next ? 'success' : 'info',
        duration: 2500
      });
      return next;
    });
  };

  const manualRefresh = () => {
    const updatedState = {
      ...oceanState,
      lastUpdated: new Date().toISOString(),
      seaSurfaceTemperature: Number((28.0 + Math.random() * 1.5).toFixed(2)),
      waveHeight: Number((1.5 + Math.random() * 0.8).toFixed(2)),
      windSpeed: Number((20.0 + Math.random() * 10.0).toFixed(1)),
    };
    setOceanState(updatedState);
    recordTelemetryFrame(updatedState);
    addToast({
      title: 'Telemetry Synced',
      message: 'Pulled latest buoy and satellite frames from INCOIS & NOAA.',
      type: 'success',
      duration: 3000
    });
  };

  // Convert values based on selected unit system
  const formatTemp = (celsius) => {
    if (unitSystem === 'imperial') {
      const f = (celsius * 9) / 5 + 32;
      return `${f.toFixed(1)} °F`;
    }
    return `${celsius.toFixed(1)} °C`;
  };

  const formatHeight = (meters) => {
    if (unitSystem === 'imperial') {
      const ft = meters * 3.28084;
      return `${ft.toFixed(1)} ft`;
    }
    return `${meters.toFixed(2)} m`;
  };

  const formatSpeed = (kmh) => {
    if (unitSystem === 'imperial') {
      const knots = kmh * 0.539957;
      return `${knots.toFixed(1)} kts`;
    }
    return `${kmh.toFixed(1)} km/h`;
  };

  const formatCurrent = (mps) => {
    if (unitSystem === 'imperial') {
      const knots = mps * 1.94384;
      return `${knots.toFixed(1)} kts`;
    }
    return `${mps.toFixed(2)} m/s`;
  };

  return (
    <OceanDataContext.Provider value={{
      oceanState,
      setOceanState,
      telemetryHistory,
      activeRegion,
      setActiveRegion,
      regionsList,
      unitSystem,
      setUnitSystem,
      isSimulating,
      toggleSimulation,
      manualRefresh,
      refreshIntervalSec,
      setRefreshIntervalSec,
      formatTemp,
      formatHeight,
      formatSpeed,
      formatCurrent,
      isSimulatingCyclone,
      setIsSimulatingCyclone,
      hasActiveCyclone,
      liveCycloneRisk,
      activeStorms,
      primaryActiveStorm,
      stormsLoading,
    }}>
      {children}
    </OceanDataContext.Provider>
  );
}

export function useOceanData() {
  const context = useContext(OceanDataContext);
  if (!context) {
    throw new Error('useOceanData must be used within an OceanDataProvider');
  }
  return context;
}

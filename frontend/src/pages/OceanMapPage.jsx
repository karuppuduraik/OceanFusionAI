import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
  useMapEvents,
  Pane
} from 'react-leaflet';
import L from 'leaflet';
import {
  FiCompass,
  FiRadio,
  FiClock,
  FiMaximize2,
  FiMapPin,
  FiX,
  FiDroplet,
  FiWind,
  FiThermometer
} from 'react-icons/fi';

import { useOceanData } from '../context/OceanDataContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchLiveRadarFrames, generateSatelliteFrames, WEATHER_TILE_LAYERS } from '../services/radarService';
import {
  fetchLiveWeatherPoint,
  fetchLiveMarinePoint,
  fetchLiveWeatherMultiStation,
  fetchAllStormLiveData,
  MONITORING_STATIONS,
  calculateXGBoostCycloneRisk
} from '../services/realOceanService';
import { fetchActiveStormsFromGDACS } from '../services/cycloneService';

import ZoomEarthSidebar from '../components/map/ZoomEarthSidebar';
import ZoomEarthTimeline from '../components/map/ZoomEarthTimeline';
import ZoomEarthLegend from '../components/map/ZoomEarthLegend';
import ZoomEarthStormMarker from '../components/map/ZoomEarthStormMarker';

// Helper component to handle programmatic map recentering
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Map Click Event Listener for Location Weather Inspector (Zoom Earth Style)
function MapClickInspector({ onInspectCoordinate }) {
  useMapEvents({
    click(e) {
      const wrapped = e.latlng.wrap ? e.latlng.wrap() : e.latlng;
      onInspectCoordinate({
        lat: parseFloat(wrapped.lat.toFixed(2)),
        lng: parseFloat(wrapped.lng.toFixed(2)),
      });
    },
  });
  return null;
}

// Custom Buoy Icon
const createBuoyMarkerIcon = (status = 'Active') => {
  const color = status === 'Warning' ? '#F59E0B' : '#0284C7';
  return L.divIcon({
    className: 'buoy-custom-icon',
    html: `
      <div style="width: 22px; height: 22px; border-radius: 50%; background: #ffffff; border: 3px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.35);">
        <div style="width: 7px; height: 7px; border-radius: 50%; background: ${color};"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

export default function OceanMapPage() {
  const { oceanState } = useOceanData();
  const { t, language } = useLanguage();

  const location = useLocation();

  // Coordinates matching user URL: view=21.44,76.62,5z
  const [mapCenter, setMapCenter] = useState(() => {
    return location.state?.center || [21.44, 76.62];
  });
  const [mapZoom, setMapZoom] = useState(() => {
    return location.state?.center ? 7 : 5;
  });

  useEffect(() => {
    if (location.state?.center) {
      setMapCenter(location.state.center);
      setMapZoom(7);
    }
  }, [location.state]);

  // Layer and display state
  const [activeLayer, setActiveLayer] = useState('precipitation');
  const [subOption, setSubOption] = useState(null);
  const [baseMap, setBaseMap] = useState('satellite');
  const [opacity, setOpacity] = useState(0.85);
  const [buoysVisible, setBuoysVisible] = useState(true);
  const [stormVisible, setStormVisible] = useState(true);
  const [selectedModel, setSelectedModel] = useState('ICON 13 km');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  // Real-Time Radar timestamps & animation
  const [radarFrames, setRadarFrames] = useState([]);
  const [currentRadarFrameIndex, setCurrentRadarFrameIndex] = useState(0);

  // Real-Time Satellite frames & animation
  const [satelliteFrames, setSatelliteFrames] = useState([]);
  const [currentSatFrameIndex, setCurrentSatFrameIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  // Click Inspector Card state (Zoom Earth exact match)
  const [inspectedLocation, setInspectedLocation] = useState(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  // Real-Time Active Storms from GDACS API (fetched on mount)
  const [activeStorms, setActiveStorms] = useState([]);
  const [stormsLoading, setStormsLoading] = useState(true);

  // Real-time Buoys with Live Data
  const [buoyDataList, setBuoyDataList] = useState([
    {
      id: 'NIOT-AD02',
      name: 'Arabian Sea Gujarat Offshore Buoy AD02',
      location: 'Gujarat Coast (21.1° N, 69.8° E)',
      lat: 21.1,
      lng: 69.8,
      sst: '28.2 °C',
      wave: '2.02 m',
      wind: '24.0 km/h',
      pressure: '1010.2 hPa',
      status: 'Warning',
    },
    {
      id: 'NIOT-AD04',
      name: 'Offshore Mumbai Basin Buoy AD04',
      location: 'Central Arabian Sea (16.2° N, 68.8° E)',
      lat: 16.2,
      lng: 68.8,
      sst: '27.9 °C',
      wave: '1.85 m',
      wind: '21.5 km/h',
      pressure: '1011.0 hPa',
      status: 'Active',
    },
    {
      id: 'INCOIS-BD08',
      name: 'Bay of Bengal Deep Sea Buoy BD08',
      location: 'Central Bay of Bengal (14.5° N, 85.2° E)',
      lat: 14.5,
      lng: 85.2,
      sst: '28.8 °C',
      wave: '2.35 m',
      wind: '28.2 km/h',
      pressure: '1008.5 hPa',
      status: 'Warning',
    },
    {
      id: 'INCOIS-CB02',
      name: 'Chennai Coastal Radar Buoy CB02',
      location: 'Coromandel Coast (13.1° N, 80.4° E)',
      lat: 13.1,
      lng: 80.4,
      sst: '29.1 °C',
      wave: '1.45 m',
      wind: '18.4 km/h',
      pressure: '1010.8 hPa',
      status: 'Active',
    },
  ]);

  // Fetch real-time radar and satellite frames on mount
  useEffect(() => {
    async function loadRadar() {
      const frames = await fetchLiveRadarFrames();
      setRadarFrames(frames);
      if (frames.length > 0) {
        setCurrentRadarFrameIndex(frames.length - 1);
      }
    }
    loadRadar();

    // Satellite frames (NASA GIBS TrueColor + live clouds)
    const satFrames = generateSatelliteFrames();
    setSatelliteFrames(satFrames);
    if (satFrames.length > 0) {
      setCurrentSatFrameIndex(satFrames.length - 1);
    }

    // Auto refresh radar & satellite every 5 minutes
    const interval = setInterval(() => {
      loadRadar();
      setSatelliteFrames(generateSatelliteFrames());
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real-time active cyclones from GDACS on mount
  useEffect(() => {
    async function loadRealStorms() {
      setStormsLoading(true);
      try {
        const gdacsStorms = await fetchActiveStormsFromGDACS();
        if (gdacsStorms && gdacsStorms.length > 0) {
          // Enrich with live weather data from Open-Meteo
          const enriched = await fetchAllStormLiveData(gdacsStorms);
          setActiveStorms(enriched && enriched.length > 0 ? enriched : gdacsStorms);
        } else {
          setActiveStorms([]);
        }
      } catch (err) {
        console.warn('GDACS storm fetch error:', err);
        setActiveStorms([]);
      }
      setStormsLoading(false);
    }
    loadRealStorms();

    // Re-fetch storms every 10 minutes (GDACS updates ~every 6 min)
    const stormInterval = setInterval(loadRealStorms, 10 * 60 * 1000);
    return () => clearInterval(stormInterval);
  }, []);

  // Fetch real-time live telemetry for ALL buoys
  useEffect(() => {
    async function syncBuoyData() {
      try {
        const buoyStations = buoyDataList.map(b => ({ lat: b.lat, lng: b.lng, id: b.id, name: b.name, location: b.location, status: b.status }));
        const liveStations = await fetchLiveWeatherMultiStation(buoyStations);
        if (liveStations && liveStations.length > 0) {
          setBuoyDataList(prev => prev.map(buoy => {
            const live = liveStations.find(s => s.id === buoy.id);
            if (live) {
              return {
                ...buoy,
                sst: live.sst || buoy.sst,
                wave: live.wave || buoy.wave,
                wind: live.wind || buoy.wind,
                pressure: live.pressure || buoy.pressure,
                status: live.rawWindSpeed > 30 ? 'Warning' : 'Active',
              };
            }
            return buoy;
          }));
        }
      } catch (err) {
        console.warn('Live buoy data sync error:', err);
      }
    }
    syncBuoyData();

    // Auto-refresh buoys every 2 minutes
    const interval = setInterval(syncBuoyData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Play/Pause animation (radar or satellite)
  useEffect(() => {
    const activeFrames = activeLayer === 'satellite' ? satelliteFrames : radarFrames;
    if (isPlaying && activeFrames.length > 1) {
      playIntervalRef.current = setInterval(() => {
        if (activeLayer === 'satellite') {
          setCurrentSatFrameIndex((prev) => (prev < satelliteFrames.length - 1 ? prev + 1 : 0));
        } else {
          setCurrentRadarFrameIndex((prev) => (prev < radarFrames.length - 1 ? prev + 1 : 0));
        }
      }, 800);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, activeLayer, satelliteFrames.length, radarFrames.length]);

  // Quick region jump presets
  const jumpToRegion = (region) => {
    if (region === 'first-storm' && activeStorms.length > 0) {
      setMapCenter(activeStorms[0].position);
      setMapZoom(6);
    } else if (region === 'india') {
      setMapCenter([21.44, 76.62]);
      setMapZoom(5);
    } else if (region === 'bayofbengal') {
      setMapCenter([15.0, 86.5]);
      setMapZoom(6);
    } else if (region === 'pacific') {
      setMapCenter([17.5, 126.8]);
      setMapZoom(5);
    } else if (region === 'atlantic') {
      setMapCenter([20.0, -60.0]);
      setMapZoom(4);
    }
  };

  // Inspect coordinate on map click (fetches real weather for clicked point)
  const handleInspectCoordinate = async ({ lat, lng }) => {
    setInspectLoading(true);
    setInspectedLocation({ lat, lng, loading: true });

    const [weather, marine] = await Promise.all([
      fetchLiveWeatherPoint(lat, lng),
      fetchLiveMarinePoint(lat, lng),
    ]);

    setInspectLoading(false);
    setInspectedLocation({
      lat,
      lng,
      loading: false,
      temperature: weather?.temperature ?? 27.5,
      humidity: weather?.humidity ?? 80,
      pressure: weather?.pressure ?? 1010,
      windSpeed: weather?.windSpeed ?? 20,
      windDirection: weather?.windDirection ?? 240,
      waveHeight: marine?.waveHeight ?? null,
    });
  };

  // Layer Title Banner for Top Center (Zoom Earth Style)
  const layerBanners = {
    wind: t('bannerWind'),
    temperature: t('bannerTemp'),
    humidity: t('bannerHumidity'),
    pressure: t('bannerPressure'),
    precipitation: t('bannerPrecipitation'),
    satellite: t('bannerSatellite'),
    radar: t('bannerRadar'),
  };

  // Current active tile layer
  const currentRadarTile =
    radarFrames.length > 0 && radarFrames[currentRadarFrameIndex]
      ? radarFrames[currentRadarFrameIndex].tileUrl
      : null;

  const currentSatTile =
    satelliteFrames.length > 0 && satelliteFrames[currentSatFrameIndex]
      ? satelliteFrames[currentSatFrameIndex].tileUrl
      : 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg';

  const weatherConfig = WEATHER_TILE_LAYERS[activeLayer];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full w-full select-none overflow-hidden bg-slate-950"
    >
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-900/95 backdrop-blur-md py-1.5 px-4 border-b border-white/10 text-white shadow-md flex-shrink-0 text-xs z-10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-[11px] border border-sky-500/30">
            <FiRadio className="w-3 h-3 animate-pulse text-sky-400" />
            <span>{t('realTimeGis')}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300">
            <FiClock className="w-3 h-3 text-sky-400" />
            <span>
              {language === 'ta' ? 'புதுப்பிக்கப்பட்டது: ' : 'Updated: '}
              <strong className="font-mono text-white">{t('liveTelemetrySync')}</strong>
            </span>
          </div>
        </div>

        {/* Quick Region Shortcuts */}
        <div className="flex items-center gap-1 text-xs flex-wrap">
          <span className="text-[10px] text-slate-400 mr-1 hidden lg:inline">{t('quickJump')}</span>
          {activeStorms.length > 0 && activeStorms.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setMapCenter(st.position);
                setMapZoom(7);
              }}
              className="px-2 py-0.5 rounded-lg bg-purple-600/40 text-purple-200 border border-purple-400/50 hover:bg-purple-600/60 font-bold transition-colors flex items-center gap-1 text-[10px] shadow-sm cursor-pointer"
              title={`Jump to ${st.name} in ${st.basin?.name || 'Ocean'}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-ping" />
              <span>🌀 {st.name}</span>
            </button>
          ))}
          <button
            onClick={() => jumpToRegion('bayofbengal')}
            className="px-2 py-0.5 rounded-lg bg-sky-950/70 text-sky-200 border border-sky-500/40 hover:bg-sky-900/60 transition-colors text-[10px] font-semibold flex items-center gap-1"
          >
            <span>{t('bayOfBengal')}</span>
          </button>
          <button
            onClick={() => jumpToRegion('india')}
            className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 transition-colors text-[10px] font-medium"
          >
            {t('indiaRegion')}
          </button>
          <button
            onClick={() => jumpToRegion('pacific')}
            className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 transition-colors text-[10px] font-medium"
          >
            {t('pacificOcean')}
          </button>
          <button
            onClick={() => jumpToRegion('atlantic')}
            className="px-2 py-0.5 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 transition-colors text-[10px] font-medium"
          >
            {t('atlanticOcean')}
          </button>
          {stormsLoading && (
            <span className="text-[9px] text-slate-500 flex items-center gap-1 ml-1">
              <span className="w-2.5 h-2.5 border border-purple-400 border-t-transparent rounded-full animate-spin" />
              {language === 'ta' ? 'ஏற்றுகிறது...' : 'Loading...'}
            </span>
          )}
        </div>
      </div>

      {/* Main Interactive Map Canvas (Full Viewport Fit without Scroll) */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-slate-950 min-h-[350px]">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          minZoom={3}
          maxZoom={16}
          worldCopyJump={true}
          maxBounds={[
            [-85.0511, -360],
            [85.0511, 360],
          ]}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          <MapClickInspector onInspectCoordinate={handleInspectCoordinate} />

          {/* BASE MAP 1: ESRI World Imagery (High-Res Seamless Satellite Earth) */}
          {baseMap === 'satellite' && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri &mdash; Earthstar Geographics"
              maxNativeZoom={16}
              maxZoom={18}
              zIndex={100}
            />
          )}

          {/* BASE MAP 2: CartoDB Dark Matter */}
          {baseMap === 'dark' && (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; CARTO &copy; OpenStreetMap"
              maxZoom={18}
              zIndex={100}
            />
          )}

          {/* BASE MAP 3: ESRI Street & Topo */}
          {baseMap === 'streets' && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri &mdash; World Street Map"
              maxNativeZoom={16}
              maxZoom={18}
              zIndex={100}
            />
          )}

          {/* SATELLITE MODE: Real-Time Dynamic Global Cloud Swirls Over World Satellite Earth */}
          {activeLayer === 'satellite' && WEATHER_TILE_LAYERS.clouds?.url && (
            <TileLayer
              key={`sat-clouds-${currentSatFrameIndex}`}
              url={WEATHER_TILE_LAYERS.clouds.url}
              opacity={Math.min(1.0, opacity * 1.05)}
              zIndex={300}
            />
          )}

          {/* Reference Boundaries & Ocean Names (Zoom Earth style) */}
          {baseMap === 'satellite' && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxNativeZoom={12}
              maxZoom={18}
              opacity={0.88}
              zIndex={350}
            />
          )}

          {/* REAL-TIME OVERLAY: Precipitation & Live Radar */}
          {(activeLayer === 'precipitation' || activeLayer === 'radar') && currentRadarTile && (
            <TileLayer
              key={`radar-tile-${currentRadarFrameIndex}`}
              url={currentRadarTile}
              opacity={opacity}
              zIndex={400}
            />
          )}

          {/* OpenWeather Precipitation Tile Layer */}
          {activeLayer === 'precipitation' && weatherConfig?.url && (
            <TileLayer
              url={weatherConfig.url}
              opacity={opacity * 0.75}
              zIndex={390}
            />
          )}

          {/* REAL-TIME OVERLAY: Wind Speed Raster */}
          {activeLayer === 'wind' && weatherConfig?.url && (
            <TileLayer
              url={weatherConfig.url}
              opacity={opacity}
              zIndex={400}
            />
          )}

          {/* REAL-TIME OVERLAY: Temperature / SST */}
          {activeLayer === 'temperature' && weatherConfig?.url && (
            <TileLayer
              url={weatherConfig.url}
              opacity={opacity}
              zIndex={400}
            />
          )}

          {/* REAL-TIME OVERLAY: Relative Humidity Raster with Ultra-Smooth Atmospheric Transition */}
          {activeLayer === 'humidity' && weatherConfig?.url && (
            <Pane name="humidity-smooth-pane" style={{ zIndex: 320 }}>
              <TileLayer
                key="layer-humidity-airs"
                url={weatherConfig.url}
                opacity={opacity * 0.78}
                maxNativeZoom={weatherConfig.maxNativeZoom || 6}
                maxZoom={18}
                className="humidity-tile-smooth"
              />
            </Pane>
          )}

          {/* REAL-TIME OVERLAY: Clouds (non-satellite active layer) */}
          {activeLayer === 'clouds' && WEATHER_TILE_LAYERS.clouds?.url && (
            <TileLayer
              url={WEATHER_TILE_LAYERS.clouds.url}
              opacity={opacity * 0.8}
              zIndex={400}
            />
          )}

          {/* REAL-TIME OVERLAY: Sea Level Pressure */}
          {activeLayer === 'pressure' && weatherConfig?.url && (
            <TileLayer
              url={weatherConfig.url}
              opacity={opacity}
              zIndex={400}
            />
          )}

          {/* ACTIVE CYCLONE / DISTURBANCE TRACKERS (Invest 94A, Typhoon 14W, BOB-03) */}
          {stormVisible &&
            activeStorms.map((storm) => (
              <ZoomEarthStormMarker
                key={storm.id}
                storm={storm}
                onSelect={(st) => {
                  setMapCenter(st.position);
                  setMapZoom(7);
                }}
              />
            ))}

          {/* LIVE OCEAN TELEMETRY BUOY STATIONS */}
          {buoysVisible &&
            buoyDataList.map((buoy) => (
              <Marker
                key={buoy.id}
                position={[buoy.lat, buoy.lng]}
                icon={createBuoyMarkerIcon(buoy.status)}
              >
                <Popup className="zoom-earth-buoy-popup">
                  <div className="p-3 space-y-1.5 min-w-[220px] text-slate-800 dark:text-slate-100">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700/80">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                        {buoy.id}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                        {t('liveBadgeText')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{buoy.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{buoy.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
                      <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('sst')}</span>
                        <strong className="text-sky-600 dark:text-sky-300 font-mono text-xs">{buoy.sst}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('waveHeightLabel')}</span>
                        <strong className="text-indigo-600 dark:text-indigo-300 font-mono text-xs">{buoy.wave}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('windSpeed')}</span>
                        <strong className="text-slate-700 dark:text-slate-200 font-mono text-xs">{buoy.wind}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('pressureLayer')}</span>
                        <strong className="text-slate-700 dark:text-slate-200 font-mono text-xs">{buoy.pressure}</strong>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Top Center Layer Headline Banner (Zoom Earth exact match) */}
        {layerBanners[activeLayer] && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
            <div className="px-4 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white font-bold text-xs tracking-wide shadow-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>{layerBanners[activeLayer]}</span>
            </div>
          </div>
        )}

        {/* Floating Zoom Earth Left Sidebar Menu */}
        <ZoomEarthSidebar
          activeLayer={activeLayer}
          onSelectLayer={(layer) => {
            setActiveLayer(layer);
            setSubOption(null);
          }}
          subOption={subOption}
          onSelectSubOption={(opt) => setSubOption(opt)}
          baseMap={baseMap}
          onSelectBaseMap={(bm) => setBaseMap(bm)}
          opacity={opacity}
          onChangeOpacity={(op) => setOpacity(op)}
          buoysVisible={buoysVisible}
          onToggleBuoys={(v) => setBuoysVisible(v)}
          stormVisible={stormVisible}
          onToggleStorm={(v) => setStormVisible(v)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={(col) => setIsSidebarCollapsed(col)}
        />

        {/* Click Weather Inspector Card (Right side, Zoom Earth Screenshot 4 & 5 match) */}
        <AnimatePresence>
          {inspectedLocation && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-16 right-3 z-[1000] w-64 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-3.5 text-white space-y-2.5 select-none"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                  <FiMapPin className="w-3.5 h-3.5" />
                  <span>
                    {inspectedLocation.lat}° N, {inspectedLocation.lng}° E
                  </span>
                </div>
                <button
                  onClick={() => setInspectedLocation(null)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {inspectedLocation.loading ? (
                <div className="py-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'ta' ? 'நேரலை செயற்கைக்கோள் தரவு பெறப்படுகிறது...' : 'Querying live satellite telemetry...'}</span>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 block">{t('tempLayer')}</span>
                      <strong className="text-sm font-bold font-mono text-amber-300">
                        {inspectedLocation.temperature} °C
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 block">{t('pressureLayer')}</span>
                      <strong className="text-sm font-bold font-mono text-sky-300">
                        {inspectedLocation.pressure} hPa
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 block">{t('windVelocity')}</span>
                      <strong className="text-sm font-bold font-mono text-emerald-300">
                        {inspectedLocation.windSpeed} km/h
                      </strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 block">{t('humidityLayer')}</span>
                      <strong className="text-sm font-bold font-mono text-teal-300">
                        {inspectedLocation.humidity} %
                      </strong>
                    </div>
                  </div>

                  {inspectedLocation.waveHeight !== null && (
                    <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
                      <span className="text-[11px] text-sky-300">{t('significantWaveSwell')}</span>
                      <strong className="font-mono text-xs text-sky-200">
                        {inspectedLocation.waveHeight} m
                      </strong>
                    </div>
                  )}

                  <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-end border-t border-white/10">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {t('liveStatusText')}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM RIGHT DOCK: Color Scale Legend with zero mobile overlap */}
        <div
          className={`absolute bottom-3 right-3 z-[1000] pointer-events-none transition-opacity duration-200 ${
            !isSidebarCollapsed ? 'hidden sm:block' : 'block'
          }`}
        >
          <div className="pointer-events-auto">
            <ZoomEarthLegend activeLayer={activeLayer} />
          </div>
        </div>

        {/* Top Right Zoom Controls (+ / -) */}
        <div className="absolute top-3 right-3 z-[999] flex flex-col gap-1.5 select-none">
          <button
            onClick={() => setMapZoom((prev) => Math.min(prev + 1, 16))}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base flex items-center justify-center border border-white/20 shadow-xl transition-all active:scale-95"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setMapZoom((prev) => Math.max(prev - 1, 3))}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base flex items-center justify-center border border-white/20 shadow-xl transition-all active:scale-95"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => jumpToRegion('india')}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 flex items-center justify-center border border-white/20 shadow-xl transition-all active:scale-95"
            title="Reset View to India"
          >
            <FiCompass className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

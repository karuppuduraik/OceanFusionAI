import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  CircleMarker,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import { createBuoyIcon, createShipIcon, createCycloneIcon, createWaterQualityIcon } from './mapIcons';
import { FiExternalLink, FiCompass, FiWind, FiActivity, FiCpu, FiDroplet } from 'react-icons/fi';
import Button from '../common/Button';
import Badge from '../common/Badge';

// Controller component to handle fly-to movements
function MapController({ targetCenter, targetZoom }) {
  const map = useMap();
  useEffect(() => {
    if (targetCenter && targetZoom) {
      map.flyTo(targetCenter, targetZoom, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [targetCenter, targetZoom, map]);
  return null;
}

// Mouse coordinates tracker
function MouseCoordinatesTracker({ onMouseMove }) {
  useMapEvents({
    mousemove(e) {
      const wrapped = e.latlng.wrap ? e.latlng.wrap() : e.latlng;
      onMouseMove(wrapped);
    }
  });
  return null;
}

export default function OceanMapComponent({
  layers,
  mapStyle = 'dark',
  targetCenter = [14.0, 84.0],
  targetZoom = 5,
  buoys = [],
  ships = [],
  cyclone = null,
  waterQuality = [],
  heatGrid = [],
  layerOpacity = 0.85
}) {
  const [coords, setCoords] = useState({ lat: 14.25, lng: 84.12 });
  const navigate = useNavigate();

  // Basemap tile URLs
  const tileLayers = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
  };

  const tileAttribution = {
    dark: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OceanFusion AI',
    satellite: '&copy; Esri & NASA Earthdata &copy; OceanFusion AI',
    light: '&copy; OpenStreetMap contributors &copy; CARTO'
  };

  // Build cyclone forecast track coordinates
  const cyclonePoints = cyclone
    ? [
        ...cyclone.historicalTrack.map(p => [p.lat, p.lng]),
        [cyclone.currentPosition[0], cyclone.currentPosition[1]],
        ...cyclone.forecastTrack.map(p => [p.lat, p.lng])
      ]
    : [];

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden border border-ocean-sky/40 dark:border-ocean-borderDark shadow-2xl bg-ocean-deep">
      {/* Real-time Coordinates HUD */}
      <div className="absolute top-6 left-6 z-[1000] glass-panel-deep px-4 py-2 rounded-2xl border border-ocean-sky/40 dark:border-ocean-borderDark text-xs font-mono flex items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-1.5 text-ocean-teal font-semibold">
          <FiCompass className="w-4 h-4 animate-spin-slow" />
          <span>LAT: {coords.lat.toFixed(3)}°N</span>
        </div>
        <span className="text-slate-400">|</span>
        <div className="text-ocean-sky font-semibold">
          <span>LNG: {coords.lng.toFixed(3)}°E</span>
        </div>
        <span className="text-slate-400">|</span>
        <span className="text-[11px] text-slate-400">Bathymetry: ~2,480m</span>
      </div>

      <MapContainer
        center={targetCenter}
        zoom={targetZoom}
        worldCopyJump={true}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: '100%', minHeight: '600px' }}
      >
        <MapController targetCenter={targetCenter} targetZoom={targetZoom} />
        <MouseCoordinatesTracker onMouseMove={(latlng) => setCoords(latlng)} />

        {/* Dynamic Basemap Layer */}
        <TileLayer
          key={mapStyle}
          url={tileLayers[mapStyle] || tileLayers.dark}
          attribution={tileAttribution[mapStyle] || tileAttribution.dark}
          maxZoom={18}
          minZoom={3}
        />

        {/* SST Thermal Heat Grid Overlay */}
        {layers.sstHeatmap && (
          <>
            {heatGrid.map((point, index) => {
              const color = point.sst >= 30.0 ? '#EF4444' : point.sst >= 29.0 ? '#F59E0B' : point.sst >= 28.0 ? '#19A7CE' : '#3B82F6';
              return (
                <CircleMarker
                  key={`heat-${index}`}
                  center={[point.lat, point.lng]}
                  radius={42}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: layerOpacity * 0.45,
                    stroke: true,
                    color: color,
                    weight: 1,
                    opacity: layerOpacity * 0.7
                  }}
                >
                  <Popup>
                    <div className="p-3 text-white text-xs">
                      <p className="font-bold text-ocean-sky text-sm">SST Thermal Node</p>
                      <p className="mt-1">Temperature: <strong className="text-ocean-teal">{point.sst}°C</strong></p>
                      <p>Relative Heat Flux: {(point.intensity * 100).toFixed(0)}%</p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </>
        )}

        {/* Cyclone Tracks & 72h Radii */}
        {layers.cyclone && cyclone && (
          <>
            {/* Historical Track (Dashed white) */}
            <Polyline
              positions={cyclone.historicalTrack.map(p => [p.lat, p.lng])}
              pathOptions={{ color: '#FFFFFF', weight: 3, dashArray: '4, 8', opacity: 0.8 }}
            />

            {/* Forecast Cone Track (Red) */}
            <Polyline
              positions={[
                [cyclone.currentPosition[0], cyclone.currentPosition[1]],
                ...cyclone.forecastTrack.map(p => [p.lat, p.lng])
              ]}
              pathOptions={{ color: '#E11D48', weight: 4, opacity: 0.9 }}
            />

            {/* Gale / Storm Radii */}
            <Circle
              center={cyclone.currentPosition}
              radius={160000} // 160km gale wind radius
              pathOptions={{
                color: '#E11D48',
                fillColor: '#E11D48',
                fillOpacity: layerOpacity * 0.22,
                weight: 1.5,
                dashArray: '6, 6'
              }}
            />

            {/* Forecast Cones */}
            {cyclone.forecastTrack.map((fc, idx) => (
              <Circle
                key={`cone-${idx}`}
                center={[fc.lat, fc.lng]}
                radius={(fc.radius || 150) * 1000}
                pathOptions={{
                  color: '#F43F5E',
                  fillColor: '#F43F5E',
                  fillOpacity: layerOpacity * 0.12,
                  weight: 1
                }}
              />
            ))}

            {/* Cyclone Eye Marker */}
            <Marker
              position={cyclone.currentPosition}
              icon={createCycloneIcon()}
            >
              <Popup>
                <div className="p-4 text-white min-w-[260px]">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
                    <Badge variant="danger" dot>{cyclone.category}</Badge>
                    <span className="text-[10px] text-rose-300 font-mono">Pressure: {cyclone.centralPressure} hPa</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2 font-heading">{cyclone.name}</h4>
                  <p className="text-xs text-rose-200 mt-1">{cyclone.status}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-rose-500/20 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Max Sustained</span>
                      <strong className="text-white font-mono">{cyclone.maxWinds} km/h</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Peak Gusts</span>
                      <strong className="text-rose-400 font-mono">{cyclone.gusts} km/h</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Heading / Speed</span>
                      <span className="text-white font-mono text-[11px]">{cyclone.movementDirection} @ {cyclone.movementSpeed} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Storm Surge</span>
                      <span className="text-amber-400 font-mono text-[11px]">~2.4m Surge</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="danger"
                      className="w-full text-xs"
                      onClick={() => navigate('/alerts')}
                    >
                      View Cyclone Evacuation Bulletins
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Moored Buoys & ARGO Floats */}
        {layers.buoys && buoys.map((buoy) => (
          <Marker
            key={buoy.id}
            position={[buoy.lat, buoy.lng]}
            icon={createBuoyIcon(buoy.status)}
          >
            <Popup>
              <div className="p-4 text-white min-w-[280px]">
                <div className="flex items-center justify-between pb-2 border-b border-ocean-sky/20">
                  <Badge variant={buoy.status.includes('Advisory') ? 'warning' : 'teal'} dot>
                    {buoy.status}
                  </Badge>
                  <span className="text-[10px] text-ocean-sky/80 font-mono">{buoy.source}</span>
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-bold text-white font-heading">{buoy.name}</h4>
                  <p className="text-[11px] text-ocean-sky/80">{buoy.region}</p>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-ocean-deep/80 border border-ocean-sky/20 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Sea Surface Temp</span>
                    <strong className="text-ocean-teal font-mono text-sm">{buoy.sst} °C</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Sig. Wave Height</span>
                    <strong className="text-ocean-sky font-mono text-sm">{buoy.waveHeight} m</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Current Speed</span>
                    <span className="text-slate-200 font-mono">{buoy.currentSpeed} m/s</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Wind Velocity</span>
                    <span className="text-slate-200 font-mono">{buoy.windSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Salinity</span>
                    <span className="text-slate-200 font-mono">{buoy.salinity} PSU</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Cyclone Risk</span>
                    <span className={`font-mono font-bold ${buoy.cycloneRisk > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {buoy.cycloneRisk}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Battery: {buoy.battery}%</span>
                  <span>Sync: {buoy.lastUpdated}</span>
                </div>

                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full text-xs"
                    icon={FiCpu}
                    onClick={() => handleRunInference(buoy)}
                  >
                    Run Deep Learning Prediction
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marine Vessels & Ships */}
        {layers.ships && ships.map((ship) => (
          <Marker
            key={ship.id}
            position={[ship.lat, ship.lng]}
            icon={createShipIcon(ship.course, ship.type)}
          >
            <Popup>
              <div className="p-3.5 text-white min-w-[240px]">
                <div className="flex items-center justify-between pb-1.5 border-b border-ocean-sky/20">
                  <span className="text-xs font-semibold text-ocean-sky">{ship.flag}</span>
                  <span className="text-[10px] font-mono text-slate-400">Call: {ship.callSign}</span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1.5">{ship.name}</h4>
                <p className="text-[11px] text-ocean-teal">{ship.type}</p>
                <p className="text-[11px] text-slate-300 mt-1 font-sans">{ship.status}</p>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-ocean-sky/15 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Speed</span>
                    <strong className="text-white">{ship.speed} kts</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Course Heading</span>
                    <strong className="text-ocean-sky">{ship.course}° True</strong>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 truncate">Destination: {ship.destination}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Water Quality Stations */}
        {layers.waterQuality && waterQuality.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            icon={createWaterQualityIcon(station.wqi)}
          >
            <Popup>
              <div className="p-3.5 text-white min-w-[240px]">
                <div className="flex items-center justify-between pb-1.5 border-b border-ocean-sky/20">
                  <Badge variant={station.wqi > 80 ? 'success' : station.wqi > 65 ? 'warning' : 'danger'}>
                    WQI: {station.wqi} / 100
                  </Badge>
                  <span className="text-[10px] text-slate-400">{station.status}</span>
                </div>

                <h4 className="text-sm font-bold text-white mt-2">{station.name}</h4>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-ocean-sky/15 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Chlorophyll-a</span>
                    <strong className="text-emerald-400">{station.chlorophyll} mg/m³</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Dissolved O2</span>
                    <strong className="text-ocean-sky">{station.dissolvedOxygen} mg/L</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">pH Index</span>
                    <span className="text-white">{station.ph}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-sans">Algal Bloom</span>
                    <span className={station.algalBloomRisk === 'Warning' ? 'text-amber-400' : 'text-emerald-400'}>
                      {station.algalBloomRisk}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

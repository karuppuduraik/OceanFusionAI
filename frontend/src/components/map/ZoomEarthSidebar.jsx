import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCloudRain,
  FiWind,
  FiThermometer,
  FiDroplet,
  FiCompass,
  FiRadio,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiEye
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

export default function ZoomEarthSidebar({
  activeLayer,
  onSelectLayer,
  subOption,
  onSelectSubOption,
  baseMap,
  onSelectBaseMap,
  opacity,
  onChangeOpacity,
  buoysVisible,
  onToggleBuoys,
  stormVisible,
  onToggleStorm,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}) {
  const { t } = useLanguage();
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };

  const handleSelectLayer = (layerId) => {
    onSelectLayer(layerId);
    // On small mobile screens (<640px), auto-collapse after selection so map is completely visible
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      if (onToggleCollapse) {
        onToggleCollapse(true);
      } else {
        setInternalCollapsed(true);
      }
    }
  };

  const liveMaps = [
    { id: 'satellite', name: t('satelliteLayer'), icon: FiEye, type: 'live' },
    { id: 'radar', name: t('radarLayer'), icon: FiRadio, type: 'live' },
  ];

  const forecastMaps = [
    { id: 'precipitation', name: t('precipitationLayer'), icon: FiCloudRain, type: 'forecast' },
    { id: 'wind', name: t('windLayer'), icon: FiWind, type: 'forecast' },
    { id: 'temperature', name: t('tempLayer'), icon: FiThermometer, type: 'forecast' },
    { id: 'humidity', name: t('humidityLayer'), icon: FiDroplet, type: 'forecast' },
    { id: 'pressure', name: t('pressureLayer'), icon: FiCompass, type: 'forecast' },
  ];

  const currentActiveDef = [...liveMaps, ...forecastMaps].find(m => m.id === activeLayer);

  return (
    <div className="absolute top-3 left-3 z-[1000] flex items-start select-none">
      <motion.div
        animate={{ width: isCollapsed ? 0 : 185, opacity: isCollapsed ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="w-[185px] max-h-[calc(100vh-150px)] flex flex-col bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl text-white overflow-hidden text-xs">
          {/* Fixed Header Brand (Not Scrollable) */}
          <div className="flex items-center justify-between p-2.5 pb-2 border-b border-white/10 flex-shrink-0 bg-slate-900/95">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <FiActivity className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-wide uppercase text-slate-200">
                OceanFusion GIS
              </span>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-2.5 pt-2 space-y-2 overflow-y-auto custom-scrollbar flex-1">
            {/* LIVE MAPS Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 flex items-center justify-between">
                <span>{t('liveMapsSection')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              {liveMaps.map((item) => {
                const Icon = item.icon;
                const isActive = activeLayer === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectLayer(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white font-bold shadow-sm border border-white/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* FORECAST / REAL-TIME MAPS Section */}
            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                {t('forecastMapsSection')}
              </div>
              {forecastMaps.map((item) => {
                const Icon = item.icon;
                const isActive = activeLayer === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectLayer(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white/20 text-white font-bold shadow-sm border border-white/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Map Controls (Opacity & Feature Toggles) */}
            <div className="pt-1.5 border-t border-white/10 space-y-2 text-xs">
              {/* Opacity Slider */}
              <div className="px-1 space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{t('overlayOpacity')}</span>
                  <span className="font-mono">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => onChangeOpacity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              {/* Feature Toggles */}
              <div className="pt-1 flex flex-col gap-1 px-1">
                <label className="flex items-center justify-between cursor-pointer text-[10px] text-slate-300 hover:text-white">
                  <span>{t('stormTracker')}</span>
                  <input
                    type="checkbox"
                    checked={stormVisible}
                    onChange={(e) => onToggleStorm(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-0 w-3 h-3"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-[10px] text-slate-300 hover:text-white">
                  <span>{t('oceanBuoyTelemetry')}</span>
                  <input
                    type="checkbox"
                    checked={buoysVisible}
                    onChange={(e) => onToggleBuoys(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-0 w-3 h-3"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="ml-1 mt-2 p-1.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl border border-white/20 shadow-lg transition-all"
        title={isCollapsed ? 'Show Layer Menu' : 'Hide Layer Menu'}
      >
        {isCollapsed ? <FiChevronRight className="w-3.5 h-3.5" /> : <FiChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

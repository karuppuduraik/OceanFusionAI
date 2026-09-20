import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSliders, FiMinus, FiMaximize2 } from 'react-icons/fi';
import Toggle from '../common/Toggle';

export default function MapFilterPanel({
  layers,
  setLayers,
  mapStyle,
  setMapStyle,
  layerOpacity,
  setLayerOpacity
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleToggle = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="absolute top-6 right-6 z-[1000] flex flex-col items-end">
      {isMinimized ? (
        /* Minimized Floating Control Pill */
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={() => setIsMinimized(false)}
          className="glass-panel-deep px-4 py-2.5 rounded-2xl shadow-2xl border border-ocean-sky/40 dark:border-ocean-borderDark flex items-center gap-2.5 text-xs font-bold text-ocean-navy dark:text-ocean-surface hover:bg-ocean-teal/15 transition-all group cursor-pointer"
          title="Expand GIS Layer Controls"
        >
          <FiSliders className="w-4 h-4 text-ocean-teal group-hover:rotate-45 transition-transform" />
          <span>GIS Layer Controls</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-ocean-teal/20 text-ocean-teal font-bold uppercase">
            Active
          </span>
          <FiMaximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-ocean-teal ml-1" />
        </motion.button>
      ) : (
        /* Expanded Filter Panel Box */
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          className="max-w-xs sm:max-w-sm w-full"
        >
          <div className="glass-panel-deep rounded-3xl p-4 sm:p-5 shadow-2xl border border-ocean-sky/40 dark:border-ocean-borderDark space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Header with Minimize Button */}
            <div className="flex items-center justify-between border-b border-ocean-sky/20 dark:border-ocean-borderDark pb-3">
              <div className="flex items-center gap-2">
                <FiSliders className="w-4 h-4 text-ocean-teal" />
                <h4 className="text-sm font-bold text-ocean-navy dark:text-ocean-surface">GIS Layer Controls</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-ocean-teal/20 text-ocean-teal font-bold uppercase">
                  Active
                </span>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:text-ocean-sky dark:hover:text-white hover:bg-ocean-teal/15 transition-colors"
                  title="Minimize Panel to View Map"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60">
                Telemetry Overlays
              </span>
              <Toggle
                label="Highwave & Tsunami Swells"
                description="Continuous wave surge & thermal raster"
                checked={layers.sstHeatmap}
                onChange={() => handleToggle('sstHeatmap')}
              />
              <Toggle
                label="Cyclone Track & 72h Radii"
                description="Severe Storm Asani-II forecast cone"
                checked={layers.cyclone}
                onChange={() => handleToggle('cyclone')}
              />
            </div>

            {/* Basemap Selection */}
            <div className="pt-2 border-t border-ocean-sky/20 dark:border-ocean-borderDark/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60 block mb-2">
                Basemap Cartography
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'dark', label: 'Dark Ocean' },
                  { id: 'satellite', label: 'Satellite' },
                  { id: 'light', label: 'Light Carto' },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setMapStyle(style.id)}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                      mapStyle === style.id
                        ? 'bg-ocean-teal text-white border-ocean-teal shadow-sm'
                        : 'bg-white/40 dark:bg-ocean-deep/60 text-slate-700 dark:text-ocean-sky border-ocean-sky/30 dark:border-ocean-borderDark hover:bg-ocean-teal/10'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="pt-2 border-t border-ocean-sky/20 dark:border-ocean-borderDark/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60">
                  Overlay Opacity
                </span>
                <span className="text-xs font-mono font-bold text-ocean-teal">{Math.round(layerOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={layerOpacity}
                onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
                className="w-full accent-ocean-teal cursor-pointer h-1.5 bg-slate-300 dark:bg-ocean-deep rounded-lg"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

export default function MapLegend({ activeLayer }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-6 left-6 z-[1000] max-w-xs w-full">
      <div className="glass-panel-deep rounded-2xl p-3.5 shadow-xl border border-ocean-sky/40 dark:border-ocean-borderDark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FiInfo className="w-3.5 h-3.5 text-ocean-teal" />
            <h5 className="text-xs font-bold text-ocean-navy dark:text-ocean-surface">Map Color Scale</h5>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-slate-400 hover:text-white"
          >
            {isCollapsed ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-3 overflow-hidden text-[11px]"
            >
              {/* Sea Surface Temperature Scale */}
              <div>
                <div className="flex justify-between text-slate-500 dark:text-ocean-sky/80 font-medium mb-1">
                  <span>SST (°C)</span>
                  <span>24°C — 32°C</span>
                </div>
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-blue-600 via-emerald-400 via-amber-400 to-rose-600 shadow-inner" />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-ocean-sky/60 mt-0.5 font-mono">
                  <span>24° (Cool)</span>
                  <span>28° (Nominal)</span>
                  <span>32° (Thermal Heatwave)</span>
                </div>
              </div>

              {/* Wave Height */}
              <div>
                <div className="flex justify-between text-slate-500 dark:text-ocean-sky/80 font-medium mb-1">
                  <span>Wave Height (SWH)</span>
                  <span>0.5m — 5.0m+</span>
                </div>
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-sky-300 via-ocean-teal via-indigo-500 to-purple-700" />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-ocean-sky/60 mt-0.5 font-mono">
                  <span>0.5m (Calm)</span>
                  <span>2.5m (Moderate)</span>
                  <span>5.0m+ (Rough Surge)</span>
                </div>
              </div>

              {/* Markers Guide */}
              <div className="pt-2 border-t border-ocean-sky/20 dark:border-ocean-borderDark/60 grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-ocean-sky">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ocean-teal border border-white" />
                  <span>Moored Buoys</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Cyclone Center</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                  <span>Research Vessels</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                  <span>Water Quality Stn</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

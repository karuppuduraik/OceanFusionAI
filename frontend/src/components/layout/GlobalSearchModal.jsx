import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiMap, FiCpu, FiAlertTriangle, FiDatabase, FiClock, FiArrowRight } from 'react-icons/fi';
import { mockBuoys } from '../../data/mockMapMarkers';
import { mockModels } from '../../data/mockPredictions';
import { mockAlerts } from '../../data/mockAlerts';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or dispatched
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  // Search in pages
  const pages = [
    { title: 'Ocean GIS Map', path: '/map', desc: 'Interactive Leaflet layer viewer for SST, wave heights & currents', icon: FiMap },
    { title: 'Analytics & Model Benchmarks', path: '/analytics', desc: 'Loss curves, correlation matrix & model accuracy metrics', icon: FiCpu },
    { title: 'Emergency Early Warning Alerts', path: '/alerts', desc: 'Tsunami, cyclone and swell surge early warning feeds', icon: FiAlertTriangle },
    { title: 'Oceanographic Data Sources', path: '/data-sources', desc: 'INCOIS, NOAA, Copernicus & NASA data ingestion pipeline', icon: FiDatabase },
    { title: 'Historical Telemetry Logs', path: '/history', desc: 'Filter, sort and export ocean sensor records as CSV', icon: FiClock },
  ];

  const matchedPages = query ? pages.filter(p => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)) : pages.slice(0, 3);
  const matchedBuoys = query ? mockBuoys.filter(b => b.name.toLowerCase().includes(query) || b.region.toLowerCase().includes(query)) : [];
  const matchedModels = query ? mockModels.filter(m => m.name.toLowerCase().includes(query) || m.domain.toLowerCase().includes(query)) : [];
  const matchedAlerts = query ? mockAlerts.filter(a => a.title.toLowerCase().includes(query) || a.region.toLowerCase().includes(query)) : [];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
      />

      {/* Search Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-ocean-dark border border-ocean-sky/40 dark:border-ocean-borderDark rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-5 py-4 border-b border-ocean-sky/20 dark:border-ocean-borderDark bg-ocean-sky/10 dark:bg-ocean-deep/60">
          <FiSearch className="w-5 h-5 text-ocean-teal flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search stations, cyclones, AI models, pages, alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-4 text-sm text-slate-900 dark:text-ocean-surface placeholder-slate-400 dark:placeholder-ocean-sky/40 focus:outline-none"
          />
          {searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-white">
              <FiX className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-sky/20 dark:bg-ocean-borderDark text-ocean-navy dark:text-ocean-sky border border-ocean-sky/30">
              ESC to close
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Pages */}
          {matchedPages.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60 px-2">
                Application Pages
              </span>
              <div className="mt-1 space-y-1">
                {matchedPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => handleSelect(page.path)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ocean-teal/15 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-ocean-teal/15 text-ocean-teal">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-ocean-navy dark:text-ocean-surface group-hover:text-ocean-teal">
                            {page.title}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-ocean-sky/60 line-clamp-1">{page.desc}</p>
                        </div>
                      </div>
                      <FiArrowRight className="w-4 h-4 text-ocean-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buoys */}
          {matchedBuoys.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60 px-2">
                In-Situ Buoy Stations ({matchedBuoys.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchedBuoys.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect('/map')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ocean-teal/15 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                        <FiMap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ocean-navy dark:text-ocean-surface group-hover:text-ocean-teal">
                          {b.name} ({b.id})
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-ocean-sky/60">
                          {b.region} • SST: {b.sst}°C • Wave: {b.waveHeight}m
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-ocean-teal/20 text-ocean-teal font-medium">
                      View on Map
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Models */}
          {matchedModels.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60 px-2">
                Deep Learning Models
              </span>
              <div className="mt-1 space-y-1">
                {matchedModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect('/analytics')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ocean-teal/15 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                        <FiCpu className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ocean-navy dark:text-ocean-surface group-hover:text-ocean-teal">
                          {m.name}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-ocean-sky/60">
                          Domain: {m.domain} • Accuracy: {m.accuracy}%
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                      Run Studio
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {matchedAlerts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60 px-2">
                Active Warnings & Advisories
              </span>
              <div className="mt-1 space-y-1">
                {matchedAlerts.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect('/alerts')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-ocean-teal/15 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
                        <FiAlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ocean-navy dark:text-ocean-surface group-hover:text-ocean-teal">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-ocean-sky/60">{a.region}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">
                      Inspect
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && matchedPages.length === 0 && matchedBuoys.length === 0 && matchedModels.length === 0 && matchedAlerts.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-ocean-sky/60">
              <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try searching for "buoy", "cyclone", "wave", or "NOAA".</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

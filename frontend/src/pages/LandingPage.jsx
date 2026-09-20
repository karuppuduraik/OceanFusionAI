import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiMap,
  FiCpu,
  FiShield,
  FiActivity,
  FiDatabase,
  FiCheckCircle,
  FiTrendingUp,
  FiLayers,
  FiZap,
  FiGlobe,
  FiLock
} from 'react-icons/fi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import StatCounter from '../components/common/StatCounter';
import { useOceanData } from '../context/OceanDataContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { oceanState } = useOceanData();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-ocean-surface dark:bg-ocean-deep text-slate-800 dark:text-ocean-surface selection:bg-ocean-teal selection:text-white transition-colors duration-300">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-ocean-dark/80 border-b border-ocean-sky/40 dark:border-ocean-borderDark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-ocean-navy to-ocean-teal flex items-center justify-center shadow-glow-teal p-1.5 transition-transform group-hover:scale-105">
              <img src="/ocean-logo.svg" alt="OceanFusion AI" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-tight text-ocean-navy dark:text-white">
                OceanFusion<span className="text-ocean-teal">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-ocean-teal">
                Deep Ocean Intelligence
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-ocean-sky hover:bg-ocean-teal/15 transition-colors flex items-center justify-center"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="material-symbols-outlined text-xl text-amber-400 dark:text-amber-300">
                {isDark ? 'sunny' : 'bedtime'}
              </span>
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-ocean-teal/20 via-ocean-sky/20 to-ocean-navy/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean-sky/20 dark:bg-ocean-teal/15 border border-ocean-teal/40 text-ocean-navy dark:text-ocean-sky text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-ocean-teal animate-ping" />
            <span>Multi-Modal Deep Learning Ocean State Estimation</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-tight text-ocean-navy dark:text-ocean-surface leading-[1.1] max-w-5xl mx-auto"
          >
            Real-Time Ocean Hydrodynamics &amp;{' '}
            <span className="gradient-text-ocean">AI Forecasting</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-ocean-sky/90 max-w-3xl mx-auto mt-6 leading-relaxed"
          >
            Synthesizing satellite altimetry from <strong>NOAA</strong>, <strong>Copernicus Marine</strong>, and <strong>INCOIS</strong> moored buoys. Running Spatiotemporal CNN-LSTM and XGBoost models to predict wave surges, sea surface temperatures, ocean currents, and cyclone genesis with sub-second latency.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Button
              size="lg"
              variant="primary"
              icon={FiArrowRight}
              iconPosition="right"
              onClick={() => navigate('/login')}
              className="text-base px-8 py-4 shadow-glow-teal"
            >
              Open Command Dashboard
            </Button>
            <Button
              size="lg"
              variant="secondary"
              icon={FiMap}
              onClick={() => navigate('/login')}
              className="text-base px-8 py-4"
            >
              Explore Ocean GIS Map
            </Button>
          </motion.div>

          {/* Live Telemetry Ticker Strip */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-14 max-w-5xl mx-auto"
          >
            <div className="glass-panel-deep rounded-3xl p-5 sm:p-6 border border-ocean-sky/50 dark:border-ocean-borderDark shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-ocean-sky/20 dark:border-ocean-borderDark">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ocean-navy dark:text-ocean-surface">
                    Live Telemetry Stream • Bay of Bengal &amp; Arabian Sea
                  </span>
                </div>
                <Badge variant="teal" size="sm">
                  Model Accuracy: 96.8%
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-ocean-deep/60 border border-ocean-sky/20 text-left">
                  <span className="text-xs text-slate-500 dark:text-ocean-sky/70 font-medium">Sea Surface Temp (SST)</span>
                  <div className="text-2xl font-bold font-mono text-ocean-navy dark:text-white mt-1">
                    <StatCounter value={oceanState.seaSurfaceTemperature} decimals={1} suffix=" °C" />
                  </div>
                  <span className="text-[10px] text-rose-500 font-semibold">+0.6°C Thermal Anomaly</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-ocean-deep/60 border border-ocean-sky/20 text-left">
                  <span className="text-xs text-slate-500 dark:text-ocean-sky/70 font-medium">Significant Wave (SWH)</span>
                  <div className="text-2xl font-bold font-mono text-ocean-teal mt-1">
                    <StatCounter value={oceanState.waveHeight} decimals={2} suffix=" m" />
                  </div>
                  <span className="text-[10px] text-ocean-teal font-semibold">Moderate Swell Propagation</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-ocean-deep/60 border border-ocean-sky/20 text-left">
                  <span className="text-xs text-slate-500 dark:text-ocean-sky/70 font-medium">Cyclone Genesis Risk</span>
                  <div className="text-2xl font-bold font-mono text-amber-500 mt-1">
                    <StatCounter value={oceanState.cycloneRisk} decimals={0} suffix="%" />
                  </div>
                  <span className="text-[10px] text-amber-500 font-semibold">Active Monitoring Zone</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/40 dark:bg-ocean-deep/60 border border-ocean-sky/20 text-left">
                  <span className="text-xs text-slate-500 dark:text-ocean-sky/70 font-medium">Inference Latency</span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    &lt; 140 ms
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Edge Tensor Acceleration</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-12 border-t border-ocean-sky/30 dark:border-ocean-borderDark bg-white dark:bg-ocean-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/ocean-logo.svg" alt="OceanFusion AI" className="w-8 h-8" />
            <div>
              <p className="text-sm font-bold text-ocean-navy dark:text-ocean-surface">OceanFusion AI Platform</p>
              <p className="text-xs text-slate-500 dark:text-ocean-sky/60">Final Year Engineering Project • 2025–2026</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-ocean-sky">
            <Link to="/about" className="hover:text-ocean-teal">About Project</Link>
            <Link to="/dashboard" className="hover:text-ocean-teal">Dashboard</Link>
            <Link to="/map" className="hover:text-ocean-teal">Ocean Map</Link>
            <Link to="/settings" className="hover:text-ocean-teal">Settings</Link>
          </div>

          <p className="text-xs text-slate-400 dark:text-ocean-sky/50">
            © 2026 OceanFusion AI. All telemetry simulated for academic research demonstration.
          </p>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiRadio, FiClock, FiMenu, FiGlobe, FiSun, FiMoon } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const routeTitles = {
    '/dashboard': t('dashboardTitle'),
    '/map': t('mapTitle'),
    '/analytics': t('analyticsTitle'),
    '/alerts': t('alertsTitle'),
    '/profile': t('profileTitle'),
    '/admin': t('adminTitle'),
  };

  const currentTitle = routeTitles[location.pathname] || 'OceanFusion AI Platform';

  return (
    <header className="h-16 bg-ocean-card border-b border-ocean-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm flex-shrink-0 transition-colors duration-200">
      {/* Mobile Menu Button & Title */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-ocean-bg hover:text-ocean-primary transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center min-w-0">
          <h2 className="text-base sm:text-lg font-bold font-heading text-ocean-text leading-tight truncate">
            {currentTitle}
          </h2>
        </div>
      </div>

      {/* Status Bar & Controls */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold flex-shrink-0">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ocean-bg border border-ocean-border hover:border-ocean-primary text-ocean-text hover:text-ocean-primary transition-all shadow-sm group"
          title={isDark ? (language === 'ta' ? 'வெளிச்சப் பயன்முறை (Light Mode)' : 'Switch to Light Theme') : (language === 'ta' ? 'இருள் பயன்முறை (Dark Mode)' : 'Switch to Dark Theme')}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <>
              <FiSun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="hidden sm:inline font-bold">{language === 'ta' ? 'பகல்' : 'Light'}</span>
            </>
          ) : (
            <>
              <FiMoon className="w-4 h-4 text-sky-600 group-hover:-rotate-12 transition-transform" />
              <span className="hidden sm:inline font-bold">{language === 'ta' ? 'இரவு' : 'Dark'}</span>
            </>
          )}
        </button>

        {/* Language Switcher Toggle Button */}
        <button
          onClick={() => toggleLanguage()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ocean-bg border border-ocean-border hover:border-ocean-primary text-ocean-primary transition-all shadow-sm"
          title="Switch Language / மொழியை மாற்று"
        >
          <FiGlobe className="w-4 h-4 text-ocean-primary" />
          <span className="font-bold">{language === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>

        {/* Live Telemetry Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-ocean-success">
          <FiRadio className="w-4 h-4 text-ocean-success animate-pulse" />
          <span>{t('liveTelemetryFeeds')}</span>
        </div>

        {/* Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ocean-bg border border-ocean-border text-slate-600 dark:text-slate-300 font-mono">
          <FiClock className="w-3.5 h-3.5 text-ocean-primary" />
          <span>{timeStr}</span>
        </div>
      </div>
    </header>
  );
}

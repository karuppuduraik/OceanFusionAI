import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function ZoomEarthLegend({ activeLayer, className = '' }) {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const legendConfigs = {
    wind: {
      unit: isTa ? 'கி.மீ/ம (km/h)' : 'km/h',
      stops: ['0', '20', '40', '60', '80', '100', '120'],
      gradient: 'linear-gradient(to right, #4c1d95 0%, #0284c7 20%, #2dd4bf 35%, #facc15 55%, #f97316 75%, #ef4444 90%, #831843 100%)',
    },
    temperature: {
      unit: '°C',
      stops: ['-30', '-20', '-10', '0', '10', '20', '30', '40', '50'],
      gradient: 'linear-gradient(to right, #a855f7 0%, #3b82f6 20%, #06b6d4 35%, #84cc16 50%, #eab308 65%, #f97316 80%, #ef4444 95%, #881337 100%)',
    },
    humidity: {
      unit: isTa ? '% ஈரப்பதம்' : '% Humidity',
      stops: ['0%', '25%', '50%', '75%', '100%'],
      gradient: 'linear-gradient(to right, #78350f 0%, #d97706 25%, #fef08a 50%, #2dd4bf 75%, #1e3a8a 100%)',
    },
    pressure: {
      unit: 'hPa',
      stops: ['970', '985', '1000', '1015', '1030', '1045'],
      gradient: 'linear-gradient(to right, #1d4ed8 0%, #0284c7 25%, #67e8f9 45%, #f8fafc 55%, #fdba74 75%, #ef4444 90%, #991b1b 100%)',
    },
    precipitation: {
      unit: isTa ? 'மழைப்பொழிவு' : 'Rain',
      stops: isTa ? ['குறைவு', 'மிதம்', 'அதிதீவிரம்', 'பனி'] : ['Light', 'Moderate', 'Heavy', 'Snow'],
      gradient: 'linear-gradient(to right, #7dd3fc 0%, #2563eb 30%, #9333ea 55%, #f97316 75%, #ef4444 90%, #fbbf24 100%)',
    },
    radar: {
      unit: 'dBZ',
      stops: ['15', '30', '45', '60', '75'],
      gradient: 'linear-gradient(to right, #7dd3fc 0%, #22c55e 30%, #facc15 60%, #ef4444 85%, #a855f7 100%)',
    },
    satellite: {
      unit: isTa ? 'மேகங்கள்' : 'Clouds',
      stops: isTa ? ['தெளிவு', 'சிதறியது', 'அடர்த்தி', 'புயல்'] : ['Clear', 'Scattered', 'Dense', 'Storm'],
      gradient: 'linear-gradient(to right, #0284c7 0%, #e0f2fe 35%, #ffffff 70%, #94a3b8 100%)',
    },
  };

  if (activeLayer === 'satellite') {
    return null;
  }

  const config = legendConfigs[activeLayer] || legendConfigs.precipitation;

  return (
    <div className={`bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-1.5 sm:p-2 text-white select-none ${className}`}>
      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-slate-300 mb-0.5 sm:mb-1 px-0.5">
        <span className="font-mono text-sky-400 uppercase tracking-wider">{config.unit}</span>
      </div>

      {/* Color Gradient Bar */}
      <div
        className="w-32 sm:w-44 h-2 sm:h-2.5 rounded-full shadow-inner border border-white/20"
        style={{ background: config.gradient }}
      />

      {/* Label stops */}
      <div className="w-32 sm:w-44 flex justify-between text-[8px] sm:text-[9px] text-slate-300 font-semibold mt-0.5 sm:mt-1 px-0.5 font-mono">
        {config.stops.map((stop, i) => (
          <span key={i}>{stop}</span>
        ))}
      </div>
    </div>
  );
}

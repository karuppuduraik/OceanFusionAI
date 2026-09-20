import React from 'react';
import { Marker, Popup, Tooltip, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { FiClock } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Create a small, clean storm center dot icon.
 * Permanent icon with fixed 30x30 hitbox and smooth ping animation.
 */
export const createStormDotIcon = (storm) => {
  const ringColor = storm.categoryLevel === 'HIGH' ? '#EF4444'
    : storm.categoryLevel === 'MEDIUM' ? '#F59E0B'
    : '#7C3AED';

  return L.divIcon({
    className: 'zoom-earth-storm-dot-icon',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        cursor: pointer;
      ">
        <!-- Outer pulse ring -->
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid ${ringColor};
          opacity: 0.55;
          animation: storm-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        "></div>

        <!-- Solid outer circle with white border -->
        <div style="
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${ringColor};
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 0 12px ${ringColor}CC, 0 2px 6px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- White center dot -->
          <div style="
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #FFFFFF;
          "></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    tooltipAnchor: [0, -16],
  });
};

export default function ZoomEarthStormMarker({ storm, onSelect }) {
  const { t, language } = useLanguage();

  if (!storm) return null;

  const predTimeAgo = storm.predictionTimeAgo || '';
  const predTimeDisplay = predTimeAgo
    ? (language === 'ta' ? `புதுப்பிக்கப்பட்டது ${predTimeAgo}` : `Updated ${predTimeAgo}`)
    : (language === 'ta' ? '24 மணிநேரத்தில்' : 'in 24 hours');

  return (
    <>
      {/* Dynamic Storm Gale Circulation Radius */}
      <Circle
        center={storm.position}
        radius={storm.radiusMeters || 120000}
        pathOptions={{
          color: '#7C3AED',
          fillColor: '#7C3AED',
          fillOpacity: 0.14,
          weight: 2,
          dashArray: '4, 4',
        }}
      />

      {/* Trajectory Polyline */}
      {storm.track && storm.track.length > 0 && (
        <Polyline
          positions={storm.track}
          pathOptions={{
            color: '#7C3AED',
            weight: 3.5,
            dashArray: '6, 6',
          }}
        />
      )}

      {/* Marker with native Tooltip on hover and compact Popup on click */}
      <Marker
        position={storm.position}
        icon={createStormDotIcon(storm)}
        eventHandlers={{
          click: () => onSelect?.(storm),
        }}
      >
        {/* Floating Purple Details Card on Hover (closes immediately on hover-out) */}
        <Tooltip
          direction="top"
          offset={[0, -16]}
          opacity={1}
          className="zoom-earth-storm-tooltip"
        >
          <div className="zoom-earth-hover-card flex flex-col items-center select-none pointer-events-none">
            <div className="bg-purple-600 text-white px-3.5 py-2 rounded-xl shadow-xl shadow-purple-950/40 border border-white/25 text-center min-w-[160px] max-w-[220px]">
              <div className="font-extrabold text-xs tracking-wide text-white mb-0.5 truncate">
                {storm.name}
              </div>
              <div className="text-[10px] text-purple-200 font-semibold mb-1 truncate">
                {storm.basin?.name || 'Pacific Ocean'}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] mb-1">
                <span className={`px-1.5 py-0.5 rounded font-extrabold text-[9px] ${
                  storm.categoryLevel === 'HIGH' ? 'bg-red-500 text-white' : storm.categoryLevel === 'MEDIUM' ? 'bg-amber-500 text-slate-900' : 'bg-yellow-400 text-slate-950'
                }`}>
                  {storm.categoryLevel}
                </span>
                <span className="opacity-90 font-medium text-[10px]">
                  {predTimeDisplay}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-purple-100">
                <span className="font-mono">{storm.windSpeed}</span>
                {storm.predictionTime && storm.predictionTime !== 'N/A' && (
                  <span className="text-[9px] opacity-75 border-l border-white/30 pl-1.5 truncate">
                    {storm.predictionTime}
                  </span>
                )}
              </div>
            </div>
            {/* Downward Pointer Arrow */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-purple-600" />
          </div>
        </Tooltip>

        {/* Click Popup with compact layout, non-overflowing max-height and safe autoPanPadding */}
        <Popup
          className="zoom-earth-popup"
          autoPan={true}
          autoPanPaddingTopLeft={[20, 85]}
          autoPanPaddingBottomRight={[20, 35]}
          offset={[0, -14]}
          maxWidth={320}
          minWidth={260}
        >
          <div className="p-3 max-h-[320px] max-w-[310px] overflow-y-auto custom-scrollbar text-slate-800 dark:text-slate-100 space-y-2 select-text">
            {/* Header */}
            <div className="pb-1.5 border-b border-slate-200 dark:border-slate-700/80 pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm text-purple-700 dark:text-purple-300">
                  {storm.name}
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
                  {storm.status}
                </span>
              </div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                {storm.basin?.name || 'Pacific Ocean'} • {storm.coordinatesDisplay}
              </div>
            </div>

            {/* Location Description */}
            {storm.locationDescription && (
              <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                {storm.locationDescription}
              </div>
            )}

            {/* 2x2 Grid of Vital Hydrodynamic Metrics */}
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('sustainedWind')}</span>
                <strong className="text-slate-850 dark:text-white font-mono text-xs">{storm.windSpeed}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('centralPressure')}</span>
                <strong className="text-slate-850 dark:text-white font-mono text-xs">{storm.centralPressure}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('waveSwell')}</span>
                <strong className="text-slate-850 dark:text-white font-mono text-xs">{storm.waveHeight}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[9px] text-slate-500 dark:text-slate-400 block font-semibold">{t('movement')}</span>
                <strong className="text-slate-850 dark:text-white font-mono text-xs truncate block">{storm.movement}</strong>
              </div>
            </div>

            {/* Prediction Timing */}
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700/80 grid grid-cols-2 gap-1.5">
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                <span className="text-[9px] text-purple-500 dark:text-purple-400 block font-semibold flex items-center gap-1">
                  <FiClock className="w-2.5 h-2.5" /> {t('predictionTime') || 'Prediction'}
                </span>
                <strong className="text-purple-900 dark:text-purple-200 text-[9px] block leading-tight truncate">
                  {storm.predictionTime || 'N/A'}
                </strong>
                {storm.predictionTimeAgo && (
                  <span className="text-[8px] text-purple-500 dark:text-purple-400 block mt-0.5">
                    {storm.predictionTimeAgo}
                  </span>
                )}
              </div>

              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                <span className="text-[9px] text-purple-500 dark:text-purple-400 block font-semibold flex items-center gap-1">
                  <FiClock className="w-2.5 h-2.5" /> {t('stormStart') || 'Start Time'}
                </span>
                <strong className="text-purple-900 dark:text-purple-200 text-[9px] block leading-tight truncate">
                  {storm.stormStartTime || 'N/A'}
                </strong>
                {storm.stormStartTimeAgo && (
                  <span className="text-[8px] text-purple-500 dark:text-purple-400 block mt-0.5">
                    {storm.stormStartTimeAgo}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/80 text-[10px] flex items-center justify-between">
              <span className="text-slate-400 dark:text-slate-500">
                {storm.track?.length > 0 ? `${storm.track.length} track points` : ''}
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                {storm.isRealTime ? t('liveTracking') : t('cached')}
              </span>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}





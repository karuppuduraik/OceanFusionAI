import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function SSTTrendChart({ data = [], title = 'Ocean State Telemetry Trends' }) {
  const { isDark } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState('both'); // 'sst' | 'wave' | 'both'

  const gridColor = isDark ? 'rgba(25, 167, 206, 0.12)' : 'rgba(20, 108, 148, 0.08)';
  const textColor = isDark ? '#AFD3E2' : '#146C94';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel-deep p-3.5 rounded-2xl border border-ocean-sky/40 dark:border-ocean-borderDark shadow-xl text-xs space-y-1">
          <p className="font-bold text-ocean-navy dark:text-ocean-surface">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                {entry.value} {entry.name.includes('Temp') ? '°C' : entry.name.includes('Wave') ? 'm' : 'km/h'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold font-heading text-ocean-navy dark:text-ocean-surface">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-ocean-sky/70">Continuous 24-hour buoy & satellite data assimilation</p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/60 dark:bg-ocean-deep/80 rounded-xl border border-ocean-sky/30 dark:border-ocean-borderDark text-xs">
          <button
            onClick={() => setSelectedMetric('sst')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedMetric === 'sst'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-ocean-sky hover:text-ocean-teal'
            }`}
          >
            SST (°C)
          </button>
          <button
            onClick={() => setSelectedMetric('wave')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedMetric === 'wave'
                ? 'bg-ocean-teal text-white shadow-sm'
                : 'text-slate-600 dark:text-ocean-sky hover:text-ocean-teal'
            }`}
          >
            Wave Height (m)
          </button>
          <button
            onClick={() => setSelectedMetric('both')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedMetric === 'both'
                ? 'bg-gradient-to-r from-ocean-navy to-ocean-teal text-white shadow-sm'
                : 'text-slate-600 dark:text-ocean-sky hover:text-ocean-teal'
            }`}
          >
            Dual Layer
          </button>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="sstGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#19A7CE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#19A7CE" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="time"
              stroke={textColor}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              stroke={textColor}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />

            {(selectedMetric === 'sst' || selectedMetric === 'both') && (
              <Area
                type="monotone"
                dataKey="sst"
                name="Sea Surface Temp (°C)"
                stroke="#F43F5E"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#sstGrad)"
              />
            )}

            {(selectedMetric === 'wave' || selectedMetric === 'both') && (
              <Area
                type="monotone"
                dataKey="waveHeight"
                name="Significant Wave (m)"
                stroke="#19A7CE"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#waveGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

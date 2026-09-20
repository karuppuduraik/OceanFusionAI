import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiBarChart2,
  FiThermometer,
  FiActivity,
  FiShield,
  FiRadio,
  FiClock,
  FiDatabase,
  FiLayers,
  FiNavigation
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useLanguage } from '../context/LanguageContext';
import { useOceanData } from '../context/OceanDataContext';
import { useTheme } from '../context/ThemeContext';
import {
  fetchHourlyHistory,
  fetchHourlyMarineHistory,
  fetch7DayForecast,
  MONITORING_STATIONS,
} from '../services/realOceanService';

export default function AnalyticsPage() {
  const { t, language } = useLanguage();
  const { oceanState, telemetryHistory, activeStorms } = useOceanData();
  const { isDark } = useTheme();
  const [timeframe, setTimeframe] = useState('weekly'); // 'daily' | 'weekly' | 'monthly'
  const [tableMode, setTableMode] = useState('live'); // 'live' | 'periodic'

  // Real-time API data state
  const [hourlyData, setHourlyData] = useState(null);
  const [weeklyApiData, setWeeklyApiData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Extract live real-time telemetry from sensor context
  const sstVal = parseFloat(oceanState?.seaSurfaceTemperature) || 28.6;
  const waveVal = parseFloat(oceanState?.waveHeight) || 2.1;
  const windVal = parseFloat(oceanState?.windSpeed) || 25.0;
  const pressureVal = parseFloat(oceanState?.atmosphericPressure) || 1008.0;

  // Real-time dynamic cyclone index computation
  const liveCycloneRisk = useMemo(() => {
    const thermal = Math.max(0, (sstVal - 26.5) * 6.5);
    const windE = Math.max(0, (windVal - 20) * 0.95);
    const waveS = Math.max(0, (waveVal - 1.2) * 6.0);
    const baro = Math.max(0, (1013 - pressureVal) * 2.8);
    return parseFloat(Math.min(99.4, Math.max(5.0, thermal + windE + waveS + baro)).toFixed(1));
  }, [sstVal, waveVal, windVal, pressureVal]);

  const isTa = language === 'ta';

  // Fetch real-time hourly + weekly data from Open-Meteo API
  useEffect(() => {
    async function loadRealData() {
      setDataLoading(true);
      const station = MONITORING_STATIONS[1]; // BD08 Bay of Bengal
      try {
        const [hourly, hourlyMarine, weekly] = await Promise.all([
          fetchHourlyHistory(station.lat, station.lng),
          fetchHourlyMarineHistory(station.lat, station.lng),
          fetch7DayForecast(station.lat, station.lng),
        ]);

        if (hourly && hourly.length > 0) {
          const merged = hourly.map((h, i) => {
            const m = hourlyMarine?.[i];
            const temp = h.temperature;
            const wave = m?.waveHeight ?? 1.5;
            const wind = h.windSpeed;
            const pressure = h.pressure;
            const thermal = Math.max(0, (temp - 26.5) * 6.5);
            const windE = Math.max(0, (wind - 20) * 0.95);
            const waveS = Math.max(0, (wave - 1.2) * 6.0);
            const baro = Math.max(0, (1013 - pressure) * 2.8);
            const cycloneIndex = parseFloat(Math.min(99.4, Math.max(5.0, thermal + windE + waveS + baro)).toFixed(1));
            return { label: h.time, temp: parseFloat(temp.toFixed(1)), wave: parseFloat(wave.toFixed(2)), wind: parseFloat(wind.toFixed(1)), pressure: parseFloat(pressure.toFixed(1)), cycloneIndex };
          });
          setHourlyData(merged);
        }

        if (weekly && weekly.length > 0) {
          const dayNamesTa = { Sun: 'ஞாயிறு', Mon: 'திங்கள்', Tue: 'செவ்வாய்', Wed: 'புதன்', Thu: 'வியாழன்', Fri: 'வெள்ளி', Sat: 'சனி' };
          const mapped = weekly.map((d) => {
            const temp = d.temp;
            const wave = d.waveMax ?? 1.5;
            const wind = d.windMax ?? 20;
            const thermal = Math.max(0, (temp - 26.5) * 6.5);
            const windE = Math.max(0, (wind - 20) * 0.95);
            const waveS = Math.max(0, (wave - 1.2) * 6.0);
            const cycloneIndex = parseFloat(Math.min(99.4, Math.max(5.0, thermal + windE + waveS)).toFixed(1));
            return { label: isTa ? (dayNamesTa[d.day] || d.day) : d.day, date: d.date, temp: parseFloat(temp.toFixed(1)), wave: parseFloat(wave.toFixed(2)), wind: parseFloat(wind.toFixed(1)), cycloneIndex };
          });
          setWeeklyApiData(mapped);
        }
      } catch (err) {
        console.warn('[AnalyticsPage] Real API data fetch failed:', err.message);
      }
      setDataLoading(false);
    }
    loadRealData();
  }, [isTa]);

  // Build final chart data from API results with fallback
  const dynamicAnalyticsData = useMemo(() => {
    const daily = hourlyData || [
      { label: '02:00', temp: sstVal - 0.6, wave: Math.max(0.5, waveVal - 0.4), cycloneIndex: Math.max(5, liveCycloneRisk - 20) },
      { label: '06:00', temp: sstVal - 0.4, wave: Math.max(0.5, waveVal - 0.3), cycloneIndex: Math.max(5, liveCycloneRisk - 15) },
      { label: '10:00', temp: sstVal - 0.2, wave: Math.max(0.5, waveVal - 0.15), cycloneIndex: Math.max(5, liveCycloneRisk - 8) },
      { label: '14:00', temp: sstVal, wave: waveVal, cycloneIndex: liveCycloneRisk },
      { label: '18:00', temp: sstVal - 0.15, wave: Math.max(0.5, waveVal - 0.08), cycloneIndex: Math.max(5, liveCycloneRisk - 5) },
      { label: '22:00', temp: sstVal - 0.35, wave: Math.max(0.5, waveVal - 0.2), cycloneIndex: Math.max(5, liveCycloneRisk - 12) },
    ];

    const weekly = weeklyApiData || [
      { label: isTa ? 'திங்கள்' : 'Mon', temp: sstVal - 0.5, wave: Math.max(0.5, waveVal - 0.3), cycloneIndex: Math.max(5, liveCycloneRisk - 18) },
      { label: isTa ? 'செவ்வாய்' : 'Tue', temp: sstVal - 0.3, wave: Math.max(0.5, waveVal - 0.2), cycloneIndex: Math.max(5, liveCycloneRisk - 12) },
      { label: isTa ? 'புதன்' : 'Wed', temp: sstVal - 0.1, wave: Math.max(0.5, waveVal - 0.1), cycloneIndex: Math.max(5, liveCycloneRisk - 6) },
      { label: isTa ? 'வியாழன்' : 'Thu', temp: sstVal + 0.2, wave: waveVal + 0.1, cycloneIndex: Math.min(99, liveCycloneRisk + 5) },
      { label: isTa ? 'வெள்ளி' : 'Fri', temp: sstVal, wave: waveVal, cycloneIndex: liveCycloneRisk },
      { label: isTa ? 'சனி' : 'Sat', temp: sstVal - 0.2, wave: Math.max(0.5, waveVal - 0.15), cycloneIndex: Math.max(5, liveCycloneRisk - 8) },
      { label: isTa ? 'ஞாயிறு' : 'Sun', temp: sstVal - 0.4, wave: Math.max(0.5, waveVal - 0.25), cycloneIndex: Math.max(5, liveCycloneRisk - 14) },
    ];

    // Monthly: aggregate from weekly data in groups
    const monthlySource = weeklyApiData || weekly;
    const chunkSize = Math.max(1, Math.ceil(monthlySource.length / 4));
    const monthly = Array.from({ length: 4 }, (_, wk) => {
      const chunk = monthlySource.slice(wk * chunkSize, (wk + 1) * chunkSize);
      if (chunk.length === 0) return null;
      const avgTemp = chunk.reduce((s, c) => s + c.temp, 0) / chunk.length;
      const avgWave = chunk.reduce((s, c) => s + c.wave, 0) / chunk.length;
      const avgCyclone = chunk.reduce((s, c) => s + c.cycloneIndex, 0) / chunk.length;
      return { label: isTa ? `வாரம் ${wk + 1}` : `Week ${wk + 1}`, temp: parseFloat(avgTemp.toFixed(1)), wave: parseFloat(avgWave.toFixed(2)), cycloneIndex: parseFloat(avgCyclone.toFixed(1)) };
    }).filter(Boolean);

    return { daily, weekly, monthly };
  }, [hourlyData, weeklyApiData, sstVal, waveVal, liveCycloneRisk, isTa]);

  const currentData = dynamicAnalyticsData[timeframe] || dynamicAnalyticsData.weekly;

  const getTimeframeBadge = (tf) => {
    if (isTa) {
      return tf === 'daily' ? 'நாளாந்த' : tf === 'weekly' ? 'வாராந்த' : 'மாதாந்த';
    }
    return tf.toUpperCase();
  };

  const isAnomaly = (row) => {
    return row.cycloneIndex >= 50 || row.temp >= 30.0 || row.wave >= 2.5;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Analytics Controls & Live Telemetry Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-ocean-card p-3 rounded-2xl border border-ocean-border shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <FiRadio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
            <span>{t('liveTelemetryLinked')}</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-700 dark:text-slate-200">SST: {sstVal.toFixed(1)}°C</span>
            <span className="font-mono text-ocean-secondary">Wave: {waveVal.toFixed(2)}m</span>
          </div>

          {activeStorms && activeStorms.length > 0 && (
            <Link
              to="/map"
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors shadow-2xs"
              title="Track Active Tropical Cyclones on Map"
            >
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span>{activeStorms.length} {isTa ? 'செயலில் உள்ள புயல்கள்:' : 'Active Cyclones:'}</span>
              <span className="font-mono text-purple-800 dark:text-purple-200">{activeStorms.map(s => s.name).join(', ')}</span>
              <FiNavigation className="w-3 h-3 ml-0.5" />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-ocean-bg p-1 rounded-xl border border-ocean-border">
          {['daily', 'weekly', 'monthly'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-ocean-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-ocean-primary hover:bg-ocean-card'
              }`}
            >
              {t(tf)}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Analytics Charts Linked to Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Temperature Trend Chart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-ocean-border pb-3">
            <div className="flex items-center gap-2">
              <FiThermometer className="w-4 h-4 text-ocean-primary" />
              <h3 className="text-sm font-bold font-heading text-ocean-text">
                {t('tempChartTitle')}
              </h3>
            </div>
            <Badge variant="info">{getTimeframeBadge(timeframe)}</Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sstGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077B6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0077B6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} />
                <XAxis dataKey="label" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} />
                <YAxis
                  stroke={isDark ? '#94A3B8' : '#64748B'}
                  fontSize={11}
                  domain={[(dataMin) => Math.floor(dataMin - 0.5), (dataMax) => Math.ceil(dataMax + 0.5)]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#1E293B' : '#D6E4F0',
                    color: isDark ? '#F1F5F9' : '#1E293B',
                    borderRadius: '12px',
                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px'
                  }}
                  formatter={(val) => [`${val} °C`, t('sstCol')]}
                />
                <Area type="monotone" dataKey="temp" stroke="#0077B6" strokeWidth={2.5} fillOpacity={1} fill="url(#sstGrad)" name={t('sstLegend')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Wave Trend Chart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-ocean-border pb-3">
            <div className="flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-ocean-secondary" />
              <h3 className="text-sm font-bold font-heading text-ocean-text">
                {t('waveChartTitle')}
              </h3>
            </div>
            <Badge variant="accent">{getTimeframeBadge(timeframe)}</Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} />
                <XAxis dataKey="label" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} />
                <YAxis
                  stroke={isDark ? '#94A3B8' : '#64748B'}
                  fontSize={11}
                  domain={[0, (dataMax) => Math.ceil(dataMax + 1)]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#1E293B' : '#D6E4F0',
                    color: isDark ? '#F1F5F9' : '#1E293B',
                    borderRadius: '12px',
                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px'
                  }}
                  formatter={(val) => [`${val} m`, isTa ? 'அலை உயரம்' : 'Wave Height']}
                />
                <Bar dataKey="wave" fill="#00B4D8" radius={[4, 4, 0, 0]} name={t('waveLegend')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Cyclone Trend Chart */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-ocean-border pb-3">
            <div className="flex items-center gap-2">
              <FiShield className="w-4 h-4 text-ocean-warning" />
              <h3 className="text-sm font-bold font-heading text-ocean-text">
                {t('cycloneChartTitle')}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              {activeStorms && activeStorms.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  {activeStorms.length} {isTa ? 'புயல்கள்' : 'Active'}
                </span>
              )}
              <Badge variant="warning">{getTimeframeBadge(timeframe)}</Badge>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#E2E8F0'} />
                <XAxis dataKey="label" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} />
                <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#1E293B' : '#D6E4F0',
                    color: isDark ? '#F1F5F9' : '#1E293B',
                    borderRadius: '12px',
                    boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '11px'
                  }}
                  formatter={(val) => [`${val}%`, isTa ? 'புயல் அபாயம்' : 'Cyclone Risk Index']}
                />
                <Line type="monotone" dataKey="cycloneIndex" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4 }} name={t('cycloneRisk')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Analytics History Table with Real-Time Mode Switcher */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ocean-border pb-3">
          <div>
            <h3 className="text-sm font-bold font-heading text-ocean-text">
              {tableMode === 'live' ? t('liveSensorStream') : `${t('analyticsTableTitle')} (${getTimeframeBadge(timeframe)})`}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {t('sampleCount')} {tableMode === 'live' ? (telemetryHistory?.length || 0) : currentData.length} {t('intervalsText')}
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-ocean-bg p-1 rounded-xl border border-ocean-border text-xs">
            <button
              onClick={() => setTableMode('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                tableMode === 'live'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 hover:bg-ocean-card'
              }`}
            >
              <FiRadio className="w-3.5 h-3.5" />
              <span>{isTa ? 'நேரலை சென்சார் பதிவுகள்' : 'Real-Time Sensor History'}</span>
            </button>
            <button
              onClick={() => setTableMode('periodic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                tableMode === 'periodic'
                  ? 'bg-ocean-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-ocean-primary hover:bg-ocean-card'
              }`}
            >
              <FiLayers className="w-3.5 h-3.5" />
              <span>{isTa ? 'காலமுறை பகுப்பாய்வு' : 'Periodic Analysis'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {tableMode === 'live' ? (
            /* Live Real-Time Sensor Telemetry Table */
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ocean-bg text-slate-600 border-b border-ocean-border">
                  <th className="p-3 font-bold">{t('recordedAt')}</th>
                  <th className="p-3 font-bold">{t('monitoringStation')}</th>
                  <th className="p-3 font-bold">{t('sstCol')}</th>
                  <th className="p-3 font-bold">{t('waveCol')}</th>
                  <th className="p-3 font-bold">{t('cycloneCol')}</th>
                  <th className="p-3 font-bold">{t('anomalyCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-border/60">
                {(telemetryHistory || []).slice(0, 10).map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-ocean-primaryLight/30 transition-colors">
                    <td className="p-3 font-mono font-medium text-slate-700 flex items-center gap-2">
                      {idx === 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500 text-white animate-pulse">
                          {t('liveBadgeText')}
                        </span>
                      )}
                      <span>{row.time}</span>
                    </td>
                    <td className="p-3 font-semibold text-ocean-text">{row.station}</td>
                    <td className="p-3 font-mono text-ocean-primary font-bold">{row.sst} °C</td>
                    <td className="p-3 font-mono text-ocean-secondary font-bold">{row.wave} m</td>
                    <td className="p-3 font-mono font-bold text-ocean-text">{row.cycloneIndex}%</td>
                    <td className="p-3">
                      <Badge variant={row.status === 'Elevated Anomaly' ? 'warning' : 'success'}>
                        {row.status === 'Elevated Anomaly' ? t('elevatedAnomaly') : t('normalClimatology')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Periodic Climatological Historical Table */
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-ocean-bg text-slate-600 border-b border-ocean-border">
                  <th className="p-3 font-bold">{t('timeInterval')}</th>
                  <th className="p-3 font-bold">{t('sstCol')}</th>
                  <th className="p-3 font-bold">{t('waveCol')}</th>
                  <th className="p-3 font-bold">{t('cycloneCol')}</th>
                  <th className="p-3 font-bold">{t('anomalyCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-border/60">
                {currentData.map((row, idx) => {
                  const elevated = isAnomaly(row);
                  return (
                    <tr key={idx} className="hover:bg-ocean-primaryLight/30 transition-colors">
                      <td className="p-3 font-semibold text-ocean-text">{row.label}</td>
                      <td className="p-3 font-mono text-ocean-primary font-bold">{row.temp} °C</td>
                      <td className="p-3 font-mono text-ocean-secondary font-bold">{row.wave} m</td>
                      <td className="p-3 font-mono font-bold text-ocean-text">{row.cycloneIndex}%</td>
                      <td className="p-3">
                        <Badge variant={elevated ? 'warning' : 'success'}>
                          {elevated ? t('elevatedAnomaly') : t('normalClimatology')}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

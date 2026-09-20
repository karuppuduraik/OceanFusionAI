import React, { useState, useEffect } from 'react';
import {
  FiClock,
  FiSearch,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiCalendar,
  FiActivity,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SSTTrendChart from '../components/charts/SSTTrendChart';
import { mockApiService } from '../services/mockApiService';
import { exportToCSV } from '../services/csvExportService';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [allFiltered, setAllFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useNotification();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await mockApiService.getHistoricalRecords({
        page,
        limit: 10,
        search,
        region: regionFilter,
        risk: riskFilter,
        sortBy,
        sortOrder
      });
      setRecords(res.data);
      setAllFiltered(res.allFilteredData);
      setTotalPages(res.totalPages);
      setTotalRecords(res.totalRecords);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, search, regionFilter, riskFilter, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    if (!allFiltered.length) {
      addToast({ title: 'No Data', message: 'No records available for export under current filter.', type: 'warning' });
      return;
    }

    const filename = `oceanfusion_historical_telemetry_${new Date().toISOString().slice(0,10)}.csv`;
    const success = exportToCSV(allFiltered, filename);

    if (success) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
      addToast({
        title: 'CSV Export Initiated',
        message: `Successfully downloaded ${allFiltered.length} telemetry records as ${filename}.`,
        type: 'success',
        duration: 4000
      });
    }
  };

  // Convert latest 12 records for the trend chart above the table
  const chartPoints = records.slice(0, 10).reverse().map((r, i) => ({
    time: r.timestamp.slice(11, 16) || `T-${i}`,
    sst: r.sst,
    waveHeight: r.waveHeight,
    currentSpeed: r.currentSpeed
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel-deep p-5 rounded-3xl border border-ocean-sky/40 dark:border-ocean-borderDark shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-ocean-navy to-ocean-teal text-white shadow-glow-teal">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
              Historical Sensor Telemetry Records &amp; Export
            </h2>
            <p className="text-xs text-slate-500 dark:text-ocean-sky/70">
              Query, filter and download multi-sensor historical logs ({totalRecords} total entries)
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={FiDownload}
          onClick={handleExportCSV}
          className="shadow-glow-teal"
        >
          Export Dataset (CSV)
        </Button>
      </div>

      {/* Supporting Time Series Mini-Chart */}
      <Card className="p-6">
        <SSTTrendChart data={chartPoints} title="Historical Telemetry Series (Page View)" />
      </Card>

      {/* Filters and Search Bar */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-ocean-sky/60" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search station ID, name or basin..."
              className="w-full bg-white/70 dark:bg-ocean-deep/70 text-slate-900 dark:text-ocean-surface placeholder-slate-400 dark:placeholder-ocean-sky/40 text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-ocean-sky/40 dark:border-ocean-borderDark focus:outline-none focus:ring-2 focus:ring-ocean-teal"
            />
          </div>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => { setRegionFilter(e.target.value); setPage(1); }}
            className="w-full rounded-xl border bg-white/70 dark:bg-ocean-deep text-slate-900 dark:text-ocean-surface text-xs px-3 py-2.5 border-ocean-sky/40 dark:border-ocean-borderDark focus:outline-none focus:ring-2 focus:ring-ocean-teal"
          >
            <option value="all">All Ocean Sectors</option>
            <option value="Bay of Bengal">Bay of Bengal</option>
            <option value="Arabian Sea">Arabian Sea</option>
            <option value="Equatorial">Equatorial Indian</option>
            <option value="Andaman">Andaman Sea</option>
            <option value="Coromandel">Coromandel Coast</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
            className="w-full rounded-xl border bg-white/70 dark:bg-ocean-deep text-slate-900 dark:text-ocean-surface text-xs px-3 py-2.5 border-ocean-sky/40 dark:border-ocean-borderDark focus:outline-none focus:ring-2 focus:ring-ocean-teal"
          >
            <option value="all">All Severity States</option>
            <option value="Nominal">Nominal</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High Swell</option>
            <option value="Critical">Critical Threat</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-ocean-sky/30 dark:border-ocean-borderDark">
          <table className="w-full text-left text-xs">
            <thead className="bg-ocean-sky/15 dark:bg-ocean-deep/80 border-b border-ocean-sky/30 dark:border-ocean-borderDark text-slate-600 dark:text-ocean-sky font-semibold uppercase tracking-wider">
              <tr>
                <th
                  onClick={() => handleSort('timestamp')}
                  className="py-3 px-4 cursor-pointer hover:text-ocean-teal select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Timestamp</span>
                    {sortBy === 'timestamp' && (sortOrder === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-4">Station ID &amp; Name</th>
                <th className="py-3 px-4">Ocean Sector</th>
                <th
                  onClick={() => handleSort('sst')}
                  className="py-3 px-4 cursor-pointer hover:text-ocean-teal select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>SST (°C)</span>
                    {sortBy === 'sst' && (sortOrder === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('waveHeight')}
                  className="py-3 px-4 cursor-pointer hover:text-ocean-teal select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Wave (m)</span>
                    {sortBy === 'waveHeight' && (sortOrder === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-4">Current Speed</th>
                <th className="py-3 px-4">Salinity</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4">QC Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-sky/15 dark:divide-ocean-borderDark/40 font-mono">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-ocean-teal/10 transition-colors">
                  <td className="py-3 px-4 font-sans text-slate-500 dark:text-slate-300 whitespace-nowrap">{r.timestamp}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-ocean-navy dark:text-ocean-surface">{r.stationName}</td>
                  <td className="py-3 px-4 font-sans text-ocean-sky">{r.region}</td>
                  <td className="py-3 px-4 font-bold text-rose-400">{r.sst}</td>
                  <td className="py-3 px-4 font-bold text-ocean-teal">{r.waveHeight}</td>
                  <td className="py-3 px-4 text-slate-200">{r.currentSpeed} m/s</td>
                  <td className="py-3 px-4 text-slate-300">{r.salinity} PSU</td>
                  <td className="py-3 px-4 font-sans">
                    <Badge
                      variant={r.riskStatus === 'Critical' ? 'danger' : r.riskStatus === 'High' ? 'warning' : 'teal'}
                      size="sm"
                    >
                      {r.riskStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-sans text-[11px] text-emerald-400">{r.qcFlag}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                    No historical logs matched your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-ocean-sky/80">
          <span>
            Showing <strong>{records.length > 0 ? (page - 1) * 10 + 1 : 0}</strong> -{' '}
            <strong>{Math.min(page * 10, totalRecords)}</strong> of <strong>{totalRecords}</strong> records
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-ocean-sky/20 dark:bg-ocean-deep text-ocean-navy dark:text-ocean-sky disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ocean-teal/20 transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-2">Page {page} of {totalPages || 1}</span>
            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-xl bg-ocean-sky/20 dark:bg-ocean-deep text-ocean-navy dark:text-ocean-sky disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ocean-teal/20 transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

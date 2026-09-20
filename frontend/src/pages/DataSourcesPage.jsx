import React, { useState } from 'react';
import {
  FiDatabase,
  FiRefreshCw,
  FiCode,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiActivity,
  FiShield
} from 'react-icons/fi';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import DataStreamModal from '../components/sources/DataStreamModal';
import { mockDataSources } from '../data/mockDataSources';
import { mockApiService } from '../services/mockApiService';
import { useNotification } from '../context/NotificationContext';

export default function DataSourcesPage() {
  const [sources, setSources] = useState(mockDataSources);
  const [syncingSourceId, setSyncingSourceId] = useState(null);
  const [selectedSourceForSchema, setSelectedSourceForSchema] = useState(null);
  const { addToast } = useNotification();

  const handleSyncSource = async (sourceId) => {
    setSyncingSourceId(sourceId);
    try {
      const updated = await mockApiService.syncDataSource(sourceId);
      setSources(prev => prev.map(s => s.id === sourceId ? { ...s, ping: updated.ping } : s));
      addToast({
        title: 'Telemetry Pipeline Refreshed',
        message: `Synced latest satellite & in-situ frames from ${sourceId.toUpperCase()}.`,
        type: 'success',
        duration: 3000
      });
    } catch (e) {
      addToast({ title: 'Sync Failure', message: 'Unable to reach provider endpoint.', type: 'error' });
    } finally {
      setSyncingSourceId(null);
    }
  };

  const handleSyncAll = async () => {
    setSyncingSourceId('all');
    await new Promise(r => setTimeout(r, 1200));
    setSources(prev => prev.map(s => ({ ...s, ping: `${Math.floor(20 + Math.random() * 40)} ms` })));
    setSyncingSourceId(null);
    addToast({
      title: 'Global Data Pipeline Re-Assimilated',
      message: 'All 4 spatial remote sensing and buoy streams synchronized successfully.',
      type: 'success',
      duration: 4000
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel-deep p-5 rounded-3xl border border-ocean-sky/40 dark:border-ocean-borderDark shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-ocean-navy to-ocean-teal text-white shadow-glow-teal">
            <FiDatabase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
              Assimilated Oceanographic Ingestion Sources
            </h2>
            <p className="text-xs text-slate-500 dark:text-ocean-sky/70">
              Multi-source satellite altimetry, radiometry, and moored OMNI buoy array pipelines
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={FiRefreshCw}
          isLoading={syncingSourceId === 'all'}
          onClick={handleSyncAll}
          className="shadow-glow-teal"
        >
          Sync All Feeds
        </Button>
      </div>

      {/* 4 Data Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((source) => {
          const isSyncing = syncingSourceId === source.id;

          return (
            <Card key={source.id} hoverEffect className="p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-ocean-sky/15 dark:bg-ocean-deep/80 border border-ocean-sky/30">
                      {source.logo}
                    </span>
                    <div>
                      <h3 className="text-base font-bold font-heading text-ocean-navy dark:text-ocean-surface">
                        {source.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-ocean-sky/70">{source.organization}</p>
                    </div>
                  </div>

                  <Badge variant="success" dot size="sm">
                    {source.status}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {source.description}
                </p>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-ocean-sky/15 dark:border-ocean-borderDark/40 text-xs">
                  <div className="p-2.5 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/60 border border-ocean-sky/20">
                    <span className="text-slate-400 block text-[10px]">Ping Latency</span>
                    <strong className="text-emerald-400 font-mono">{source.ping}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/60 border border-ocean-sky/20">
                    <span className="text-slate-400 block text-[10px]">Update Rate</span>
                    <span className="text-ocean-sky font-semibold text-[11px] truncate block">{source.updateFrequency}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/60 border border-ocean-sky/20 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px]">Reliability SLA</span>
                    <strong className="text-ocean-teal font-mono">{source.reliability}</strong>
                  </div>
                </div>

                {/* Variables List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-ocean-sky/60 block">
                    Available Sensor Variables:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {source.variables.map((variable, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-white/60 dark:bg-ocean-deep/80 text-ocean-navy dark:text-ocean-sky text-[11px] font-medium border border-ocean-sky/30 dark:border-ocean-borderDark"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-ocean-sky/20 dark:border-ocean-borderDark">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={FiCode}
                  onClick={() => setSelectedSourceForSchema(source)}
                >
                  Inspect JSON Schema
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  icon={FiRefreshCw}
                  isLoading={isSyncing}
                  onClick={() => handleSyncSource(source.id)}
                >
                  Sync Feed
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Schema Inspector Modal */}
      <DataStreamModal
        source={selectedSourceForSchema}
        isOpen={!!selectedSourceForSchema}
        onClose={() => setSelectedSourceForSchema(null)}
      />
    </div>
  );
}

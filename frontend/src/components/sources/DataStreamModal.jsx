import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FiCopy, FiCheck, FiTerminal, FiDatabase } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';

export default function DataStreamModal({ source, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useNotification();
  if (!source) return null;

  const jsonString = JSON.stringify(source.sampleSchema, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(jsonString);
    setCopied(true);
    addToast({
      title: 'JSON Copied',
      message: `${source.name} telemetry schema copied to clipboard.`,
      type: 'info',
      duration: 2000
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${source.name} Stream Schema`}
      subtitle={`Provider: ${source.organization} • Latency: ${source.ping}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-ocean-sky">
          <div className="flex items-center gap-2">
            <FiDatabase className="w-4 h-4 text-ocean-teal" />
            <span>Format: OGC Sensor Observation Service (SOS) / GeoJSON REST Stream</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            icon={copied ? FiCheck : FiCopy}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy JSON'}
          </Button>
        </div>

        {/* Code View */}
        <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-xs text-ocean-sky border border-ocean-teal/30 overflow-x-auto max-h-[350px]">
          <pre>{jsonString}</pre>
        </div>

        {/* Data Description */}
        <div className="p-3.5 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/60 border border-ocean-sky/20 dark:border-ocean-borderDark text-xs space-y-1">
          <strong className="text-ocean-navy dark:text-ocean-surface font-semibold block">
            Assimilation Pipeline Specs:
          </strong>
          <p className="text-slate-600 dark:text-ocean-sky/80">
            {source.description} Data is normalized via NetCDF-4 spatial regridding prior to feeding into the CNN-LSTM and XGBoost inference pipelines.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </Modal>
  );
}

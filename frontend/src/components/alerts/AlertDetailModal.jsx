import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { FiAlertTriangle, FiCheckCircle, FiShare2, FiDownload, FiMapPin, FiClock, FiShield } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';

export default function AlertDetailModal({ alert, isOpen, onClose, onAcknowledge }) {
  const { addToast } = useNotification();
  if (!alert) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(`[EMERGENCY ADVISORY] ${alert.title} — Region: ${alert.region}. Details: ${alert.description}`);
    addToast({
      title: 'Alert Copied',
      message: 'Advisory bulletin text copied to clipboard for emergency dissemination.',
      type: 'success',
      duration: 3000
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={alert.title}
      subtitle={`Issued by ${alert.issuedBy} • ${alert.timestamp}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Severity Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          alert.severity === 'danger'
            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
            : alert.severity === 'warning'
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
            : 'bg-ocean-teal/15 border-ocean-teal/40 text-ocean-sky'
        }`}>
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-white">{alert.category}</p>
              <p className="text-xs opacity-90">Location: {alert.region} ({alert.coordinates})</p>
            </div>
          </div>
          <Badge
            variant={alert.severity === 'danger' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'teal'}
            dot
            size="md"
          >
            {alert.severity}
          </Badge>
        </div>

        {/* Narrative Description */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-1.5">
            Meteorological Situation & Impact
          </h5>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-white/50 dark:bg-ocean-deep/60 p-4 rounded-2xl border border-ocean-sky/30 dark:border-ocean-borderDark">
            {alert.description}
          </p>
        </div>

        {/* Hydrodynamic Telemetry Metrics */}
        {alert.metrics && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-2">
              Associated Ocean State Metrics
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/50 border border-ocean-sky/20 dark:border-ocean-borderDark text-xs">
                <span className="text-slate-400 block text-[10px]">Sustained Wind</span>
                <strong className="text-white font-mono text-sm">{alert.metrics.windSpeed}</strong>
              </div>
              <div className="p-3 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/50 border border-ocean-sky/20 dark:border-ocean-borderDark text-xs">
                <span className="text-slate-400 block text-[10px]">Wave Swell</span>
                <strong className="text-ocean-teal font-mono text-sm">{alert.metrics.waveSwell}</strong>
              </div>
              <div className="p-3 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/50 border border-ocean-sky/20 dark:border-ocean-borderDark text-xs">
                <span className="text-slate-400 block text-[10px]">Center Pressure</span>
                <strong className="text-white font-mono text-sm">{alert.metrics.centralPressure}</strong>
              </div>
              <div className="p-3 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/50 border border-ocean-sky/20 dark:border-ocean-borderDark text-xs">
                <span className="text-slate-400 block text-[10px]">Storm Surge</span>
                <strong className="text-amber-400 font-mono text-sm">{alert.metrics.stormSurge}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Sector-Specific Emergency Directives */}
        {alert.advisoryDetails && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky">
              Actionable Directives by Sector
            </h5>
            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <strong className="text-rose-400 font-bold block mb-1">🎣 Artisanal & Deep-Sea Fishermen Advisory:</strong>
                <p className="text-slate-200">{alert.advisoryDetails.fishermen}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <strong className="text-amber-400 font-bold block mb-1">🚢 Port Authorities & Maritime Traffic:</strong>
                <p className="text-slate-200">{alert.advisoryDetails.ports}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <strong className="text-ocean-sky font-bold block mb-1">🛡️ Coastal Disaster Management & Evacuation:</strong>
                <p className="text-slate-200">{alert.advisoryDetails.coastalDefense}</p>
              </div>
            </div>
          </div>
        )}

        {/* Affected Ports & Districts */}
        {alert.affectedAreas && alert.affectedAreas.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-2">
              Vulnerable Coastal Landing Centres
            </h5>
            <div className="flex flex-wrap gap-2">
              {alert.affectedAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-ocean-sky/20 dark:bg-ocean-deep/80 border border-ocean-sky/40 dark:border-ocean-borderDark text-xs font-semibold text-ocean-navy dark:text-ocean-sky flex items-center gap-1.5"
                >
                  <FiMapPin className="w-3.5 h-3.5 text-ocean-teal" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-ocean-sky/20 dark:border-ocean-borderDark">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={FiShare2}
              onClick={handleShare}
            >
              Share Bulletin
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            {alert.status !== 'acknowledged' ? (
              <Button
                variant="primary"
                size="sm"
                icon={FiCheckCircle}
                onClick={() => {
                  onAcknowledge(alert.id);
                  onClose();
                }}
              >
                Acknowledge Alert
              </Button>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <FiCheckCircle className="w-4 h-4" /> Acknowledged by Command
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

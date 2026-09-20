import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { FiSend, FiAlertTriangle } from 'react-icons/fi';
import { useNotification } from '../../context/NotificationContext';
import confetti from 'canvas-confetti';

export default function BroadcastAlertModal({ isOpen, onClose, onBroadcast }) {
  const { addToast } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    region: 'Bay of Bengal (Northern Sector)',
    coordinates: '18.4°N, 89.2°E',
    severity: 'danger',
    category: 'Cyclone Threat',
    issuedBy: 'INCOIS Disaster Management Cell',
    description: '',
    affectedAreas: 'Paradip, Dhamra, Sagar Island',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      addToast({
        title: 'Incomplete Advisory',
        message: 'Please provide both an alert title and detailed impact description.',
        type: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    const newAlert = {
      ...formData,
      affectedAreas: formData.affectedAreas.split(',').map(s => s.trim()),
      timestamp: 'Just now',
      metrics: {
        windSpeed: '95 km/h',
        waveSwell: '3.8 meters',
        centralPressure: '992 hPa',
        stormSurge: '1.2 meters'
      },
      advisoryDetails: {
        fishermen: 'Immediate shore return advised. Cease all gillnet and longline operations.',
        ports: 'Hoisting Sectional Warning Signal 3.',
        coastalDefense: 'Disaster management personnel on stand-by.'
      }
    };

    onBroadcast(newAlert);
    setIsSubmitting(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    addToast({
      title: 'Emergency Advisory Broadcasted',
      message: `Dispatched "${formData.title}" across active maritime channels.`,
      type: 'danger',
      duration: 5000
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast Maritime Emergency Advisory"
      subtitle="Issue real-time early warning bulletins to port authorities, fishermen and coastal agencies"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Advisory Title"
          placeholder="e.g., Severe Swell Surge & Sea Inundation Alert"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Severity Level"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            options={[
              { value: 'danger', label: 'Critical / Danger (Red Alert)' },
              { value: 'warning', label: 'Severe Warning (Amber Alert)' },
              { value: 'advisory', label: 'Precautionary Advisory (Teal Alert)' },
              { value: 'safe', label: 'Nominal Operations (Green Notice)' },
            ]}
          />

          <Select
            label="Threat Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'Cyclone Threat', label: 'Cyclone / Tropical Storm' },
              { value: 'High Wave Advisory', label: 'High Wave & Swell Surge' },
              { value: 'Tsunami Early Warning', label: 'Tsunami Early Warning' },
              { value: 'Ecological Threat', label: 'Marine Heatwave / Coral Bleaching' },
              { value: 'Water Quality', label: 'Hypoxia / Algal Bloom' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Affected Ocean Basin / Region"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            required
          />

          <Input
            label="Geographic Coordinates"
            value={formData.coordinates}
            onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
            placeholder="15.4°N, 82.5°E"
          />
        </div>

        <Input
          label="Vulnerable Coastal Areas / Landing Centers (Comma separated)"
          value={formData.affectedAreas}
          onChange={(e) => setFormData({ ...formData, affectedAreas: e.target.value })}
          placeholder="Chennai, Nagapattinam, Cuddalore"
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-1.5">
            Operational Directives & Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Specify observed wave heights, wind dynamics, and clear action items for coastal communities..."
            className="w-full rounded-xl border bg-white/70 dark:bg-ocean-deep/70 text-slate-900 dark:text-ocean-surface placeholder-slate-400 dark:placeholder-ocean-sky/40 text-sm p-3.5 border-ocean-sky/50 dark:border-ocean-borderDark focus:outline-none focus:ring-2 focus:ring-ocean-teal"
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ocean-sky/20 dark:border-ocean-borderDark">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isSubmitting}
            icon={FiSend}
          >
            Broadcast Emergency Alert
          </Button>
        </div>
      </form>
    </Modal>
  );
}

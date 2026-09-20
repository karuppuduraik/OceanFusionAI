import React, { useState } from 'react';
import {
  FiSettings,
  FiUser,
  FiMoon,
  FiSun,
  FiBell,
  FiVolume2,
  FiGlobe,
  FiSliders,
  FiCheckCircle,
  FiSave,
  FiRefreshCw
} from 'react-icons/fi';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Toggle from '../components/common/Toggle';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useOceanData } from '../context/OceanDataContext';
import { useNotification } from '../context/NotificationContext';
import confetti from 'canvas-confetti';

export default function SettingsPage() {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const { user, updateProfile } = useAuth();
  const {
    unitSystem,
    setUnitSystem,
    refreshIntervalSec,
    setRefreshIntervalSec,
    activeRegion,
    setActiveRegion,
    regionsList
  } = useOceanData();
  const { soundEnabled, toggleSound, addToast } = useNotification();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Dr. Maya Sen',
    email: user?.email || 'research@oceanfusion.ai',
    role: user?.role || 'Chief Oceanographer',
    organization: user?.organization || 'National Institute of Oceanography',
    avatar: localStorage.getItem(`oceanfusion_avatar_${user?.id}`) || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=0284c7`
  });

  // App notification state
  const [notifs, setNotifs] = useState({
    cycloneSiren: true,
    highWaveAlert: true,
    sensorDropout: false,
    dailySummary: true,
  });

  const [language, setLanguage] = useState('English (EN)');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateProfile(profileForm);
    setIsSaving(false);

    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 }
    });

    addToast({
      title: 'Preferences Saved',
      message: 'User profile and operational thresholds updated successfully.',
      type: 'success',
      duration: 3500
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel-deep p-5 rounded-3xl border border-ocean-sky/40 dark:border-ocean-borderDark shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-ocean-navy to-ocean-teal text-white shadow-glow-teal">
            <FiSettings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
              System Settings &amp; Global Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-ocean-sky/70">
              Customize units, display themes, telemetry intervals, and user profiles
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Profile Configuration (1 col) */}
        <Card className="lg:col-span-1 p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-ocean-sky/20 dark:border-ocean-borderDark pb-3">
            <FiUser className="w-4 h-4 text-ocean-teal" />
            <h3 className="text-sm font-bold font-heading text-ocean-navy dark:text-ocean-surface">
              User Profile &amp; Role
            </h3>
          </div>

          {/* Profile Card Preview */}
          <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-2xl bg-ocean-sky/15 dark:bg-ocean-deep/60 border border-ocean-sky/20">
            <img
              src={profileForm.avatar}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-ocean-teal shadow-md"
            />
            <div>
              <h4 className="text-sm font-bold text-ocean-navy dark:text-ocean-surface">{profileForm.name}</h4>
              <p className="text-xs text-ocean-teal font-semibold">{profileForm.role}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{profileForm.organization}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
            <Input
              label="Email Address"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <Input
              label="Professional Role"
              value={profileForm.role}
              onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
            />
            <Input
              label="Organization / Institute"
              value={profileForm.organization}
              onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
            />
            <Input
              label="Avatar Image URL"
              value={profileForm.avatar}
              onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isSaving}
              icon={FiSave}
            >
              Update Profile
            </Button>
          </form>
        </Card>

        {/* Right Column: Preferences (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Display & Theme Preferences */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-ocean-sky/20 dark:border-ocean-borderDark pb-3">
              <FiSun className="w-4 h-4 text-ocean-teal" />
              <h3 className="text-sm font-bold font-heading text-ocean-navy dark:text-ocean-surface">
                Appearance &amp; Measurement Units
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Theme Choice */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-2">
                  Theme Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-colors ${
                      isDark
                        ? 'bg-ocean-deep border-ocean-teal text-white ring-1 ring-ocean-teal'
                        : 'bg-white/40 dark:bg-ocean-deep/60 border-ocean-sky/30 text-slate-700'
                    }`}
                  >
                    <FiMoon className="w-4 h-4 text-ocean-teal" />
                    <div>
                      <p className="text-xs font-bold">Deep Ocean</p>
                      <p className="text-[10px] opacity-75">Dark Mode</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-colors ${
                      !isDark
                        ? 'bg-white border-ocean-teal text-ocean-navy ring-1 ring-ocean-teal shadow-md'
                        : 'bg-white/40 dark:bg-ocean-deep/60 border-ocean-sky/30 text-ocean-sky'
                    }`}
                  >
                    <FiSun className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold">Ocean Surface</p>
                      <p className="text-[10px] opacity-75">Light Mode</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Units Choice */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ocean-navy dark:text-ocean-sky mb-2">
                  Unit System
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUnitSystem('metric');
                      addToast({ title: 'Metric Units Set', message: 'Displaying °C, meters, and km/h.', type: 'info' });
                    }}
                    className={`p-3 rounded-2xl border text-left transition-colors ${
                      unitSystem === 'metric'
                        ? 'bg-ocean-teal/20 border-ocean-teal text-ocean-navy dark:text-white ring-1 ring-ocean-teal font-bold'
                        : 'bg-white/40 dark:bg-ocean-deep/60 border-ocean-sky/30 text-slate-600 dark:text-ocean-sky'
                    }`}
                  >
                    <p className="text-xs">Metric (SI)</p>
                    <p className="text-[10px] opacity-75">°C, m, km/h, m/s</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUnitSystem('imperial');
                      addToast({ title: 'Nautical / Imperial Set', message: 'Displaying °F, feet, and knots.', type: 'info' });
                    }}
                    className={`p-3 rounded-2xl border text-left transition-colors ${
                      unitSystem === 'imperial'
                        ? 'bg-ocean-teal/20 border-ocean-teal text-ocean-navy dark:text-white ring-1 ring-ocean-teal font-bold'
                        : 'bg-white/40 dark:bg-ocean-deep/60 border-ocean-sky/30 text-slate-600 dark:text-ocean-sky'
                    }`}
                  >
                    <p className="text-xs">Nautical</p>
                    <p className="text-[10px] opacity-75">°F, ft, knots</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Language & Refresh Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-ocean-sky/15 dark:border-ocean-borderDark/40">
              <Select
                label="Language / Region"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                options={[
                  { value: 'English (EN)', label: 'English (EN)' },
                  { value: 'Tamil (தமிழ்)', label: 'Tamil (தமிழ்)' },
                  { value: 'Hindi (हिन्दी)', label: 'Hindi (हिन्दी)' },
                  { value: 'Telugu (తెలుగు)', label: 'Telugu (తెలుగు)' },
                  { value: 'Malayalam (മലയാളം)', label: 'Malayalam (മലയാളം)' },
                  { value: 'Odia (ଓଡ଼ିଆ)', label: 'Odia (ଓଡ଼ିଆ)' },
                ]}
              />

              <Select
                label="Live Telemetry Polling Rate"
                value={refreshIntervalSec}
                onChange={(e) => setRefreshIntervalSec(Number(e.target.value))}
                options={[
                  { value: 5, label: 'Fast (Every 5 seconds)' },
                  { value: 10, label: 'Standard (Every 10 seconds)' },
                  { value: 30, label: 'Low Bandwidth (Every 30 seconds)' },
                  { value: 60, label: 'Battery Saver (Every 60 seconds)' },
                ]}
              />
            </div>
          </Card>

          {/* Emergency Alert & Sound Thresholds */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-ocean-sky/20 dark:border-ocean-borderDark pb-3">
              <FiBell className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold font-heading text-ocean-navy dark:text-ocean-surface">
                Early Warning &amp; Broadcast Dispatch Preferences
              </h3>
            </div>

            <div className="space-y-2">
              <Toggle
                label="Audible Emergency Siren Alert"
                description="Play simulated audible alert chime when Category 3+ cyclone alert is detected"
                checked={soundEnabled}
                onChange={toggleSound}
              />
              <Toggle
                label="High Swell Surge Alerts"
                description="Trigger coastal warning when significant wave height exceeds 3.0 meters"
                checked={notifs.highWaveAlert}
                onChange={(val) => setNotifs({ ...notifs, highWaveAlert: val })}
              />
              <Toggle
                label="Buoy Battery / Telemetry Dropouts"
                description="Notify if INCOIS or ARGO float fails consecutive QC checks"
                checked={notifs.sensorDropout}
                onChange={(val) => setNotifs({ ...notifs, sensorDropout: val })}
              />
              <Toggle
                label="Daily Synoptic Maritime Summary"
                description="Generate automated 24h ocean hydrodynamics digest at 06:00 UTC"
                checked={notifs.dailySummary}
                onChange={(val) => setNotifs({ ...notifs, dailySummary: val })}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

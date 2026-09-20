import L from 'leaflet';

// Custom SVG HTML Buoy Icon with pulsating radar ring
export const createBuoyIcon = (status = 'Nominal') => {
  const isHighAlert = status.includes('Advisory') || status.includes('Alert') || status.includes('Watch');
  const color = isHighAlert ? '#F59E0B' : '#19A7CE';
  const pulseColor = isHighAlert ? 'rgba(245, 158, 11, 0.4)' : 'rgba(25, 167, 206, 0.4)';

  return L.divIcon({
    className: 'custom-buoy-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${pulseColor}; animation: beaconPulse 2s infinite ease-out;"></div>
        <div style="width: 22px; height: 22px; border-radius: 50%; background: #0B2447; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color};">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Custom Ship Icon with heading rotation
export const createShipIcon = (course = 0, type = 'Research') => {
  const isResearch = type.includes('Research');
  const color = isResearch ? '#38E5FF' : '#AFD3E2';

  return L.divIcon({
    className: 'custom-ship-marker',
    html: `
      <div style="transform: rotate(${course}deg); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="${color}" stroke="#0B2447" stroke-width="1.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
          <path d="M12 2 L19 21 L12 17 L5 21 Z" />
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// Cyclone Eye Icon with spinning vortex
export const createCycloneIcon = () => {
  return L.divIcon({
    className: 'custom-cyclone-marker',
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(225, 29, 72, 0.35); animation: beaconPulse 1.5s infinite;"></div>
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #991B1B; border: 2.5px solid #F43F5E; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px #E11D48;">
          <svg class="animate-spin-slow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2.5">
            <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
            <path d="M12 2 C16 4, 20 8, 22 12" stroke-linecap="round"/>
            <path d="M12 22 C8 20, 4 16, 2 12" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

// Water quality station icon
export const createWaterQualityIcon = (wqi = 80) => {
  const color = wqi > 80 ? '#10B981' : wqi > 65 ? '#F59E0B' : '#EF4444';
  return L.divIcon({
    className: 'custom-wq-marker',
    html: `
      <div style="width: 24px; height: 24px; border-radius: 8px; background: #0B2447; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px ${color};">
        <span style="font-size: 10px; font-weight: bold; color: ${color};">WQ</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

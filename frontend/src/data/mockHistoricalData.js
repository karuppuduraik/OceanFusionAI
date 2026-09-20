const stations = [
  { id: 'INCOIS-BD08', name: 'Bay of Bengal Deep Buoy BD08', region: 'Bay of Bengal (North)' },
  { id: 'INCOIS-BD09', name: 'Bay of Bengal Moored BD09', region: 'Bay of Bengal (Central)' },
  { id: 'INCOIS-BD11', name: 'Chennai Coastal WRB BD11', region: 'Coromandel Coast' },
  { id: 'INCOIS-AD02', name: 'Arabian Sea Offshore AD02', region: 'Arabian Sea (Central)' },
  { id: 'INCOIS-AD06', name: 'Mumbai Offshore Buoy AD06', region: 'Konkan Coast' },
  { id: 'ARGO-IND-290', name: 'Equatorial Drifter Float #290', region: 'Equatorial Indian' },
  { id: 'NOAA-CRW-104', name: 'Gulf of Mannar Coral Array', region: 'Palk Strait' },
  { id: 'BUOY-AND-04', name: 'Port Blair Deep Trench Buoy', region: 'Andaman Sea' },
];

const riskLevels = ['Nominal', 'Low', 'Moderate', 'High', 'Critical'];

// Generate 120 realistic historical records
export const mockHistoricalRecords = Array.from({ length: 120 }, (_, index) => {
  const station = stations[index % stations.length];
  const daysAgo = Math.floor(index / 4);
  const hoursAgo = (index % 4) * 6;
  const date = new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 3600 * 1000);
  
  // Realistic variance
  const sst = Number((27.2 + Math.sin(index * 0.4) * 2.2 + (index % 3) * 0.3).toFixed(2));
  const waveHeight = Number((1.1 + Math.cos(index * 0.5) * 1.4 + (index % 5) * 0.2).toFixed(2));
  const currentSpeed = Number((0.8 + Math.sin(index * 0.3) * 0.9 + 0.3).toFixed(2));
  const windSpeed = Number((14.0 + Math.sin(index * 0.6) * 18.0 + 10.0).toFixed(1));
  const salinity = Number((33.2 + Math.sin(index * 0.2) * 2.1).toFixed(2));
  const pressure = Number((1006.0 + Math.cos(index * 0.3) * 8.0).toFixed(1));
  const riskIndex = Math.min(4, Math.max(0, Math.floor((waveHeight > 2.8 || sst > 30.0 ? 3 : waveHeight > 2.0 ? 2 : 0) + (index % 2))));
  const risk = riskLevels[riskIndex];
  
  return {
    id: `REC-2026-${(1000 + index).toString()}`,
    timestamp: date.toISOString().replace('T', ' ').substring(0, 19),
    stationId: station.id,
    stationName: station.name,
    region: station.region,
    sst,
    waveHeight,
    currentSpeed,
    windSpeed,
    salinity,
    pressure,
    cycloneRiskScore: Math.round(15 + Math.sin(index * 0.3) * 40 + (riskIndex * 10)),
    riskStatus: risk,
    qcFlag: index % 15 === 0 ? 'Suspect (Interpolated)' : 'Good (Pass 100%)',
  };
});

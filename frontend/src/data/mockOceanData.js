// Comprehensive Mock Data for OceanFusion AI Research Platform

export const initialOceanState = {
  seaSurfaceTemperature: 28.4,
  waveHeight: 2.15,
  windSpeed: 24.5,
  atmosphericPressure: 1008,
  humidity: 84,
  oceanCurrentSpeed: 1.85,
  lastUpdated: new Date().toISOString()
};

export const summaryMetrics = {
  seaSurfaceTemperature: {
    value: 28.4,
    unit: '°C',
    change: '+0.5 °C',
    status: 'warning', // warning due to positive thermal anomaly
    label: 'Sea Surface Temp'
  },
  waveHeight: {
    value: 2.15,
    unit: 'm',
    change: '+0.25 m',
    status: 'normal',
    label: 'Significant Wave Height'
  },
  windSpeed: {
    value: 24.5,
    unit: 'km/h',
    change: '+1.8 km/h',
    status: 'normal',
    label: 'Wind Speed'
  },
  cycloneRisk: {
    value: 38,
    unit: '%',
    change: 'Moderate Threat',
    status: 'warning',
    label: 'Cyclone Risk Index'
  },
  predictionAccuracy: {
    value: 96.8,
    unit: '%',
    change: 'CNN-LSTM Spatiotemporal Net',
    status: 'success',
    label: 'Prediction Accuracy'
  },
  lastUpdated: {
    value: 'Just Now',
    unit: '',
    change: 'INCOIS & NOAA Live Sync',
    status: 'info',
    label: 'Last Updated'
  }
};

export const dashboardTrendData = [
  { time: '00:00', sst: 27.8, waveHeight: 1.8, windSpeed: 21.0 },
  { time: '03:00', sst: 27.9, waveHeight: 1.85, windSpeed: 21.5 },
  { time: '06:00', sst: 28.1, waveHeight: 1.95, windSpeed: 22.8 },
  { time: '09:00', sst: 28.3, waveHeight: 2.05, windSpeed: 23.6 },
  { time: '12:00', sst: 28.6, waveHeight: 2.20, windSpeed: 25.2 },
  { time: '15:00', sst: 28.5, waveHeight: 2.15, windSpeed: 24.8 },
  { time: '18:00', sst: 28.4, waveHeight: 2.10, windSpeed: 24.2 },
  { time: '21:00', sst: 28.2, waveHeight: 2.00, windSpeed: 23.0 },
];

export const noaaBuoys = [
  {
    id: 'NOAA-23001',
    name: 'Bay of Bengal Deep Sea Buoy BD08',
    location: 'Central Bay of Bengal (14.5° N, 85.2° E)',
    lat: 14.5,
    lng: 85.2,
    temperature: '28.6 °C',
    waveHeight: '2.10 m',
    cycloneRisk: '42%',
    lastUpdated: '10 mins ago',
    status: 'Active'
  },
  {
    id: 'NOAA-23004',
    name: 'Arabian Sea Weather Buoy AD04',
    location: 'Offshore Mumbai Basin (16.2° N, 68.8° E)',
    lat: 16.2,
    lng: 68.8,
    temperature: '27.9 °C',
    waveHeight: '1.85 m',
    cycloneRisk: '18%',
    lastUpdated: '5 mins ago',
    status: 'Active'
  },
  {
    id: 'NOAA-23009',
    name: 'Chennai Coastal Radar Buoy CB02',
    location: 'Coromandel Coast (13.1° N, 80.4° E)',
    lat: 13.1,
    lng: 80.4,
    temperature: '29.1 °C',
    waveHeight: '2.30 m',
    cycloneRisk: '55%',
    lastUpdated: '2 mins ago',
    status: 'Warning'
  },
  {
    id: 'NOAA-23012',
    name: 'Andaman Sea Sensor Float AB05',
    location: 'Port Blair Waters (11.6° N, 92.7° E)',
    lat: 11.6,
    lng: 92.7,
    temperature: '28.8 °C',
    waveHeight: '1.95 m',
    cycloneRisk: '35%',
    lastUpdated: '12 mins ago',
    status: 'Active'
  }
];

export const cycloneSystem = {
  name: 'Severe Cyclonic Storm Asani-II',
  category: 'Category 2 Tropical Cyclone',
  centralPressure: 984,
  maxWinds: 115,
  currentPosition: [14.0, 84.8],
  locationName: 'Bay of Bengal Deep Basin (14.0° N, 84.8° E)',
  temperature: '29.4 °C',
  waveHeight: '4.80 m',
  cycloneRisk: '88% (Critical)',
  lastUpdated: '3 mins ago',
  historicalTrack: [
    { lat: 10.5, lng: 88.0 },
    { lat: 11.8, lng: 86.8 },
    { lat: 13.1, lng: 85.6 },
  ],
  forecastTrack: [
    { lat: 15.2, lng: 84.0, radius: 140 },
    { lat: 16.8, lng: 83.2, radius: 180 },
    { lat: 18.2, lng: 82.8, radius: 230 }
  ]
};

export const predictionsData = {
  cycloneRisk: {
    title: 'Cyclone Genesis Risk Prediction',
    result: 'Moderate to High Threat (64.2%)',
    riskLevel: 'High',
    description: 'Deep Learning spatial transformer model predicts potential tropical depression intensification over the central Bay of Bengal within 48 hours.',
    confidenceScore: '94.5%',
    modelName: 'Spatiotemporal Graph Neural Network',
    graphData: [
      { step: '+12h', risk: 28, threshold: 50 },
      { step: '+24h', risk: 42, threshold: 50 },
      { step: '+36h', risk: 64, threshold: 50 },
      { step: '+48h', risk: 78, threshold: 50 },
      { step: '+60h', risk: 68, threshold: 50 },
      { step: '+72h', risk: 45, threshold: 50 },
    ]
  },
  waveHeight: {
    title: 'Significant Wave Height Forecast',
    result: 'Peak Surge: 3.45 meters',
    riskLevel: 'Moderate',
    description: 'CNN-LSTM wave propagation tensor estimates heightened swell progression along coastal Tamil Nadu and Andhra Pradesh.',
    confidenceScore: '96.8%',
    modelName: 'Physics-Informed Neural Network (PINN)',
    graphData: [
      { day: 'Mon', predicted: 1.9, actual: 1.85 },
      { day: 'Tue', predicted: 2.1, actual: 2.05 },
      { day: 'Wed', predicted: 2.8, actual: 2.70 },
      { day: 'Thu', predicted: 3.45, actual: null },
      { day: 'Fri', predicted: 3.10, actual: null },
      { day: 'Sat', predicted: 2.40, actual: null },
      { day: 'Sun', predicted: 1.95, actual: null },
    ]
  }
};

export const analyticsData = {
  daily: [
    { label: '02:00', temp: 27.9, wave: 1.8, cycloneIndex: 22 },
    { label: '06:00', temp: 28.1, wave: 1.9, cycloneIndex: 25 },
    { label: '10:00', temp: 28.4, wave: 2.1, cycloneIndex: 32 },
    { label: '14:00', temp: 28.7, wave: 2.3, cycloneIndex: 40 },
    { label: '18:00', temp: 28.5, wave: 2.2, cycloneIndex: 38 },
    { label: '22:00', temp: 28.2, wave: 2.0, cycloneIndex: 30 },
  ],
  weekly: [
    { label: 'Mon', temp: 27.6, wave: 1.7, cycloneIndex: 18 },
    { label: 'Tue', temp: 27.8, wave: 1.9, cycloneIndex: 22 },
    { label: 'Wed', temp: 28.2, wave: 2.1, cycloneIndex: 30 },
    { label: 'Thu', temp: 28.6, wave: 2.5, cycloneIndex: 45 },
    { label: 'Fri', temp: 29.0, wave: 3.1, cycloneIndex: 68 },
    { label: 'Sat', temp: 28.7, wave: 2.8, cycloneIndex: 52 },
    { label: 'Sun', temp: 28.3, wave: 2.2, cycloneIndex: 35 },
  ],
  monthly: [
    { label: 'Week 1', temp: 27.2, wave: 1.6, cycloneIndex: 15 },
    { label: 'Week 2', temp: 27.8, wave: 1.8, cycloneIndex: 24 },
    { label: 'Week 3', temp: 28.5, wave: 2.4, cycloneIndex: 48 },
    { label: 'Week 4', temp: 28.8, wave: 2.9, cycloneIndex: 62 },
  ]
};

export const alertsList = [
  {
    id: 'ALT-1001',
    type: 'Critical',
    title: 'High Wave & Storm Surge Advisory',
    region: 'Coromandel & Andhra Coast',
    timestamp: '15 mins ago',
    status: 'Active',
    message: 'Significant wave height projected to reach 3.5m+. All fishing craft advised not to venture into deep sea.'
  },
  {
    id: 'ALT-1002',
    type: 'Warning',
    title: 'Thermal SST Anomaly Detected',
    region: 'Central Bay of Bengal',
    timestamp: '1 hour ago',
    status: 'Active',
    message: 'Sea Surface Temperature anomaly of +1.4°C recorded at Buoy BD08. Cyclonic genesis probability elevated.'
  },
  {
    id: 'ALT-1003',
    type: 'Safe',
    title: 'Arabian Sea Buoy AD04 Nominal Operation',
    region: 'Offshore Konkan Coast',
    timestamp: '3 hours ago',
    status: 'Resolved',
    message: 'Telemetry parameter feeds operating within normal climatological bounds. Wave height 1.85m.'
  },
  {
    id: 'ALT-1004',
    type: 'Warning',
    title: 'Gale Wind Velocity Alert',
    region: 'Andaman & Nicobar Islands',
    timestamp: '5 hours ago',
    status: 'Active',
    message: 'Squally wind speed reaching 45–55 km/h gusting to 65 km/h over Andaman Sea.'
  },
  {
    id: 'ALT-1005',
    type: 'Safe',
    title: 'Port Blair Marine Channel Clear',
    region: 'Andaman Waters',
    timestamp: '8 hours ago',
    status: 'Resolved',
    message: 'Coastal navigation clear. Wave activity normalized at 1.9m.'
  }
];

export const hourlyTrendData = dashboardTrendData;
export const weeklyForecastData = analyticsData.weekly;
export const regionalOverview = [
  { id: 1, region: 'Bay of Bengal', sst: 29.4, wave: 3.2, status: 'High Warning' },
  { id: 2, region: 'Arabian Sea', sst: 27.9, wave: 1.8, status: 'Normal' },
  { id: 3, region: 'Andaman Sea', sst: 28.8, wave: 2.1, status: 'Moderate' }
];
export const regionsList = [
  { id: 'bay-of-bengal', name: 'Bay of Bengal' },
  { id: 'arabian-sea', name: 'Arabian Sea' },
  { id: 'andaman-sea', name: 'Andaman Sea' }
];

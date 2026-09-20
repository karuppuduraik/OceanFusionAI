export const mockModels = [
  {
    id: 'cnn-lstm',
    name: 'CNN-LSTM Spatiotemporal Net',
    domain: 'Wave Height & Swell Direction',
    accuracy: 96.8,
    mae: '0.14 m',
    rmse: '0.22 m',
    latency: '85 ms',
    type: 'Convolutional Recurrent Neural Network',
    description: 'Processes sequential satellite altimetry grids and buoy spectral arrays to capture wave dispersion dynamics.',
    features: ['SWH', 'Peak Period (Tp)', 'Wind Sea / Swell Ratio', 'Bathymetric Gradient', 'Surface Roughness']
  },
  {
    id: 'xgboost-sst',
    name: 'XGBoost Gradient Regressor',
    domain: 'Sea Surface Temperature & Marine Heatwaves',
    accuracy: 97.4,
    mae: '0.18 °C',
    rmse: '0.29 °C',
    latency: '18 ms',
    type: 'Extreme Gradient Boosted Decision Trees',
    description: 'Fast gradient-boosted trees trained on 15 years of NOAA OISST and MODIS thermal infrared channels.',
    features: ['Daily Solar Irradiance', 'Wind Speed', 'Upwelling Index', 'Mixed Layer Depth', 'El Niño-Southern Oscillation (ENSO)']
  },
  {
    id: 'pinn-current',
    name: 'Physics-Informed Neural Network (PINN)',
    domain: 'Multi-layer Ocean Current & Vorticity',
    accuracy: 94.2,
    mae: '0.08 m/s',
    rmse: '0.12 m/s',
    latency: '142 ms',
    type: 'Deep Neural Operator with Navier-Stokes Regularization',
    description: 'Embeds conservation of mass and Navier-Stokes momentum equations into loss functions to prevent unphysical eddies.',
    features: ['Geostrophic Flow', 'Ekman Transport', 'Coriolis Parameter', 'Density Gradient', 'Tidal Harmonics']
  },
  {
    id: 'deep-ensemble',
    name: 'Multimodal Deep Ensemble (V3.2)',
    domain: 'Cyclone Track, Intensity & Storm Surge',
    accuracy: 95.9,
    mae: '12.4 km / 4.2 kt',
    rmse: '18.1 km / 6.8 kt',
    latency: '210 ms',
    type: 'Heterogeneous Ensemble (Vision Transformer + ResNet + GBDT)',
    description: 'Combines satellite infrared imagery with atmospheric numerical reanalysis for 72-hour genesis and track forecasting.',
    features: ['Atmospheric Pressure', 'Vertical Wind Shear', 'Ocean Heat Content (OHC)', 'Vorticity 850hPa', 'Moisture Flux']
  }
];

export const predictionHorizonForecast = [
  { time: '+6 Hours', waveHeight: 1.95, sst: 28.5, currentSpeed: 1.48, cycloneRisk: 36, uncertainty: '±0.08m' },
  { time: '+12 Hours', waveHeight: 2.20, sst: 28.8, currentSpeed: 1.55, cycloneRisk: 42, uncertainty: '±0.11m' },
  { time: '+24 Hours', waveHeight: 2.65, sst: 29.1, currentSpeed: 1.70, cycloneRisk: 55, uncertainty: '±0.18m' },
  { time: '+36 Hours', waveHeight: 3.10, sst: 29.4, currentSpeed: 1.88, cycloneRisk: 68, uncertainty: '±0.25m' },
  { time: '+48 Hours', waveHeight: 3.45, sst: 29.6, currentSpeed: 1.95, cycloneRisk: 74, uncertainty: '±0.32m' },
  { time: '+72 Hours', waveHeight: 2.80, sst: 28.9, currentSpeed: 1.62, cycloneRisk: 50, uncertainty: '±0.45m' },
  { time: '+96 Hours', waveHeight: 2.10, sst: 28.2, currentSpeed: 1.35, cycloneRisk: 32, uncertainty: '±0.58m' },
];

export const modelLossData = [
  { epoch: 10, trainLoss: 0.84, valLoss: 0.89 },
  { epoch: 25, trainLoss: 0.58, valLoss: 0.63 },
  { epoch: 50, trainLoss: 0.36, valLoss: 0.41 },
  { epoch: 75, trainLoss: 0.22, valLoss: 0.27 },
  { epoch: 100, trainLoss: 0.14, valLoss: 0.18 },
  { epoch: 125, trainLoss: 0.09, valLoss: 0.13 },
  { epoch: 150, trainLoss: 0.06, valLoss: 0.09 },
];

export const radarMetrics = [
  { metric: 'Wave Height Accuracy', CNN_LSTM: 96, XGBoost: 89, PINN: 82, Ensemble: 98 },
  { metric: 'SST Forecasting', CNN_LSTM: 91, XGBoost: 98, PINN: 88, Ensemble: 97 },
  { metric: 'Current Vorticity', CNN_LSTM: 84, XGBoost: 78, PINN: 96, Ensemble: 95 },
  { metric: 'Cyclone Track', CNN_LSTM: 92, XGBoost: 86, PINN: 89, Ensemble: 99 },
  { metric: 'Extreme Event Recall', CNN_LSTM: 94, XGBoost: 90, PINN: 85, Ensemble: 96 },
  { metric: 'Inference Speed', CNN_LSTM: 88, XGBoost: 99, PINN: 76, Ensemble: 85 },
];

export const correlationMatrixData = [
  { variable: 'SST vs Cyclone Intensity', correlation: 0.88, significance: 'p < 0.001 (Strong Positive)' },
  { variable: 'Wind Speed vs Wave Height', correlation: 0.94, significance: 'p < 0.001 (Very Strong Positive)' },
  { variable: 'Pressure vs Wind Speed', correlation: -0.82, significance: 'p < 0.001 (Strong Inverse)' },
  { variable: 'Salinity vs Dissolved Oxygen', correlation: -0.45, significance: 'p < 0.01 (Moderate Inverse)' },
  { variable: 'Chlorophyll-a vs Turbidity', correlation: 0.76, significance: 'p < 0.001 (Strong Positive)' },
  { variable: 'Depth vs Current Velocity', correlation: -0.68, significance: 'p < 0.001 (Moderate Inverse)' },
];

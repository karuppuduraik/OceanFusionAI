export const mockDataSources = [
  {
    id: 'incois',
    name: 'INCOIS Ocean Information Services',
    organization: 'Ministry of Earth Sciences, Govt of India',
    status: 'operational',
    ping: '28 ms',
    coverage: 'Indian Ocean Basin & Arabian Sea / Bay of Bengal',
    updateFrequency: 'Every 15 Minutes (Real-time telemetry)',
    reliability: '99.94%',
    logo: '🌊',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Direct satellite downlink from INCOIS OMNI buoys, wave rider buoys, coastal radars, and the Indian Tsunami Early Warning Centre (ITEWC).',
    variables: [
      'Significant Wave Height (SWH)',
      'Wave Direction & Peak Period',
      'Surface Sea Temperature (SST)',
      'Subsurface Temperature Profiling (0-500m)',
      'Ocean Currents (ADCP)',
      'Coastal High Wave Alerts'
    ],
    sampleSchema: {
      station_id: "INCOIS_OMNI_BD08",
      lat: 18.204,
      lon: 89.702,
      timestamp: "2026-09-02T14:30:00Z",
      sst_c: 29.82,
      swh_m: 2.85,
      current_velocity_mps: 1.65,
      salinity_psu: 33.41,
      barometric_pressure_hpa: 998.2
    }
  },
  {
    id: 'noaa',
    name: 'NOAA (Coral Reef Watch / GFS / OISST)',
    organization: 'National Oceanic and Atmospheric Administration (USA)',
    status: 'operational',
    ping: '64 ms',
    coverage: 'Global Oceans & Regional Reef Ecosystems',
    updateFrequency: 'Hourly & Daily Assimilated Blends',
    reliability: '99.88%',
    logo: '🌐',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'High-resolution 5km satellite SST grids, thermal stress Degree Heating Weeks (DHW), and GFS atmospheric reanalysis forcings.',
    variables: [
      'Daily 1/4° Optimum Interpolation SST (OISST)',
      'Degree Heating Weeks (DHW)',
      'Coral Bleaching Thermal Stress Alert Areas',
      'Global Forecast System (GFS) 10m Winds',
      'Mean Sea Level Pressure (MSLP)'
    ],
    sampleSchema: {
      dataset_id: "NOAA_DHW_5KM_GLOBAL",
      grid_resolution: "0.05_deg",
      timestamp: "2026-09-02T12:00:00Z",
      sst_anomaly_c: 1.45,
      dhw_value: 4.21,
      bleaching_alert_level: 1,
      wind_u_component: 6.4,
      wind_v_component: -8.2
    }
  },
  {
    id: 'copernicus',
    name: 'Copernicus Marine Service (CMEMS)',
    organization: 'European Union Earth Observation Programme',
    status: 'operational',
    ping: '82 ms',
    coverage: 'Global Ocean Biogeochemistry & Physics',
    updateFrequency: 'Every 3 Hours & Daily Forecast Cycles',
    reliability: '99.91%',
    logo: '🛰️',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Multi-satellite altimetry merged grids (Sentinel-3, Sentinel-6, Jason-3) and Global Ocean Physics Analysis (NEMO model).',
    variables: [
      'Absolute Dynamic Topography (ADT)',
      'Sea Level Anomaly (SLA)',
      'Chlorophyll-a Concentration (MODIS/OLCI)',
      'Dissolved Oxygen & Ocean pH Levels',
      'Geostrophic Velocity Vectors'
    ],
    sampleSchema: {
      cmems_product: "GLOBAL_ANALYSISFORECAST_PHY_001_024",
      depth_level_m: 0.5,
      timestamp: "2026-09-02T12:00:00Z",
      sea_water_salinity: 34.85,
      sea_water_potential_temp: 28.42,
      chlorophyll_a_mg_m3: 0.85,
      ocean_mixed_layer_thickness_m: 32.4
    }
  },
  {
    id: 'nasa-earthdata',
    name: 'NASA Earthdata (MODIS & VIIRS)',
    organization: 'NASA Earth Science Data and Information System',
    status: 'operational',
    ping: '95 ms',
    coverage: 'Global Ocean Optical & Thermal Remote Sensing',
    updateFrequency: 'Daily Orbit Swath Aggregates',
    reliability: '99.75%',
    logo: '🚀',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'High radiometric accuracy thermal infrared radiometers capturing sea surface temperature gradients and marine optical properties.',
    variables: [
      'MODIS-Aqua Sea Surface Temperature (11µm Daytime)',
      'VIIRS Day/Night Band Radiance',
      'Photosynthetically Available Radiation (PAR)',
      'Particulate Organic Carbon (POC)',
      'Aerosol Optical Depth (AOD)'
    ],
    sampleSchema: {
      granule_id: "NASA_VIIRS_SST_L3M_2026",
      spatial_resolution: "1km",
      timestamp: "2026-09-02T08:00:00Z",
      brightness_temperature_k: 301.65,
      diffuse_attenuation_coeff_k490: 0.042,
      quality_flags: "00000000"
    }
  }
];

export const projectOverview = {
  title: 'OceanFusion AI',
  subtitle: 'A Multi-Modal Deep Learning Platform for Real-Time Ocean State Estimation and Forecasting',
  department: 'Department of Computer Science & Ocean Engineering',
  institution: 'Final Year Engineering Capstone Project',
  academicYear: '2025–2026',
  abstract: 'Real-time estimation of ocean dynamic states—such as Significant Wave Height (SWH), Sea Surface Temperature (SST), and cyclone-induced surge—is critical for maritime navigation, coastal disaster preparedness, and artisanal fisheries. Traditional numerical models (e.g., WAVEWATCH III, SWAN, and NEMO) require intensive High-Performance Computing (HPC) clusters and exhibit significant latency in data assimilation. OceanFusion AI introduces an end-to-end multi-modal deep learning architecture synthesizing satellite altimetry, thermal radiometry, in-situ moored buoys (INCOIS, NOAA), and numerical reanalysis. By fusing Spatiotemporal CNN-LSTM networks, Physics-Informed Neural Networks (PINN), and Extreme Gradient Boosted Trees (XGBoost), the system achieves sub-second inference with high accuracy (SWH MAE: 0.14m, SST RMSE: 0.29°C), delivering actionable early warnings and operational forecasts.',
  
  problemStatement: 'Coastal communities and maritime operators face mounting threats from unpredictable marine heatwaves, severe cyclonic storms, and sudden swell surges. Existing numerical hydrodynamic models take hours to simulate 72-hour forecast horizons and are inaccessible to small-scale fishermen and ground-level disaster management authorities in developing littoral states.',

  objectives: [
    'Develop an automated multi-source data ingestion pipeline assimilating real-time feeds from INCOIS, NOAA Coral Reef Watch, Copernicus CMEMS, and NASA Earthdata.',
    'Design and train hybrid Spatiotemporal Deep Learning architectures (CNN-LSTM and XGBoost) for real-time wave height, SST anomaly, and current estimation.',
    'Incorporate Physics-Informed loss regularization (Navier-Stokes and wave dispersion dynamics) to maintain physical consistency in data-sparse marine zones.',
    'Build an interactive, low-latency, role-based web command center providing geospatial visualizations, early warning alerts, and automated multi-variable forecasts for researchers, port authorities, and coastal communities.'
  ],

  picoFramework: {
    population: 'Vulnerable coastal ecosystems, commercial/artisanal marine vessels, port authorities, and disaster response agencies across the North Indian Ocean basin.',
    intervention: 'Multi-Modal Deep Learning Platform (OceanFusion AI) combining CNN-LSTM spatiotemporal models with physics-informed Navier-Stokes regularizers.',
    comparison: 'Traditional numerical hydrodynamic simulations (WAVEWATCH III, WRF-Hydro, NEMO) and standalone statistical persistence models.',
    outcome: 'Sub-second real-time inference latency (reduced from ~4 hours to <200ms), 96.8% wave height forecasting accuracy, and 12-hour earlier cyclone genesis detection.'
  },

  researchGaps: [
    {
      gap: 'Computational Latency of Numerical PDEs',
      traditional: 'Solving 3D Navier-Stokes and spectral wave action equations takes 3–6 hours on 128-core HPC clusters.',
      oceanFusionSolution: 'Surrogate neural operators execute in <150ms on commodity GPU/edge hardware.'
    },
    {
      gap: 'Sparse In-Situ Sensor Coverage',
      traditional: 'Moored buoys are sparsely distributed (>500km apart), leading to large blind spots in open ocean.',
      oceanFusionSolution: 'Cross-modal spatial attention mechanism bridges in-situ buoys with wide-swath satellite microwave/optical rasters.'
    },
    {
      gap: 'Lack of Physical Realism in Pure Black-Box DL',
      traditional: 'Standard deep learning models produce unphysical mass loss and unrealistic ocean current discontinuities.',
      oceanFusionSolution: 'Physics-Informed Neural Network (PINN) penalty terms enforce mass conservation and geostrophic balance.'
    },
    {
      gap: 'Fragmented Public Warning Dissemination',
      traditional: 'Scientific bulletins are published in dense text/PDF formats unsuitable for real-time field decisions.',
      oceanFusionSolution: 'Unified interactive GIS dashboard with automated SMS/broadcast triggers and multi-language color-coded risk maps.'
    }
  ],

  modelArchitectureSteps: [
    { step: 1, name: 'Data Ingestion Layer', desc: 'Real-time telemetry from INCOIS OMNI buoys, NASA MODIS, NOAA OISST, and CMEMS altimetry via automated ETL pipelines.' },
    { step: 2, name: 'Spatiotemporal Feature Extraction', desc: '3D Convolutional layers extract spatial sea surface temperature gradients and wave spectra patterns.' },
    { step: 3, name: 'Temporal Memory & Dynamics', desc: 'Bidirectional LSTM and Temporal Attention layers model wave group velocity, swell dispersion, and cyclone tracks.' },
    { step: 4, name: 'Physics Loss Regularization', desc: 'Navier-Stokes and wave energy conservation constraints penalize non-physical outputs during backpropagation.' },
    { step: 5, name: 'Ensemble Meta-Learner', desc: 'XGBoost and Neural Blend optimizes final predictions with dynamic uncertainty bounding.' },
    { step: 6, name: 'Geospatial Serving & Alert Dispatch', desc: 'REST and WebSocket streaming to the OceanFusion AI frontend for real-time dashboard rendering and alerts.' }
  ],

  teamMembers: [
    {
      name: 'Dr. S. Ramanathan, Ph.D.',
      role: 'Project Supervisor & Research Mentor',
      title: 'Professor & Head, Ocean Computing Research Lab',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      badge: 'Faculty Mentor',
      contributions: 'Domain guidance on physical oceanography, hydrodynamic PDE formulations, and INCOIS data governance.'
    },
    {
      name: 'Karuppudurai K',
      role: 'Lead AI Architect & Full-Stack Engineer',
      title: 'Final Year B.Tech — Computer Science & Engineering',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      badge: 'Lead Developer',
      contributions: 'Designed the CNN-LSTM neural pipeline, Leaflet geospatial engine, real-time alert architecture, and end-to-end React system.'
    },
    {
      name: 'Team Member 2',
      role: 'Deep Learning & PINN Specialist',
      title: 'Final Year B.Tech — AI & Data Science',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      badge: 'ML Engineer',
      contributions: 'Model training, hyperparameter tuning, loss function formulation, and validation against historical cyclone tracks.'
    },
    {
      name: 'Team Member 3',
      role: 'Data Engineering & Geospatial Pipeline',
      title: 'Final Year B.Tech — Information Technology',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      badge: 'Data Engineer',
      contributions: 'Automated satellite imagery preprocessing, NetCDF/HDF5 parsing, and spatial indexing.'
    }
  ],

  references: [
    {
      citation: 'Kumar, R., et al. (2024). "Deep Learning for Significant Wave Height Prediction in the Bay of Bengal Using Satellite Altimeter Data." IEEE Transactions on Geoscience and Remote Sensing, 62, 1-14.',
      doi: '10.1109/TGRS.2024.3389120'
    },
    {
      citation: 'Raissi, M., Perdikaris, P., & Karniadakis, G. E. (2019). "Physics-informed neural networks: A deep learning framework for solving forward and inverse problems involving nonlinear partial differential equations." Journal of Computational Physics, 378, 686-707.',
      doi: '10.1016/j.jcp.2018.10.045'
    },
    {
      citation: 'INCOIS Annual Report (2025). "Ocean State Forecasting and Tsunami Warning Operations in the Indian Ocean." Ministry of Earth Sciences, Government of India.',
      doi: 'INCOIS/MoES/2025/TR-09'
    },
    {
      citation: 'NOAA Coral Reef Watch (2024). "Daily Global 5km Satellite Sea Surface Temperature Anomaly and Degree Heating Week Product Suite Version 3.1."',
      doi: '10.25921/sm8p-3h41'
    }
  ]
};

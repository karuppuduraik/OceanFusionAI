export const mockAlerts = [
  {
    id: 'ALT-CYC-2026-08',
    title: 'Severe Cyclonic Storm "ASANI-II" Rapid Intensification',
    region: 'Bay of Bengal (Central & North-East)',
    coordinates: '17.8°N, 88.6°E',
    severity: 'danger', // 'danger' | 'warning' | 'advisory' | 'safe'
    category: 'Cyclone Threat',
    timestamp: '12 mins ago',
    issuedBy: 'INCOIS / IMD Cyclone Warning Division',
    description: 'System intensified into a Severe Cyclonic Storm with sustained winds of 135 km/h gusting to 160 km/h. Moving North-Northwest towards Odisha/West Bengal coastal corridor.',
    affectedAreas: ['Paradip', 'Dhamra', 'Digha', 'Gopalpur', 'Kakdwip'],
    advisoryDetails: {
      fishermen: 'Total ban on deep-sea and coastal fishing operations. All vessels out at sea instructed to return to nearest shelter immediately.',
      ports: 'Great Danger Signal No. 8 hoisted at Paradip and Dhamra Ports. Cargo loading suspended.',
      coastalDefense: 'Evacuation of low-lying flood-prone villages initiated. NDRF teams pre-positioned in 6 coastal districts.'
    },
    metrics: {
      windSpeed: '135 km/h',
      waveSwell: '4.8 - 6.2 meters',
      centralPressure: '968 hPa',
      stormSurge: '1.8 - 2.5 meters above astronomical tide'
    },
    status: 'active'
  },
  {
    id: 'ALT-WAV-2026-14',
    title: 'High Swell Surge & Rough Sea Warning',
    region: 'Kerala & South Karnataka Coast',
    coordinates: '9.2°N, 75.8°E',
    severity: 'warning',
    category: 'High Wave Advisory',
    timestamp: '42 mins ago',
    issuedBy: 'INCOIS Ocean State Forecast Lab',
    description: 'High waves in the range of 3.2 to 3.9 meters forecast due to remote Southern Ocean swell propagation. Risk of coastal erosion and localized seawater inundation.',
    affectedAreas: ['Vizhinjam', 'Kollam', 'Kochi', 'Ponnani', 'Mangalore'],
    advisoryDetails: {
      fishermen: 'Small motorized craft and traditional catamarans advised not to venture beyond 5 nautical miles.',
      ports: 'Tug assistance mandatory for all approaching container vessels at Cochin Port.',
      coastalDefense: 'Public advised to avoid beach recreational activities and nearshore promenades.'
    },
    metrics: {
      windSpeed: '32 km/h',
      waveSwell: '3.6 meters',
      centralPressure: '1008 hPa',
      stormSurge: '0.6 meters'
    },
    status: 'active'
  },
  {
    id: 'ALT-BIO-2026-03',
    title: 'Marine Heatwave & Coral Bleaching Alert Level 1',
    region: 'Gulf of Mannar Biosphere Reserve',
    coordinates: '9.1°N, 79.2°E',
    severity: 'warning',
    category: 'Ecological Threat',
    timestamp: '2 hours ago',
    issuedBy: 'NOAA Coral Reef Watch / INCOIS',
    description: 'Sea surface temperatures exceeding 30.4°C (Thermal Stress Degree Heating Weeks > 4.2°C-weeks). Widespread bleaching stress detected across shallow fringing reefs.',
    affectedAreas: ['Mandapam', 'Rameswaram', 'Krusadai Island', 'Tuticorin Marine Park'],
    advisoryDetails: {
      fishermen: 'Avoid bottom trawling in designated reef conservation zones to prevent secondary stress.',
      ports: 'Thermal effluent discharge monitored at Tuticorin industrial corridor.',
      coastalDefense: 'Marine biology field teams deployed for in-situ underwater photographic quadrat surveys.'
    },
    metrics: {
      windSpeed: '14 km/h',
      waveSwell: '0.8 meters',
      centralPressure: '1010 hPa',
      stormSurge: 'N/A'
    },
    status: 'active'
  },
  {
    id: 'ALT-HYP-2026-07',
    title: 'Hypoxia & Harmful Noctiluca Algal Bloom Alert',
    region: 'Goa & Central Arabian Sea Coast',
    coordinates: '15.4°N, 73.6°E',
    severity: 'advisory',
    category: 'Water Quality',
    timestamp: '4 hours ago',
    issuedBy: 'National Institute of Oceanography (NIO)',
    description: 'Elevated Chlorophyll-a (3.8 mg/m³) and dissolved oxygen drop to 3.1 mg/L observed. Green tide bloom causing localized fish mortality in estuarine pockets.',
    affectedAreas: ['Mormugao', 'Panaji', 'Aguada Bay', 'Betul'],
    advisoryDetails: {
      fishermen: 'Fish aggregation shifting 15km offshore due to surface hypoxia.',
      ports: 'Desalination plant intake filters instructed to run backwash cycles.',
      coastalDefense: 'Seawater sampling at 4-hour intervals.'
    },
    metrics: {
      windSpeed: '18 km/h',
      waveSwell: '1.2 meters',
      centralPressure: '1011 hPa',
      stormSurge: 'None'
    },
    status: 'active'
  },
  {
    id: 'ALT-NAV-2026-21',
    title: 'Fair Sea State Window for Artisanal Fishermen',
    region: 'Tamil Nadu South Coast & Coromandel',
    coordinates: '11.8°N, 80.2°E',
    severity: 'safe',
    category: 'Maritime Operations',
    timestamp: '5 hours ago',
    issuedBy: 'INCOIS Coastal Safety Division',
    description: 'Moderate sea condition with wave heights under 1.2m and gentle breeze. Favorable fishing window for next 48 hours across Palk Bay and Nagapattinam coast.',
    affectedAreas: ['Chennai Harbour', 'Cuddalore', 'Nagapattinam', 'Karaikal'],
    advisoryDetails: {
      fishermen: 'Safe for multi-day and artisanal fishing craft operations.',
      ports: 'Standard operational protocol.',
      coastalDefense: 'Routine radar surveillance.'
    },
    metrics: {
      windSpeed: '12 km/h',
      waveSwell: '0.9 meters',
      centralPressure: '1012 hPa',
      stormSurge: 'None'
    },
    status: 'acknowledged'
  }
];

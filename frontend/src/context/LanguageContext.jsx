import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    oceanMap: 'Ocean Map',
    aiPrediction: 'AI Prediction',
    analytics: 'Analytics',
    alerts: 'Alerts',
    adminPanel: 'Admin Panel',
    profile: 'User Profile',
    signOut: 'Sign Out',
    systemOperational: 'System Operational',
    telemetryActive: 'INCOIS & NOAA Telemetry Feeds Active',
    
    // Header Titles
    dashboardTitle: 'Real-Time Ocean State Monitoring Dashboard',
    mapTitle: 'Geospatial Ocean Telemetry & Cyclone Map',
    predictionsTitle: 'AI Deep Learning Prediction Studio',
    analyticsTitle: 'Hydrodynamic Trends & Analytics Workspace',
    alertsTitle: 'Early Warning Disaster Advisory Feeds',
    profileTitle: 'Researcher & User Profile Management',
    adminTitle: 'Admin Management Console',

    // Dashboard Metrics
    sst: 'Sea Surface Temp',
    waveHeight: 'Significant Wave Height',
    windSpeed: 'Wind Speed',
    cycloneRisk: 'Cyclone Risk Index',
    accuracy: 'Prediction Accuracy',
    lastUpdated: 'Last Updated',
    quickStats: 'Quick Hydrodynamic Statistics',
    recentAlerts: 'Recent Warnings & Advisories',
    meanPressure: 'Mean Ocean Pressure',
    salinity: 'Salinity Index',
    currentVelocity: 'Ocean Current Velocity',
    activeBuoys: 'Active Buoys Monitored',

    // Map & Toggles
    noaaBuoys: 'NOAA Buoys',
    cycloneTrack: 'Cyclone Track',
    sstWaveLayer: 'SST & Wave Layer',
    incoisNoaaLive: 'INCOIS & NOAA Live Real-Time Telemetry',
    syncTime: 'Sync:',
    sstAbbr: 'SST:',
    waveAbbr: 'Wave:',
    windAbbr: 'Wind:',
    onText: 'ON',
    offText: 'OFF',
    seaSurfaceTemp: 'Sea Surface Temp',
    peakWaveHeight: 'Peak Wave Height',
    cycloneRiskIndex: 'Cyclone Risk Index',
    liveTelemetrySync: 'Live Telemetry Sync',
    liveSST: 'Live SST',
    waveHeightLabel: 'Wave Height',
    windVelocity: 'Wind Velocity',
    pressureLabel: 'Pressure:',
    elevatedSeaState: 'Elevated Sea State',
    operational: 'Operational',

    // Map GIS & Controls
    realTimeGis: 'REAL-TIME GIS',
    updatedSync: 'Updated: Live Sync',
    quickJump: 'Quick Jump:',
    bayOfBengal: 'Bay of Bengal',
    indiaRegion: 'India',
    pacificOcean: 'Pacific',
    atlanticOcean: 'Atlantic',
    liveMapsSection: 'Live Maps',
    forecastMapsSection: 'Forecast Maps',
    satelliteLayer: 'Satellite',
    radarLayer: 'Radar',
    precipitationLayer: 'Precipitation',
    windLayer: 'Wind',
    tempLayer: 'Temperature',
    wavesLayer: 'Waves & Swell',
    humidityLayer: 'Humidity',
    pressureLayer: 'Pressure',
    overlayOpacity: 'Overlay Opacity',
    stormTracker: 'Invest 94A Tracker',
    oceanBuoyTelemetry: 'Ocean Buoy Telemetry',

    // Headline banners
    bannerWind: 'Wind Speed Forecast',
    bannerTemp: 'Temperature Forecast',
    bannerHumidity: 'Relative Humidity Forecast',
    bannerPressure: 'Atmospheric Pressure Forecast',
    bannerPrecipitation: 'Precipitation Radar Forecast',
    bannerWaves: 'Ocean Wave Height & Swell Forecast',
    bannerSatellite: 'Live Satellite & Cloud Imagery',
    bannerRadar: 'Live Weather Radar Reflectivity',

    // Inspector
    coordTelemetry: 'Coordinates Telemetry',
    surfacePressure: 'Surface Pressure',
    significantWaveSwell: 'Significant Wave Swell',
    liveStatusText: 'Live',

    // Storm popup
    sustainedWind: 'Sustained Wind',
    centralPressure: 'Central Pressure',
    waveSwell: 'Wave Swell',
    movement: 'Movement',
    liveTracking: 'Live Tracking',
    cached: 'Cached',
    chanceIn24h: 'chance in 24 hours',

    // AI Prediction
    runInference: 'Run Neural Inference',
    runningInference: 'Running Neural Inference...',
    inferenceComplete: 'Forward Pass Completed (96.4% Confidence)',
    simulatedWind: 'Simulated Wind Speed',
    simulatedSST: 'Simulated Sea Surface Temp',
    cycloneTitle: 'Cyclone Genesis Risk Prediction',
    predictedRiskPct: 'Predicted Cyclone Risk Percentage',
    predictedLocation: 'Predicted Impact Location / Basin Region',
    waveTitle: 'Significant Wave Height Forecast',
    predictedSurge: 'Predicted Peak Wave Surge',
    affectedCoast: 'Affected Coastal Region',

    // Analytics
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    tempChartTitle: 'Temperature Trend Chart (°C)',
    waveChartTitle: 'Wave Trend Chart (m)',
    cycloneChartTitle: 'Cyclone Risk Index Trend (%)',
    liveTelemetryLinked: 'Live Sensor Telemetry Linked',
    analyticsTableTitle: 'Comparative Telemetry Data Table',
    sampleCount: 'Sample Count:',
    intervalsText: 'Intervals',
    timeInterval: 'Time Interval',
    sstCol: 'Sea Surface Temp (°C)',
    waveCol: 'Significant Wave (m)',
    cycloneCol: 'Cyclone Risk Index (%)',
    anomalyCol: 'Anomaly Assessment',
    elevatedAnomaly: 'Elevated Anomaly',
    normalClimatology: 'Normal Climatology',
    liveSensorStream: 'Live Sensor Telemetry Stream',
    climatologicalHistory: 'Periodic Climatological History',
    liveBadgeText: 'LIVE',
    recordedAt: 'Recorded Timestamp',
    monitoringStation: 'Monitoring Station',

    // Alerts
    criticalAlerts: 'Critical Alerts',
    warningAlerts: 'Warning Alerts',
    safeStatus: 'Safe Status',
    filterAdvisory: 'Filter Advisory Log:',
    all: 'All',
    timelineTitle: 'Alert Timeline & Real-Time Feed',
    chronologicalLogs: 'Chronological Real-Time Logs',
    requiresImmediateAction: 'Requires Immediate Action',
    activeMonitoringStatus: 'Active Monitoring Status',
    normalOperations: 'Normal Operations',

    // Profile
    editBio: 'Edit Researcher Bio',
    saveProfile: 'Save Profile Changes',
    bioPlaceholder: 'Enter your research notes, institutional specialization, or regional advisory interests...',
    accountDetails: 'Account Credentials & Role',
    preferredLanguage: 'Preferred Interface Language',

    // Dashboard Telemetry & Alerts
    liveTelemetryFeeds: 'Live Telemetry Feeds',
    criticalThreat: 'Critical Threat',
    highThreat: 'High Threat',
    moderateThreat: 'Moderate Threat',
    lowThreat: 'Low Threat',
    normalHydrodynamicFlow: 'Normal Hydrodynamic Flow',
    cycloneThreatDetected: 'Cyclone Genesis Threat Detected',
    expressMongoLiveSync: 'Express & MongoDB Live Sync',
    telemetryChartTitle: '24-Hour SST & Wave Height Telemetry',
    telemetryChartSubtitle: 'Real-time sensor telemetry readings sampled at 3-hour intervals',
    stationsActive: '14 Stations Active',
    aiCycloneAlertsTitle: 'AI Cyclone Warnings & Advisories',
    activeAlert: 'Active Alert',
    activeAlerts: 'Active Alerts',
    allClear: 'All Clear',
    noCycloneThreatTitle: 'No Cyclone Genesis Threats',
    noCycloneThreatDesc: 'AI deep learning models confirm ocean parameters are within safe bounds.',
    liveAIMode: 'Live AI Model Sync',
    warningBadge: 'Warning',
    criticalBadge: 'Critical',
    safeBadge: 'Safe',
    sstLegend: 'SST (°C)',
    waveLegend: 'Wave (m)',
  },
  ta: {
    // Navigation (தமிழ்)
    dashboard: 'முகப்பு',
    oceanMap: 'கடல் வரைபடம்',
    aiPrediction: 'AI கணிப்பு',
    analytics: 'பகுப்பாய்வு',
    alerts: 'எச்சரிக்கைகள்',
    adminPanel: 'நிர்வாகி பலகம்',
    profile: 'பயனர் சுயவிவரம்',
    signOut: 'வெளியேறு',
    systemOperational: 'அமைப்பு செயல்படுகிறது',
    telemetryActive: 'INCOIS & NOAA நேரலை தரவு இணைக்கப்பட்டுள்ளது',

    // Header Titles
    dashboardTitle: 'நேரலை கடல் நிலை கண்காணிப்பு பலகம்',
    mapTitle: 'கடல் புவியியல் தரவு மற்றும் புயல் வரைபடம்',
    predictionsTitle: 'AI ஆழமான கற்றல் கணிப்பு மையம்',
    analyticsTitle: 'கடல் அலை மற்றும் காலநிலை பகுப்பாய்வு',
    alertsTitle: 'ஆபத்து மற்றும் பேரிடர் முன்னெச்சரிக்கை அறிவிப்புகள்',
    profileTitle: 'ஆாய்ச்சியாளர் மற்றும் பயனர் சுயவிவர மேலாண்மை',
    adminTitle: 'நிர்வாகி கட்டுப்பாட்டு மையம்',

    // Dashboard Metrics
    sst: 'கடல் வெப்பநிலை',
    waveHeight: 'அலை உயரம்',
    windSpeed: 'காற்றின் வேகம்',
    cycloneRisk: 'புயல் அபாயம்',
    accuracy: 'AI துல்லியம்',
    lastUpdated: 'கடைசி புதுப்பிப்பு',
    quickStats: 'விரைவு கடல் புள்ளிவிவரங்கள்',
    recentAlerts: 'சமீபத்திய எச்செரிக்கைகள்',
    meanPressure: 'கடல் காற்று அழுத்தம்',
    salinity: 'உவர்ப்புத் தன்மை (Salinity)',
    currentVelocity: 'கடல் நீரோட்ட வேகம்',
    activeBuoys: 'செயலில் உள்ள மிதவை நிலையங்கள்',

    // Map & Toggles
    noaaBuoys: 'மிதவை நிலையங்கள்',
    cycloneTrack: 'புயல் பாதை',
    sstWaveLayer: 'வெப்பநிலை & அலை அடுக்கு',
    incoisNoaaLive: 'INCOIS & NOAA நேரலை தொலை அளவியல்',
    syncTime: 'ஒத்திசைவு:',
    sstAbbr: 'வெப்பநிலை:',
    waveAbbr: 'அலை:',
    windAbbr: 'காற்று:',
    onText: 'இயக்கத்தில்',
    offText: 'முடக்கப்பட்டது',
    seaSurfaceTemp: 'கடல் வெப்பநிலை',
    peakWaveHeight: 'உச்ச அலை உயரம்',
    cycloneRiskIndex: 'புயல் அபாயக் குறியீடு',
    liveTelemetrySync: 'நேரலை ஒத்திசைவு',
    liveSST: 'நேரலை SST',
    waveHeightLabel: 'அலை உயரம்',
    windVelocity: 'காற்றின் வேகம்',
    pressureLabel: 'அழுத்தம்:',
    elevatedSeaState: 'கொந்தளிப்பான கடல்',
    operational: 'வழக்கமான இயக்கம்',

    // Map GIS & Controls (தமிழ்)
    realTimeGis: 'நேரலை GIS',
    updatedSync: 'புதுப்பிக்கப்பட்டது: நேரலை ஒத்திசைவு',
    quickJump: 'விரைவுப் பார்வை:',
    bayOfBengal: 'வங்காள விரிகுடா',
    indiaRegion: 'இந்தியா',
    pacificOcean: 'பசிபிக்',
    atlanticOcean: 'அட்லாண்டிக்',
    liveMapsSection: 'நேரலை வரைபடங்கள்',
    forecastMapsSection: 'முன்னறிவிப்பு வரைபடங்கள்',
    satelliteLayer: 'செயற்கைக்கோள்',
    radarLayer: 'வானிலை ரேடார்',
    precipitationLayer: 'மழைப்பொழிவு',
    windLayer: 'காற்றின் வேகம்',
    tempLayer: 'வெப்பநிலை',
    wavesLayer: 'அலைகள் & எழுச்சி',
    humidityLayer: 'ஈரப்பதம்',
    pressureLayer: 'காற்று அழுத்தம்',
    overlayOpacity: 'அடுக்கு ஒளிபுகாமை',
    stormTracker: 'புயல் கண்காணிப்பு (Invest 94A)',
    oceanBuoyTelemetry: 'கடல் மிதவை தொலை அளவியல்',

    // Headline banners (தமிழ்)
    bannerWind: 'காற்றின் வேக முன்னறிவிப்பு',
    bannerTemp: 'வெப்பநிலை முன்னறிவிப்பு',
    bannerHumidity: 'ஒப்பீட்டு ஈரப்பத முன்னறிவிப்பு',
    bannerPressure: 'வளிமண்டல அழுத்த முன்னறிவிப்பு',
    bannerPrecipitation: 'மழைப்பொழிவு ரேடார் முன்னறிவிப்பு',
    bannerWaves: 'கடல் அலை உயரம் & எழுச்சி முன்னறிவிப்பு',
    bannerSatellite: 'நேரலை செயற்கைக்கோள் & மேகப் படங்கள்',
    bannerRadar: 'நேரலை வானிலை ரேடார் பிரதிபலிப்பு',

    // Inspector (தமிழ்)
    coordTelemetry: 'ஆயத்தொலைவு தொலை அளவியல்',
    surfacePressure: 'மேற்பரப்பு அழுத்தம்',
    significantWaveSwell: 'குறிப்பிடத்தக்க அலை எழுச்சி',
    liveStatusText: 'நேரலை',

    // Storm popup (தமிழ்)
    sustainedWind: 'தொடர் காற்றின் வேகம்',
    centralPressure: 'மையக் காற்று அழுத்தம்',
    waveSwell: 'அலை எழுச்சி',
    movement: 'நகரும் வேகம் & திசை',
    liveTracking: 'நேரலை கண்காணிப்பு',
    cached: 'சேமிக்கப்பட்ட தரவு',
    chanceIn24h: '24 மணிநேரத்தில் உருவாக வாய்ப்பு',

    // AI Prediction
    runInference: 'AI கணிப்பை இயக்கு',
    runningInference: 'AI கணக்கிடுகிறது...',
    inferenceComplete: 'கணிப்பு முடிந்தது (96.4% துல்லியம்)',
    simulatedWind: 'காற்றின் வேகம் (மாதிரி)',
    simulatedSST: 'கடல் வெப்பநிலை (மாதிரி)',
    cycloneTitle: 'புயல் உருவாகும் அபாயக் கணிப்பு',
    predictedRiskPct: 'கணிக்கப்பட்ட புயல் அபாய சதவீதம்',
    predictedLocation: 'பாதிக்கப்படும் கடல் பகுதி / இடம்',
    waveTitle: 'கடல் அலை உயரக் கணிப்பு',
    predictedSurge: 'கணிக்கப்பட்ட உச்ச அலை உயரம்',
    affectedCoast: 'பாதிக்கப்படும் கடலோர பகுதி',

    // Analytics
    daily: 'நாளாந்த',
    weekly: 'வாராந்த',
    monthly: 'மாதாந்த',
    tempChartTitle: 'வெப்பநிலை மாற்ற வரைபடம் (°C)',
    waveChartTitle: 'அலை உயர மாற்ற வரைபடம் (m)',
    cycloneChartTitle: 'புயல் அபாய வரைபடம் (%)',
    liveTelemetryLinked: 'நேரலை சென்சார் தரவு இணைக்கப்பட்டுள்ளது',
    analyticsTableTitle: 'ஒப்பீட்டு தொலை அளவியல் தரவு அட்டவணை',
    sampleCount: 'மாதிரி எண்ணிக்கை:',
    intervalsText: 'இடைவெளிகள்',
    timeInterval: 'நேர இடைவெளி',
    sstCol: 'கடல் மேற்பரப்பு வெப்பநிலை (°C)',
    waveCol: 'கடல் அலை உயரம் (m)',
    cycloneCol: 'புயல் அபாயக் குறியீடு (%)',
    anomalyCol: 'முரண்பாட்டு மதிப்பீடு',
    elevatedAnomaly: 'தீவிர முரண்பாடு',
    normalClimatology: 'இயல்பான கடல் நிலை',
    liveSensorStream: 'நேரலை சென்சார் பதிவு வரலாறு',
    climatologicalHistory: 'காலமுறை வரலாற்று பகுப்பாய்வு',
    liveBadgeText: 'நேரலை',
    recordedAt: 'பதிவு செய்யப்பட்ட நேரம்',
    monitoringStation: 'கண்காணிப்பு நிலையம்',

    // Alerts
    criticalAlerts: 'மிகவும் ஆபத்தான எச்சரிக்கை',
    warningAlerts: 'எச்சரிக்கை நிலை',
    safeStatus: 'பாதுகாப்பான நிலை',
    filterAdvisory: 'அறிவிப்புகளை வடிகட்டு:',
    all: 'அனைத்தும்',
    timelineTitle: 'எச்சரிக்கை காலவரிசை & நேரலை அறிவிப்புகள்',
    chronologicalLogs: 'நேரலை காலவரிசை பதிவுகள்',
    requiresImmediateAction: 'உடனடி நடவடிக்கை தேவை',
    activeMonitoringStatus: 'செயலில் உள்ள கண்காணிப்பு',
    normalOperations: 'இயல்பான செயல்பாடுகள்',

    // Profile
    editBio: 'சுயவிவர குறிப்பை திருத்து',
    saveProfile: 'சுயவிவரத்தை சேமி',
    bioPlaceholder: 'உங்கள் ஆராய்ச்சி குறிப்புகள் அல்லது கடலோர தகவல்களை இங்கே பதிவு செய்யவும்...',
    accountDetails: 'கணக்கு விவரங்கள்',
    preferredLanguage: 'விருப்பமான மொழி',

    // Dashboard Telemetry & Alerts (தமிழ்)
    liveTelemetryFeeds: 'நேரலை தொலை அளவியல் தரவு',
    criticalThreat: 'அதிதீவிர அச்சுறுத்தல்',
    highThreat: 'உயர் ஆபத்து நிலை',
    moderateThreat: 'மிதமான ஆபத்து நிலை',
    lowThreat: 'குறைந்த ஆபத்து / பாதுகாப்பானது',
    normalHydrodynamicFlow: 'இயல்பான கடல் நீரோட்ட நிலை',
    cycloneThreatDetected: 'புயல் உருவாகும் அச்சுறுத்தல் கண்டறியப்பட்டது',
    expressMongoLiveSync: 'Express & MongoDB நேரலை ஒத்திசைவு',
    telemetryChartTitle: '24 மணிநேர கடல் வெப்பநிலை & அலை உயரத் தரவு',
    telemetryChartSubtitle: '3 மணிநேர இடைவெளியில் பெறப்பட்ட நேரலை சென்சார் அளவீடுகள்',
    stationsActive: '14 நிலையங்கள் செயல்படுகின்றன',
    aiCycloneAlertsTitle: 'AI புயல் எச்சரிக்கைகள்',
    activeAlert: 'செயலில் உள்ள எச்சரிக்கை',
    activeAlerts: 'செயலில் உள்ள எச்சரிக்கைகள்',
    allClear: 'பாதுகாப்பானது',
    noCycloneThreatTitle: 'புயல் உருவாகும் அச்சுறுத்தல் இல்லை',
    noCycloneThreatDesc: 'AI ஆழமான கற்றல் மாதிரிகள் கடல் அளவீடுகள் பாதுகாப்பான வரம்பிற்குள் இருப்பதை உறுதி செய்கின்றன.',
    liveAIMode: 'நேரலை AI மாதிரி ஒத்திசைவு',
    warningBadge: 'எச்சரிக்கை',
    criticalBadge: 'அதிதீவிரம்',
    safeBadge: 'பாதுகாப்பானது',
    sstLegend: 'வெப்பநிலை (°C)',
    waveLegend: 'அலை உயரம் (m)',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('oceanfusion_lang') || 'en';
  });

  const toggleLanguage = (lang) => {
    const selected = lang || (language === 'en' ? 'ta' : 'en');
    setLanguage(selected);
    localStorage.setItem('oceanfusion_lang', selected);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

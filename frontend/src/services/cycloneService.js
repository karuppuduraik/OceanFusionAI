// Real-Time Tropical Cyclone Fetching Service
// Source: GDACS (Global Disaster Alert and Coordination System) — UN / European Commission
// Endpoint returns GeoJSON FeatureCollection of active tropical cyclones worldwide

let cachedStorms = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache

/**
 * Determine ocean basin from geographical coordinates.
 */
export function getOceanBasin(lat, lng) {
  if (lat >= 0 && lat <= 30 && lng >= 78 && lng <= 100) {
    return { name: 'Bay of Bengal', shortName: 'BoB', region: 'North Indian Ocean', code: 'BOB' };
  }
  if (lat >= 0 && lat <= 30 && lng >= 50 && lng < 78) {
    return { name: 'Arabian Sea', shortName: 'AS', region: 'North Indian Ocean', code: 'ARB' };
  }
  if (lat < 0 && lng >= 30 && lng <= 110) {
    return { name: 'South Indian Ocean', shortName: 'SIO', region: 'Indian Ocean', code: 'SIO' };
  }
  if (lat >= 0 && lng >= 100 && lng <= 180) {
    return { name: 'Western Pacific Ocean', shortName: 'W. Pacific', region: 'Pacific Ocean', code: 'WPAC' };
  }
  if (lat < 0 && lng >= 110 && lng <= 180) {
    return { name: 'South-West Pacific Ocean', shortName: 'SW. Pacific', region: 'Pacific Ocean', code: 'SWPAC' };
  }
  if (lat >= 0 && (lng > 180 || lng <= -100)) {
    return { name: 'Eastern Pacific Ocean', shortName: 'E. Pacific', region: 'Pacific Ocean', code: 'EPAC' };
  }
  if (lat >= 0 && lng > -100 && lng <= 0) {
    return { name: 'North Atlantic Ocean', shortName: 'N. Atlantic', region: 'Atlantic Ocean', code: 'NATL' };
  }
  return { name: 'Pacific Ocean', shortName: 'Pacific', region: 'Pacific Ocean', code: 'PAC' };
}

/**
 * Format coordinates for clean human display (e.g. "20.5° N, 135.2° E").
 */
export function formatCoordinates(lat, lng) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(1)}° ${ns}, ${Math.abs(lng).toFixed(1)}° ${ew}`;
}

/**
 * Compute human-readable relative time string from a date.
 * e.g. "2h 15m ago", "just now", "3 days ago"
 */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    const then = new Date(dateStr);
    const now = new Date();
    const diffMs = now - then;
    if (diffMs < 0) return 'upcoming';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ${hrs % 24}h ago`;
  } catch {
    return '';
  }
}

/**
 * Format a date string into a clean display timestamp.
 * e.g. "Sep 18, 2026 14:30 IST"
 */
function formatPredictionTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Fetch detailed track geometry for a specific GDACS event.
 * This provides the full historical trajectory path (multiple lat/lng points).
 */
async function fetchEventTrackGeometry(eventId, episodeId) {
  try {
    // GDACS event geometry endpoint — returns GeoJSON with track points
    const url = `https://www.gdacs.org/gdacsapi/api/events/geteventdata?eventtype=TC&eventid=${eventId}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];

    const data = await res.json();

    // Extract track points from the geometry features
    const trackPoints = [];

    if (data?.features) {
      for (const feature of data.features) {
        if (feature.geometry?.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates;
          const timestamp = feature.properties?.fromdate || feature.properties?.todate || null;
          trackPoints.push({ lat, lng, timestamp });
        } else if (feature.geometry?.type === 'Polygon' && feature.bbox?.length >= 4) {
          const lat = (feature.bbox[1] + feature.bbox[3]) / 2;
          const lng = (feature.bbox[0] + feature.bbox[2]) / 2;
          const timestamp = feature.properties?.fromdate || feature.properties?.todate || null;
          trackPoints.push({ lat, lng, timestamp });
        }
      }
    }

    // Also try the episodes-based geometry
    if (trackPoints.length < 3 && episodeId) {
      try {
        const epUrl = `https://www.gdacs.org/gdacsapi/api/events/geteventgeometry?eventtype=TC&eventid=${eventId}&episodeid=${episodeId}`;
        const epRes = await fetch(epUrl, { signal: AbortSignal.timeout(8000) });
        if (epRes.ok) {
          const epData = await epRes.json();
          if (epData?.features) {
            for (const feature of epData.features) {
              if (feature.geometry?.type === 'Point') {
                const [lng, lat] = feature.geometry.coordinates;
                trackPoints.push({ lat, lng, timestamp: null });
              } else if (feature.geometry?.type === 'Polygon' && feature.bbox?.length >= 4) {
                const lat = (feature.bbox[1] + feature.bbox[3]) / 2;
                const lng = (feature.bbox[0] + feature.bbox[2]) / 2;
                trackPoints.push({ lat, lng, timestamp: null });
              }
            }
          }
        }
      } catch {
        // Episode geometry fetch optional — ignore errors
      }
    }

    return trackPoints;
  } catch (err) {
    console.warn(`[CycloneService] Track geometry fetch failed for event ${eventId}:`, err.message);
    return [];
  }
}

/**
 * Fetch active tropical cyclone events from GDACS API.
 * Returns normalized storm objects for map and dashboard rendering.
 * Now includes: full trajectory tracks, prediction timestamps, and time-ago display.
 */
export async function fetchActiveStormsFromGDACS(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedStorms && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedStorms;
  }

  try {
    // Build date range: last 30 days to today (to capture all currently active storms)
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 30);

    const fmt = (d) => d.toISOString().split('T')[0]; // YYYY-MM-DD

    const url = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?eventtype=TC&country=&fromDate=${fmt(fromDate)}&toDate=${fmt(today)}&alertlevel=&eventid=`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`GDACS API error: ${res.status}`);

    const geojson = await res.json();

    if (!geojson?.features || geojson.features.length === 0) {
      console.info('[CycloneService] No active tropical cyclones from GDACS.');
      cachedStorms = [];
      lastFetchTime = now;
      return [];
    }

    // Deduplicate: GDACS returns multiple polygon features per storm episode
    // Group by eventid and keep only the centroid (Point geometry) or last polygon entry
    const stormMap = new Map();

    for (const feature of geojson.features) {
      const props = feature.properties;
      const eventId = props.eventid;

      // Prefer Point (centroid) features; if polygon, track positions for trajectory
      if (!stormMap.has(eventId)) {
        stormMap.set(eventId, {
          id: `gdacs-${eventId}`,
          eventId,
          episodeId: props.episodeid || null,
          name: props.eventname || props.name || `TC-${eventId}`,
          description: props.description || '',
          alertLevel: props.alertlevel || 'Green',
          severity: props.severitydata?.severity || 0,
          severityText: props.severitydata?.severitytext || 'Unknown',
          severityUnit: props.severitydata?.severityunit || 'km/h',
          source: props.source || 'GDACS',
          fromDate: props.fromdate,
          toDate: props.todate,
          isCurrent: props.iscurrent === 'true',
          affectedCountries: props.affectedcountries || [],
          reportUrl: props.url?.report || null,
          positions: [], // track positions from polygon centroids
          centroid: null,
        });
      }

      const storm = stormMap.get(eventId);

      // Extract position
      if (feature.geometry?.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        storm.centroid = [lat, lng];
      } else if (feature.geometry?.type === 'Polygon' && feature.geometry.coordinates?.length > 0) {
        // Use bounding box center as position
        if (feature.bbox && feature.bbox.length >= 4) {
          const lat = (feature.bbox[1] + feature.bbox[3]) / 2;
          const lng = (feature.bbox[0] + feature.bbox[2]) / 2;
          storm.positions.push([lat, lng]);
        }
      }
    }

    // Fetch detailed track geometry for each storm (parallel, with timeout)
    const trackFetches = [];
    for (const [, storm] of stormMap) {
      if (storm.isCurrent) {
        trackFetches.push(
          fetchEventTrackGeometry(storm.eventId, storm.episodeId)
            .then(trackPoints => ({ eventId: storm.eventId, trackPoints }))
            .catch(() => ({ eventId: storm.eventId, trackPoints: [] }))
        );
      }
    }

    const trackResults = await Promise.allSettled(trackFetches);
    const trackMap = new Map();
    for (const result of trackResults) {
      if (result.status === 'fulfilled' && result.value) {
        trackMap.set(result.value.eventId, result.value.trackPoints);
      }
    }

    // Convert to normalized storm array
    const storms = [];
    for (const [, storm] of stormMap) {
      // Only include current storms
      if (!storm.isCurrent) continue;

      // Determine position: use centroid if available, else last track position
      const position = storm.centroid || (storm.positions.length > 0 ? storm.positions[storm.positions.length - 1] : null);
      if (!position) continue;

      const [lat, lng] = position;
      const basin = getOceanBasin(lat, lng);
      const coordStr = formatCoordinates(lat, lng);

      // Map alert level to category
      const categoryLevel = storm.alertLevel === 'Red' ? 'HIGH'
        : storm.alertLevel === 'Orange' ? 'HIGH'
        : storm.alertLevel === 'Yellow' ? 'MEDIUM'
        : 'LOW';

      // Build track: prefer detailed GDACS event track, fallback to polygon positions
      const detailedTrack = trackMap.get(storm.eventId) || [];
      let track;

      if (detailedTrack.length >= 2) {
        // Use detailed track points (full trajectory)
        track = detailedTrack.map(pt => [pt.lat, pt.lng]);
      } else if (storm.positions.length > 0) {
        // Use polygon-derived positions + current centroid
        track = [...storm.positions];
        if (storm.centroid && (track.length === 0 || 
            track[track.length - 1][0] !== storm.centroid[0] || 
            track[track.length - 1][1] !== storm.centroid[1])) {
          track.push(storm.centroid);
        }
      } else {
        track = [];
      }

      // Determine wind speed from severity
      const windSpeedKmh = storm.severity || 0;

      // Compute prediction timestamps
      const predictionTime = formatPredictionTime(storm.toDate || storm.fromDate);
      const predictionTimeAgo = timeAgo(storm.toDate || storm.fromDate);
      const stormStartTime = formatPredictionTime(storm.fromDate);
      const stormStartTimeAgo = timeAgo(storm.fromDate);

      storms.push({
        id: storm.id,
        name: formatStormName(storm.name),
        categoryLevel,
        status: storm.severityText || 'Tropical Disturbance',
        windSpeed: `${Math.round(windSpeedKmh)} km/h`,
        centralPressure: estimatePressureFromWind(windSpeedKmh),
        waveHeight: estimateWaveFromWind(windSpeedKmh),
        movement: 'Tracking via GDACS',
        locationDescription: storm.description || `${storm.name} in ${basin.name}`,
        position,
        basin,
        coordinatesDisplay: coordStr,
        radiusMeters: estimateRadiusFromSeverity(windSpeedKmh),
        track,
        source: storm.source,
        alertLevel: storm.alertLevel,
        reportUrl: storm.reportUrl,
        fromDate: storm.fromDate,
        toDate: storm.toDate,
        // NEW: Prediction timestamp fields
        predictionTime,
        predictionTimeAgo,
        stormStartTime,
        stormStartTimeAgo,
        isRealTime: true,
      });
    }

    console.info(`[CycloneService] Fetched ${storms.length} active tropical cyclones from GDACS.`);
    cachedStorms = storms;
    lastFetchTime = now;
    return storms;
  } catch (err) {
    console.warn('[CycloneService] GDACS fetch failed:', err.message);
    return cachedStorms || [];
  }
}

/**
 * Format storm name for display.
 * GDACS names like "FIFTEEN-E-26" or "Tropical Cyclone IRMA" → clean name
 */
function formatStormName(raw) {
  if (!raw) return 'Unknown TC';
  let name = raw.replace(/^Tropical Cyclone\s+/i, '').trim();
  if (name === name.toUpperCase() && name.length > 3) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return name;
}

/**
 * Estimate central pressure from max sustained wind using Atkinson-Holliday relationship.
 */
function estimatePressureFromWind(windKmh) {
  const pressure = Math.max(900, Math.round(1015 - 0.3 * windKmh));
  return `${pressure} hPa`;
}

/**
 * Estimate significant wave height from wind speed.
 */
function estimateWaveFromWind(windKmh) {
  const wave = Math.max(0.5, (0.04 * windKmh + 0.5)).toFixed(1);
  return `${wave} m`;
}

/**
 * Estimate storm radius in meters from wind speed severity.
 */
function estimateRadiusFromSeverity(windKmh) {
  if (windKmh > 150) return 350000;
  if (windKmh > 100) return 280000;
  if (windKmh > 60) return 200000;
  return 140000;
}

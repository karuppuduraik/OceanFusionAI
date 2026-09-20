const axios = require('axios');

/**
 * NASA GIBS (Global Imagery Browse Services) & Earthdata Service
 * NASA GIBS is a public WMS/WMTS service that requires NO API KEY.
 */
class NasaService {
  constructor() {
    this.baseUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best';
    this.cache = new Map();
    this.cacheTTL = 30 * 60 * 1000; // 30 minutes cache
  }

  /**
   * Generates NASA GIBS Satellite WMTS Tile URL for requested coordinates and date.
   * Layer: VIIRS_SNPP_CorrectedReflectance_TrueColor or MODIS_Terra_CorrectedReflectance_TrueColor
   */
  getSatelliteTile(lat = 13.2, lon = 82.5, zoom = 6, date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const layer = 'VIIRS_SNPP_CorrectedReflectance_TrueColor';
    const tileMatrixSet = '250m';

    // Convert Lat/Lon to WMTS Tile Matrix Coordinates
    const tileX = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
    const tileY = Math.floor(((90 - lat) / 180) * Math.pow(2, zoom));

    const tileUrl = `${this.baseUrl}/${layer}/default/${targetDate}/${tileMatrixSet}/${zoom}/${tileY}/${tileX}.jpg`;
    
    return {
      layer,
      date: targetDate,
      tileUrl,
      coordinates: { latitude: lat, longitude: lon },
      source: 'NASA GIBS (Public WMS)',
    };
  }

  /**
   * Fetches metadata for latest available satellite imagery coverage.
   */
  async getLatestImagery(lat = 13.2, lon = 82.5) {
    const cacheKey = `nasa_${lat}_${lon}`;
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < this.cacheTTL)) {
      return cached.data;
    }

    const today = new Date().toISOString().split('T')[0];
    const tileInfo = this.getSatelliteTile(lat, lon, 6, today);

    const result = {
      provider: 'NASA GIBS / Earthdata',
      satellite: 'VIIRS / MODIS (Suomi NPP & Terra)',
      layer_name: tileInfo.layer,
      acquisition_date: today,
      imagery_tile_url: tileInfo.tileUrl,
      spatial_resolution: '250m',
      status: 'AVAILABLE',
      timestamp: new Date().toISOString(),
    };

    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }
}

module.exports = new NasaService();

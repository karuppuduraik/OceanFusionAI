// Real-Time Radar and Weather Map Layer Service
// Integrates live RainViewer global radar API and OpenWeatherMap layers

const OPENWEATHER_API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY || '3de732ef8dcb087e65474e2272e2b9f9';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export function formatTimeComponents(dateObj) {
  const day = dateObj.getDate();
  const month = MONTH_NAMES[dateObj.getMonth()];
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return {
    hours,
    minutes,
    formattedDate: `${day} ${month}`,
    formattedTime: `${hours}:${minutes}`,
  };
}

export async function fetchLiveRadarFrames() {
  try {
    const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    if (!response.ok) throw new Error('Radar network response error');
    const data = await response.json();
    const host = data.host || 'https://tilecache.rainviewer.com';
    const frames = data.radar?.past || [];

    if (frames.length > 0) {
      return frames.map((f) => {
        const dateObj = new Date(f.time * 1000);
        const { hours, minutes, formattedDate, formattedTime } = formatTimeComponents(dateObj);
        return {
          time: f.time,
          hours,
          minutes,
          formattedTime,
          formattedDate,
          tileUrl: `${host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
        };
      });
    }
  } catch (error) {
    console.warn('RainViewer API offline or blocked, falling back to live OpenWeather layer:', error);
  }

  // Fallback: Generate 10 recent time-frames
  const now = Date.now();
  const fallbackFrames = [];
  for (let i = 9; i >= 0; i--) {
    const timestamp = now - i * 10 * 60 * 1000;
    const dateObj = new Date(timestamp);
    const { hours, minutes, formattedDate, formattedTime } = formatTimeComponents(dateObj);
    fallbackFrames.push({
      time: Math.floor(timestamp / 1000),
      hours,
      minutes,
      formattedTime,
      formattedDate,
      tileUrl: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    });
  }
  return fallbackFrames;
}

// Generate realistic real-time satellite sequence with NASA GIBS and OpenWeather cloud overlay
export function generateSatelliteFrames() {
  const now = new Date();
  const frames = [];
  const totalFrames = 12;
  const intervalMinutes = 15; // 15-minute satellite scan interval

  for (let i = totalFrames - 1; i >= 0; i--) {
    const frameDate = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const year = frameDate.getUTCFullYear();
    const month = String(frameDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(frameDate.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    // Round minutes to 5 min intervals (e.g., 20, 15, 10, 05, 00)
    const roundedMinutes = Math.floor(frameDate.getMinutes() / 5) * 5;
    const dateWithRoundedMinutes = new Date(frameDate);
    dateWithRoundedMinutes.setMinutes(roundedMinutes);

    const { hours, minutes, formattedDate, formattedTime } = formatTimeComponents(dateWithRoundedMinutes);

    frames.push({
      time: Math.floor(frameDate.getTime() / 1000),
      hours,
      minutes,
      formattedTime,
      formattedDate,
      dateStr,
      // NASA GIBS True Color (Level 9 Web Mercator EPSG:3857)
      tileUrl: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      cloudUrl: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    });
  }
  return frames;
}

export const WEATHER_TILE_LAYERS = {
  precipitation: {
    name: 'Precipitation',
    url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    legendType: 'precipitation',
  },
  radar: {
    name: 'Radar',
    legendType: 'precipitation',
  },
  wind: {
    name: 'Wind Speed',
    url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    legendType: 'wind',
  },
  temperature: {
    name: 'Temperature / SST',
    url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    legendType: 'temperature',
  },
  humidity: {
    name: 'Relative Humidity',
    url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/AIRS_L3_Surface_Relative_Humidity_Daily_Day/default/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png',
    maxNativeZoom: 6,
    legendType: 'humidity',
  },
  clouds: {
    name: 'Clouds / Satellite',
    url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    legendType: 'clouds',
  },
  pressure: {
    name: 'Sea Level Pressure',
    url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    legendType: 'pressure',
  },
};

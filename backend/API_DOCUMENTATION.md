# OceanFusion REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Cyclone Numerical Prediction

### POST `/predict/cyclone`
Predict cyclone formation probability and confidence score based on 11 numerical meteorological and oceanic parameters.

#### Headers
- `Content-Type`: `application/json`

#### Request Body
```json
{
  "sea_surface_temperature": 30,
  "atmospheric_pressure": 1005,
  "wind_speed": 42,
  "humidity": 84,
  "latitude": 13.2,
  "longitude": 82.5,
  "ocean_depth": 3200,
  "vorticity": 4.2,
  "wind_shear": 18,
  "proximity_to_coastline": 260,
  "pre_existing_disturbance": 1
}
```

#### Validation Rules
- All 11 parameters are required and must be numeric.
- `pre_existing_disturbance` must be binary (`0` or `1`).

#### Success Response (200 OK)
```json
{
  "prediction": "Cyclone Detected",
  "probability": 96.8,
  "confidence": 95.2
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "msg": "sea_surface_temperature must be a number",
      "param": "sea_surface_temperature"
    }
  ]
}
```

---

## 2. Satellite Image Cyclone Prediction

### POST `/predict/image`
Classify cyclone intensity category and predicted wind speed from satellite image.

#### Headers
- `Content-Type`: `multipart/form-data`

#### Body Parameters
- `image`: Image file (`PNG`, `JPG`, `JPEG`). Maximum allowed size: `10 MB`.

#### Success Response (200 OK)
```json
{
  "category": "Category 3",
  "wind_speed": 108,
  "confidence": 94.8
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "File size limit exceeded. Maximum file size allowed is 10 MB."
}
```

---

## 3. Live Weather Telemetry

### GET `/weather/live`
Retrieve real-time atmospheric operational metrics.

#### Success Response (200 OK)
```json
{
  "temperature": 29.4,
  "humidity": 82,
  "pressure": 1006.5,
  "wind_speed": 41.2,
  "unit": {
    "temperature": "°C",
    "humidity": "%",
    "pressure": "hPa",
    "wind_speed": "km/h"
  },
  "timestamp": "2026-09-15T14:30:00.000Z"
}
```

---

## 4. Live Ocean Telemetry

### GET `/ocean/live`
Retrieve oceanic operational metrics.

#### Success Response (200 OK)
```json
{
  "sea_surface_temperature": 29.8,
  "wave_height": 2.85,
  "sea_level": 0.48,
  "ocean_current": 1.95,
  "unit": {
    "sea_surface_temperature": "°C",
    "wave_height": "m",
    "sea_level": "m above MSL",
    "ocean_current": "m/s"
  },
  "status": "Normal",
  "timestamp": "2026-09-15T14:30:00.000Z"
}
```

---

## 5. Tsunami Status & Risk Assessment

### GET `/tsunami/live`
Fetch live deep ocean tsunami buoy system status.

#### Success Response (200 OK)
```json
{
  "alert_level": "NORMAL",
  "tsunami_warning_active": false,
  "oceanic_earthquake_detected": false,
  "seismic_magnitude": 4.1,
  "epicenter_distance_km": 420,
  "deep_ocean_buoy_pressure": "1013.25 hPa",
  "wave_amplitude_meters": 0.35,
  "last_updated": "2026-09-15T14:30:00.000Z"
}
```

### POST `/tsunami/assess`
Perform tsunami risk assessment for given seismic telemetry.

#### Request Body
```json
{
  "earthquake_magnitude": 7.8,
  "epicenter_depth_km": 25,
  "distance_to_coast_km": 140
}
```

#### Success Response (200 OK)
```json
{
  "risk_level": "HIGH",
  "probability": 92.5,
  "alert_message": "HIGH TSUNAMI RISK: Severe undersea earthquake detected. Immediate coastal evacuation advisory!",
  "parameters": {
    "earthquake_magnitude": 7.8,
    "epicenter_depth_km": 25,
    "distance_to_coast_km": 140
  },
  "timestamp": "2026-09-15T14:30:00.000Z"
}
```

---

## 6. Aggregated Dashboard API

### GET `/dashboard`
Fetch full aggregated state for frontend dashboard view.

#### Success Response (200 OK)
```json
{
  "weather": {
    "temperature": 29.4,
    "humidity": 82,
    "pressure": 1006.5,
    "wind_speed": 41.2
  },
  "ocean": {
    "sea_surface_temperature": 29.8,
    "wave_height": 2.85,
    "sea_level": 0.48,
    "ocean_current": 1.95
  },
  "tsunami": {
    "alert_level": "NORMAL",
    "buoy_active": true
  },
  "system_status": {
    "overall_risk_level": "NORMAL",
    "active_warnings_count": 0,
    "active_cyclone_watch": false,
    "ai_service_online": true,
    "last_updated": "2026-09-15T14:30:00.000Z"
  },
  "recent_predictions": [],
  "stats": {
    "total_predictions_24h": 12,
    "accuracy_rate": "96.4%",
    "active_monitored_zones": 14
  }
}
```

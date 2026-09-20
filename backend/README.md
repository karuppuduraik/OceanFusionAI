# OceanFusion - Real-Time Ocean Monitoring & Disaster Analytics System (Backend API & AI Microservice)

Backend API service and Flask AI microservice for **OceanFusion**, integrating real-time environmental satellite & ocean data streams from **NASA GIBS**, **NOAA NDBC**, **Copernicus Marine**, and **OpenWeatherMap**, running automated AI model inference, delta variance analysis, and coastal disaster damage estimation.

---

## 🌟 Enhanced System Architecture

```
                                  +-----------------------+
                                  |   React Frontend      |
                                  | (Existing - Unchanged)|
                                  +-----------+-----------+
                                              |
                                              | REST APIs (HTTP)
                                              v
                                  +-----------+-----------+
                                  |   Express Backend     |
                                  |    (Port 5000)        |
                                  +----+-----+-------+----+
                                       |     |       |
      +--------------------------------+     |       +--------------------------------+
      | Data Stream Services                 | Mongoose ODM                           | AI Microservice Integration
      v                                      v                                        v
+-------------------------------+   +-----------------+                       +-----------------------+
| - NASA GIBS (Satellite WMS)   |   |    MongoDB      |                       |   Flask AI Server     |
| - NOAA NDBC (Ocean Buoy Feed) |   | (oceanfusion db)|                       |      (Port 5001)       |
| - Copernicus Marine (CMEMS)   |   +-----------------+                       +-----------+-----------+
| - OpenWeatherMap REST API     |                                                         |
+-------------------------------+                                                +--------+--------+
                                                                                 |                 |
                                                                                 v                 v
                                                                           cyclone_model.pkl   cnn_model.keras
                                                                          (XGBoost/Joblib)   (TensorFlow CNN)
```

---

## 🔑 Environment Variables Setup (`backend/.env`)

Copy `.env.example` to `.env` and set your credentials:

```ini
PORT=5000
FLASK_AI_URL=http://127.0.0.1:5001
MONGODB_URI=mongodb://localhost:27017/oceanfusion
NODE_ENV=development
CORS_ORIGIN=*
MAX_FILE_SIZE_MB=10

# External Environmental API Credentials
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
COPERNICUS_USERNAME=YOUR_COPERNICUS_USERNAME
COPERNICUS_PASSWORD=YOUR_COPERNICUS_PASSWORD
NASA_EARTHDATA_USERNAME=YOUR_NASA_USERNAME
NASA_EARTHDATA_PASSWORD=YOUR_NASA_PASSWORD
```

> **Public APIs (No Key Required)**:
> - **NASA GIBS**: Public WMS/WMTS satellite imagery service.
> - **NOAA NDBC**: Public oceanic buoy RSS/txt observations.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

In `OceanFusion/backend`:

```bash
# Install Node.js backend dependencies
npm install

# Install Python AI microservice dependencies
pip install -r requirements.txt
```

### 2. Launch Flask AI Microservice

In Terminal 1:

```bash
python python/app.py
```
*(Loads `cyclone_model.pkl` and `cnn_model.keras` once on startup at `http://127.0.0.1:5001`)*

### 3. Launch Express Backend Server

In Terminal 2:

```bash
npm run dev
# OR
node server.js
```
*(Runs Express REST APIs on `http://localhost:5000`)*

### 4. Run Automated API Verification Suite

```bash
npm test
```

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/realtime-compare` | Fetches live NASA/NOAA/Copernicus/OpenWeather feeds, runs AI inference, calculates variance, and returns damage estimates |
| `POST` | `/api/predict/cyclone` | Predict cyclone probability from 11 weather/ocean sensor parameters |
| `POST` | `/api/predict/image` | Predict cyclone intensity category & wind speed from satellite image |
| `GET` | `/api/weather/live` | Retrieve live temperature, humidity, pressure, and wind speed |
| `GET` | `/api/ocean/live` | Retrieve live sea surface temp, wave height, sea level, ocean current |
| `GET` | `/api/tsunami/live` | Retrieve live deep ocean buoy tsunami status |
| `POST` | `/api/tsunami/assess` | Assess tsunami risk from seismic parameters |
| `GET` | `/api/dashboard` | Retrieve aggregated dashboard state |

---

## 📊 Sample Payload: `/api/analytics/realtime-compare`

```json
{
  "timestamp": "2026-09-15T09:38:36.344Z",
  "live_nasa_telemetry": {
    "sea_surface_temperature": 30.2,
    "pressure": 998,
    "wind_speed": 63,
    "wave_height": 5.1
  },
  "ai_model_prediction": {
    "cyclone_probability": 95.4,
    "cyclone_category": "Category 3",
    "wind_speed": 110
  },
  "variance_analysis": {
    "sst_delta": 0.8,
    "pressure_delta": 10,
    "wind_delta": 7,
    "wave_delta": 0.6
  },
  "damage_estimation": {
    "damage_index": 86,
    "storm_surge": 5.4,
    "population_risk": "Critical",
    "infrastructure_risk": "High",
    "evacuation": true
  }
}
```

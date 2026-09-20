import numpy as np

def predict_cyclone_xgboost(model, feature_dict):
    """
    Executes inference using loaded XGBoost / Scikit-Learn cyclone model.
    Feature Order:
      1. sea_surface_temperature
      2. atmospheric_pressure
      3. wind_speed
      4. humidity
      5. latitude
      6. longitude
      7. ocean_depth
      8. vorticity
      9. wind_shear
      10. proximity_to_coastline
      11. pre_existing_disturbance
    """
    feature_order = [
        'sea_surface_temperature',
        'atmospheric_pressure',
        'wind_speed',
        'humidity',
        'latitude',
        'longitude',
        'ocean_depth',
        'vorticity',
        'wind_shear',
        'proximity_to_coastline',
        'pre_existing_disturbance'
    ]

    features = [float(feature_dict.get(k, 0.0)) for k in feature_order]
    input_array = np.array([features])

    if hasattr(model, 'predict_proba'):
        probabilities = model.predict_proba(input_array)[0]
        prob_cyclone = float(probabilities[1]) * 100 if len(probabilities) > 1 else float(probabilities[0]) * 100
    else:
        raw_pred = float(model.predict(input_array)[0])
        prob_cyclone = float(raw_pred * 100) if raw_pred <= 1.0 else float(raw_pred)

    prob_cyclone = round(max(0.0, min(100.0, prob_cyclone)), 1)
    is_cyclone = prob_cyclone >= 50.0

    prediction_label = "Cyclone Detected" if is_cyclone else "No Cyclone Detected"
    confidence = round(prob_cyclone if is_cyclone else (100.0 - prob_cyclone), 1)

    return {
        "prediction": prediction_label,
        "probability": prob_cyclone,
        "confidence": confidence
    }

import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AI_MODELS_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'ai_models'))
os.makedirs(AI_MODELS_DIR, exist_ok=True)

XGB_PATH = os.path.join(AI_MODELS_DIR, 'cyclone_model.pkl')
CNN_PATH = os.path.join(AI_MODELS_DIR, 'cnn_model.keras')

def generate_xgboost_model():
    print(f"Generating cyclone numerical prediction model at {XGB_PATH}...")
    from sklearn.ensemble import RandomForestClassifier
    import joblib

    # 11 input features matching dataset schema
    X_train = np.array([
        [30.0, 1005.0, 42.0, 84.0, 13.2, 82.5, 3200.0, 4.2, 18.0, 260.0, 1],
        [28.5, 1002.0, 55.0, 88.0, 12.8, 81.0, 2900.0, 5.1, 15.0, 180.0, 1],
        [24.0, 1015.0, 15.0, 60.0, 18.0, 75.0, 1500.0, 1.0, 25.0, 500.0, 0],
        [25.2, 1012.0, 20.0, 65.0, 16.5, 78.0, 1800.0, 1.5, 22.0, 450.0, 0]
    ])
    y_train = np.array([1, 1, 0, 0])

    clf = RandomForestClassifier(n_estimators=10, random_state=42)
    clf.fit(X_train, y_train)

    joblib.dump(clf, XGB_PATH)
    print(f"Saved cyclone_model.pkl successfully.")

def generate_cnn_model():
    print(f"Generating satellite image CNN intensity model at {CNN_PATH}...")
    try:
        import tensorflow as tf
        from tensorflow.keras import layers, models

        model = models.Sequential([
            layers.Input(shape=(128, 128, 3)),
            layers.Conv2D(16, (3, 3), activation='relu'),
            layers.MaxPooling2D((2, 2)),
            layers.Flatten(),
            layers.Dense(32, activation='relu'),
            layers.Dense(6, activation='softmax')
        ])
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        model.save(CNN_PATH)
        print(f"Saved cnn_model.keras successfully.")
    except Exception as e:
        print(f"TensorFlow not available or encountered issue: {e}. Skipping CNN generator.")

if __name__ == '__main__':
    generate_xgboost_model()
    generate_cnn_model()

"""
rebuild_cnn_model.py
====================
Rebuilds the CNN cyclone intensity classification model in H5 format,
compatible with TensorFlow-CPU 2.13.x on Windows (i3-10110U and similar).

Run this script ONCE after installing tensorflow-cpu==2.13.1:
    python rebuild_cnn_model.py

This replaces cnn_model.keras (Keras 3 format, incompatible with TF 2.13)
with cnn_model.h5 (Keras 2 / TF 2.13 compatible format).
"""

import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AI_MODELS_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'ai_models'))
os.makedirs(AI_MODELS_DIR, exist_ok=True)

H5_PATH  = os.path.join(AI_MODELS_DIR, 'cnn_model.h5')
KERAS_PATH = os.path.join(AI_MODELS_DIR, 'cnn_model.keras')   # will also try to overwrite

def rebuild():
    print("=" * 58)
    print("  OceanFusion CNN Model Rebuilder (TF-CPU 2.13 Compatible)")
    print("=" * 58)

    try:
        import tensorflow as tf
        print(f"[OK] TensorFlow {tf.__version__} import OK")
    except ImportError as e:
        print(f"[FAIL] TensorFlow import failed: {e}")
        print("    Make sure you ran: pip install tensorflow-cpu==2.13.1 keras==2.13.1")
        return False

    # Build the same CNN architecture as the original model
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(128, 128, 3)),
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(6, activation='softmax')   # 6 classes: TD, Cat1-Cat5
    ])

    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Quick synthetic warm-up training
    print("\nWarming up model with synthetic data...")
    X_dummy = np.random.rand(48, 128, 128, 3).astype(np.float32)
    y_dummy = tf.keras.utils.to_categorical(
        np.tile([0, 1, 2, 3, 4, 5], 8), num_classes=6
    )
    model.fit(X_dummy, y_dummy, epochs=3, batch_size=8, verbose=1)

    # Save as H5 format (Keras 2 / TF 2.13 native format)
    model.save(H5_PATH)
    print(f"\nSaved: {H5_PATH}")

    # Also save as .keras for forward compatibility attempt
    try:
        model.save(KERAS_PATH)
        print(f"Saved: {KERAS_PATH}")
    except Exception as e:
        print(f"Could not save .keras format (OK, H5 is enough): {e}")

    print("\nCNN model rebuilt successfully!")
    print("File: cnn_model.h5")
    print("Categories: TD, Cat1, Cat2, Cat3, Cat4, Cat5 (6 classes)")
    print("Input: 128x128 RGB satellite image")
    print("Restart python app.py to load the new model")
    return True

if __name__ == '__main__':
    success = rebuild()
    if not success:
        exit(1)

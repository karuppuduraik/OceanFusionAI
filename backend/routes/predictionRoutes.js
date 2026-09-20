const express = require('express');
const { body } = require('express-validator');
const { predictCyclone, predictImage } = require('../controllers/predictionController');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * @route   POST /api/predict/cyclone
 * @desc    Predict cyclone probability from 11 weather/ocean parameters
 * @access  Public
 */
router.post(
  '/cyclone',
  [
    body('sea_surface_temperature')
      .notEmpty()
      .withMessage('sea_surface_temperature is required')
      .isNumeric()
      .withMessage('sea_surface_temperature must be a number'),
    body('atmospheric_pressure')
      .notEmpty()
      .withMessage('atmospheric_pressure is required')
      .isNumeric()
      .withMessage('atmospheric_pressure must be a number'),
    body('wind_speed')
      .notEmpty()
      .withMessage('wind_speed is required')
      .isNumeric()
      .withMessage('wind_speed must be a number'),
    body('humidity')
      .notEmpty()
      .withMessage('humidity is required')
      .isNumeric()
      .withMessage('humidity must be a number'),
    body('latitude')
      .notEmpty()
      .withMessage('latitude is required')
      .isNumeric()
      .withMessage('latitude must be a number'),
    body('longitude')
      .notEmpty()
      .withMessage('longitude is required')
      .isNumeric()
      .withMessage('longitude must be a number'),
    body('ocean_depth')
      .notEmpty()
      .withMessage('ocean_depth is required')
      .isNumeric()
      .withMessage('ocean_depth must be a number'),
    body('vorticity')
      .notEmpty()
      .withMessage('vorticity is required')
      .isNumeric()
      .withMessage('vorticity must be a number'),
    body('wind_shear')
      .notEmpty()
      .withMessage('wind_shear is required')
      .isNumeric()
      .withMessage('wind_shear must be a number'),
    body('proximity_to_coastline')
      .notEmpty()
      .withMessage('proximity_to_coastline is required')
      .isNumeric()
      .withMessage('proximity_to_coastline must be a number'),
    body('pre_existing_disturbance')
      .notEmpty()
      .withMessage('pre_existing_disturbance is required')
      .isInt({ min: 0, max: 1 })
      .withMessage('pre_existing_disturbance must be 0 or 1'),
  ],
  predictCyclone
);

/**
 * @route   POST /api/predict/image
 * @desc    Predict cyclone intensity category and wind speed from satellite image
 * @access  Public
 */
router.post('/image', upload.single('image'), predictImage);

module.exports = router;

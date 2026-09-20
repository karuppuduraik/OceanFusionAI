const { body, query } = require('express-validator');

/**
 * Express-validator middleware schemas for input validation & sanitization.
 */

const cycloneValidationRules = [
  body('sea_surface_temperature')
    .notEmpty()
    .withMessage('sea_surface_temperature is required')
    .isNumeric()
    .withMessage('sea_surface_temperature must be a valid number'),
  body('atmospheric_pressure')
    .notEmpty()
    .withMessage('atmospheric_pressure is required')
    .isNumeric()
    .withMessage('atmospheric_pressure must be a valid number'),
  body('wind_speed')
    .notEmpty()
    .withMessage('wind_speed is required')
    .isNumeric()
    .withMessage('wind_speed must be a valid number'),
  body('humidity')
    .notEmpty()
    .withMessage('humidity is required')
    .isNumeric()
    .withMessage('humidity must be a valid number'),
  body('latitude')
    .notEmpty()
    .withMessage('latitude is required')
    .isNumeric()
    .withMessage('latitude must be a valid number'),
  body('longitude')
    .notEmpty()
    .withMessage('longitude is required')
    .isNumeric()
    .withMessage('longitude must be a valid number'),
  body('ocean_depth')
    .notEmpty()
    .withMessage('ocean_depth is required')
    .isNumeric()
    .withMessage('ocean_depth must be a valid number'),
  body('vorticity')
    .notEmpty()
    .withMessage('vorticity is required')
    .isNumeric()
    .withMessage('vorticity must be a valid number'),
  body('wind_shear')
    .notEmpty()
    .withMessage('wind_shear is required')
    .isNumeric()
    .withMessage('wind_shear must be a valid number'),
  body('proximity_to_coastline')
    .notEmpty()
    .withMessage('proximity_to_coastline is required')
    .isNumeric()
    .withMessage('proximity_to_coastline must be a valid number'),
  body('pre_existing_disturbance')
    .notEmpty()
    .withMessage('pre_existing_disturbance is required')
    .isInt({ min: 0, max: 1 })
    .withMessage('pre_existing_disturbance must be 0 or 1'),
];

const analyticsQueryRules = [
  query('lat').optional().isNumeric().withMessage('lat must be a number'),
  query('lon').optional().isNumeric().withMessage('lon must be a number'),
];

module.exports = {
  cycloneValidationRules,
  analyticsQueryRules,
};

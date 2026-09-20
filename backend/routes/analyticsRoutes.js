const express = require('express');
const { getRealtimeCompare } = require('../controllers/analyticsController');
const { analyticsQueryRules } = require('../middleware/validators');

const router = express.Router();

/**
 * @route   GET /api/analytics/realtime-compare
 * @desc    Compare live satellite/buoy telemetry (NASA, NOAA, Copernicus, OpenWeather) against AI predictions and compute damage estimates
 * @access  Public
 */
router.get('/realtime-compare', analyticsQueryRules, getRealtimeCompare);

module.exports = router;

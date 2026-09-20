const express = require('express');
const { getLiveWeather } = require('../controllers/weatherController');

const router = express.Router();

/**
 * @route   GET /api/weather/live
 * @desc    Fetch current live weather metrics
 * @access  Public
 */
router.get('/live', getLiveWeather);

module.exports = router;

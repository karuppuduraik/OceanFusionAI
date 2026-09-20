const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @route   GET /api/dashboard
 * @desc    Fetch combined operational dashboard telemetry, warnings, and history
 * @access  Public
 */
router.get('/', getDashboardData);

module.exports = router;

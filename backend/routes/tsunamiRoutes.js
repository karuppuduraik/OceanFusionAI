const express = require('express');
const { getLiveTsunamiStatus, assessTsunamiRisk } = require('../controllers/tsunamiController');

const router = express.Router();

/**
 * @route   GET /api/tsunami/live
 * @desc    Fetch live tsunami buoy status and alert level
 * @access  Public
 */
router.get('/live', getLiveTsunamiStatus);

/**
 * @route   POST /api/tsunami/assess
 * @desc    Assess tsunami risk level from seismic input data
 * @access  Public
 */
router.post('/assess', assessTsunamiRisk);

module.exports = router;

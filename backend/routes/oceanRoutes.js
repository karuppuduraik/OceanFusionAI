const express = require('express');
const { getLiveOcean } = require('../controllers/oceanController');

const router = express.Router();

/**
 * @route   GET /api/ocean/live
 * @desc    Fetch live ocean data
 * @access  Public
 */
router.get('/live', getLiveOcean);

module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/audit', require('./audit'));
router.get('/totals/:userId', require('./totals'));

module.exports = router;

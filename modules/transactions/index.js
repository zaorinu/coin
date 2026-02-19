const express = require('express');
const router = express.Router();

router.post('/transfer', require('./transfer'));
router.post('/deposit', require('./deposit'));
router.post('/withdraw', require('./withdraw'));
router.get('/', require('./list-transactions'));

module.exports = router;

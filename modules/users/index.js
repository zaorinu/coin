const express = require('express');
const router = express.Router();

router.post('/', require('./create-user'));

router.get('/', require('./list-users'));
router.get('/:id', require('./get-user'));
router.delete('/:id', require('./delete-user'));

router.get('/:id/balance', require('./get-balance'));
router.get('/:id/transactions', require('./user-transactions'));

router.put('/:id', require('./update-user'));
router.post('/:id/block', require('./block-user'));

module.exports = router;

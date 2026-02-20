const express = require('express');
const router = express.Router();

const { validate } = require('../../utils/validate');
const transferSchema = require('../../schemas/transactions.transfer.json');
const depositSchema = require('../../schemas/transactions.deposit.json');
const withdrawSchema = require('../../schemas/transactions.withdraw.json');

router.post('/transfer', validate(transferSchema), require('./transfer'));
router.post('/deposit', validate(depositSchema), require('./deposit'));
router.post('/withdraw', validate(withdrawSchema), require('./withdraw'));
router.get('/', require('./list-transactions'));

module.exports = router;

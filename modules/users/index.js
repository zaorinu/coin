const express = require('express');
const router = express.Router();

const { validate } = require('../../utils/validate');
const createUserSchema = require('../../schemas/users.create.json');

router.post('/', validate(createUserSchema), require('./create-user'));

router.get('/', require('./list-users'));
router.get('/:id', require('./get-user'));
router.delete('/:id', require('./delete-user'));

router.get('/:id/balance', require('./get-balance'));
router.get('/:id/transactions', require('./user-transactions'));

const updateUserSchema = require('../../schemas/users.update.json');
const blockUserSchema = require('../../schemas/users.block.json');

router.put('/:id', validate(updateUserSchema), require('./update-user'));
router.post('/:id/block', validate(blockUserSchema), require('./block-user'));

module.exports = router;

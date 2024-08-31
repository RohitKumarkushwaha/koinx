const express = require('express');
const transactionController = require('../controllers/transactionController.js');

const router = express.Router();

router.get('/transactions/:address', transactionController.getTransactions);

module.exports = router;
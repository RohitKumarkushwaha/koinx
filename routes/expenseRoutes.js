const express = require('express');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.get('/expenses/:address', expenseController.getUserExpenses);

module.exports = router;
const express = require('express');
const { getAllTransactions, addTransaction, deleteTransaction, editTransaction }
    = require('../Controllers/ExpenseController');
const router = express.Router();

router.get('/', getAllTransactions);
router.post('/', addTransaction);
router.delete('/:expenseId', deleteTransaction);
router.put('/:expenseId', editTransaction)
module.exports = router;
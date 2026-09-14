const express = require("express");

const router = express.Router();

const {
    addTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction
} = require("../controllers/transactionController");

// Add transaction
router.post("/", addTransaction);

// Get all transactions
router.get("/", getTransactions);

// Delete transaction
router.delete("/:id", deleteTransaction);

// Update transaction
router.put("/:id", updateTransaction);

module.exports = router;
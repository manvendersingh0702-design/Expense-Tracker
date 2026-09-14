const Transaction = require("../models/Transaction");

// Add new transaction
const addTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);

        res.status(201).json({
            success: true,
            message: "Transaction added successfully",
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add transaction",
            error: error.message
        });
    }
};

// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete transaction",
            error: error.message
        });
    }
};

// Update transaction
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update transaction",
            error: error.message
        });
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction
};
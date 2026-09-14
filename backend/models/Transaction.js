const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        type: {
            type: String,
            enum: ["Income", "Expense"],
            required: true
        },

        category: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
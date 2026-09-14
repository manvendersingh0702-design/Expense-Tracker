const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transactions", transactionRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

// Test Route
app.get("/", (req, res) => {
    res.send("Expense Tracker Backend is running!");
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
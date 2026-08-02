require("dotenv").config();

const validateEnv = require("./config/env.validation");
const connectDatabase = require("./config/database");
const bootstrapAdmin = require("./config/bootstrapAdmin");
const app = require("./app");
const mongoose = require("mongoose");
const dns = require("node:dns").promises;
dns.setServers(["8.8.8.8" , "1.1.1.1"])


// Validate Environment Variables
validateEnv();

// Connect Database then run one-time bootstrap
connectDatabase().then(() => bootstrapAdmin());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown Handling
const handleShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
        console.log("HTTP server closed.");
        try {
            await mongoose.connection.close();
            console.log("MongoDB connection closed.");
            process.exit(0);
        } catch (err) {
            console.error("Error closing MongoDB connection:", err.message);
            process.exit(1);
        }
    });
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
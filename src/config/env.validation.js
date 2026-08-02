const validateEnv = () => {
    const requiredEnvVars = [
        "MONGO_URI",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRE",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRE"
    ];

    const missing = requiredEnvVars.filter(
        (envVar) => !process.env[envVar]
    );

    if (missing.length > 0) {
        throw new Error(
            `FATAL: Missing required environment variables: ${missing.join(", ")}`
        );
    }
};

module.exports = validateEnv;

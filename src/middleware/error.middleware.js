const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === "production";


  
    if (!isProduction) {
        console.error("--- Error ---");
        console.error(`[${req.method}] ${req.originalUrl}`);
        console.error(err.stack);
    } else {

        if (statusCode >= 500) {
            console.error(
                `[${new Date().toISOString()}] [${statusCode}] ${req.method} ${req.originalUrl} — ${err.message}`
            );
        }
    }


    res.status(statusCode).json({
        success: false,
        message: err.isOperational
            ? err.message
            : "An unexpected error occurred. Please try again.",
        // Include validation details only for 4xx errors
        ...(statusCode < 500 && err.details ? { details: err.details } : {})
    });

};

module.exports = errorHandler;
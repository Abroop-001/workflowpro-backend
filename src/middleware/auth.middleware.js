const jwt = require("jsonwebtoken");
const User = require("../modules/auth/auth.model");
const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;

        if (!auth?.startsWith("Bearer "))
            return next(new AppError("Authentication required. No token provided.", 401));

        const token = auth.split(" ")[1];

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (err) {
            return next(
                new AppError(
                    err.name === "TokenExpiredError" ? "Token has expired" : "Invalid token",
                    401
                )
            );
        }

        const user = await User.findById(decoded.id)
            .select("_id role company status isDeleted");

        if (!user || user.isDeleted)
            return next(new AppError("User not found", 401));

        if (user.status !== "ACTIVE")
            return next(new AppError("Account has been suspended", 403));

        req.user = {
            id: user._id,
            _id: user._id,
            role: user.role,
            company: user.company
        };

        next();
    } catch {
        next(new AppError("Authentication failed", 401));
    }
};

module.exports = protect;
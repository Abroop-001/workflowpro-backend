const jwt = require("jsonwebtoken");

const AppError = require("./AppError");


const validateExpiry = (expiry) => {
    if (!expiry)
        throw new AppError("JWT expiry configuration missing", 500);

    return expiry;
};


const generateAccessToken = (user) =>
    jwt.sign(
        {
            id:user._id,
            role:user.role,
            company:user.company
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn:validateExpiry(
                process.env.JWT_ACCESS_EXPIRE
            )
        }
    );


const generateRefreshToken = (user) =>
    jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn:validateExpiry(
                process.env.JWT_REFRESH_EXPIRE
            )
        }
    );


module.exports = {
    generateAccessToken,
    generateRefreshToken
};
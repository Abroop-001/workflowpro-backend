const jwt = require("jsonwebtoken");
const RefreshToken = require("../refreshToken.model");
const User = require("../auth.model");
const AppError = require("../../../utils/AppError");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../../../utils/jwt");

const refreshAccessToken = async (token) => {
    if (!token) {
        throw new AppError("Refresh token is required", 400);
    }

    const storedToken = await RefreshToken.findOne({
        token,
        isRevoked: false
    });

    if (!storedToken) {
        throw new AppError(
            "Invalid or already-used refresh token",
            401
        );
    }

    if (storedToken.expiresAt < new Date()) {

        storedToken.isRevoked = true;
        await storedToken.save();
        throw new AppError("Refresh token has expired", 401);
    }

    let decoded;
    try {

        decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

    } catch (error) {

        storedToken.isRevoked = true;
        await storedToken.save();

        throw new AppError("Invalid refresh token", 401);
    }

    const user = await User.findById(decoded.id);

    if (!user || user.isDeleted || user.status !== "ACTIVE") {
        throw new AppError(
            "User account is not active",
            401
        );
    }

    storedToken.isRevoked = true;
    await storedToken.save();

    const newAccessToken  = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await RefreshToken.create({
        user:      user._id,
        token:     newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        accessToken:  newAccessToken,
        refreshToken: newRefreshToken
    };
};

module.exports = refreshAccessToken;
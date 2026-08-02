const bcrypt = require("bcrypt");
const User = require("../auth.model");
const RefreshToken = require("../refreshToken.model");
const AppError = require("../../../utils/AppError");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../../../utils/jwt");

const loginUser = async (loginData) => {

    const {
        email,
        password
    } = loginData;
    
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({
        email: normalizedEmail
    }).select("+password");
    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }
    if (user.isDeleted) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    if (user.status !== "ACTIVE") {
        throw new AppError(
            "Your account has been suspended. Please contact your administrator.",
            403
        );
    }

    if (
        user.lockUntil &&
        user.lockUntil > Date.now()
    ) {
        const minutesLeft = Math.ceil(
            (user.lockUntil - Date.now()) / 60000
        );
        throw new AppError(
            `Account temporarily locked. Try again in ${minutesLeft} minute(s).`,
            423
        );
    }

    const passwordMatched =
        await bcrypt.compare(
            password,
            user.password
        );
    if (!passwordMatched) {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
            user.lockUntil =
                Date.now() +
                15 * 60 * 1000;
            user.failedLoginAttempts = 0;
        }

        await user.save();
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    user.failedLoginAttempts = 0;
    user.lockUntil           = undefined;
    user.lastLogin           = new Date();
    await user.save();

    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt:
            new Date(
                Date.now() +
                7 * 24 * 60 * 60 * 1000
            )
    });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.emailVerificationToken;
    delete userObj.emailVerificationExpire;
    delete userObj.failedLoginAttempts;
    delete userObj.lockUntil;
    return {
        user:         userObj,
        accessToken,
        refreshToken
    };
};
module.exports = loginUser;
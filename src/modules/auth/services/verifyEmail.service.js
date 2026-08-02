const User = require("../auth.model");

const AppError = require("../../../utils/AppError");

const verifyEmail = async (token) => {

    const user = await User.findOne({

        emailVerificationToken: token

    }).select("+emailVerificationToken +emailVerificationExpire");

    if (!user) {

        throw new AppError(
            "Invalid verification token",
            400
        );

    }

    if (
        user.emailVerificationExpire < Date.now()
    ) {

        throw new AppError(
            "Verification token has expired",
            400
        );

    }

    user.isEmailVerified = true;

    user.status = "ACTIVE";

    user.emailVerificationToken = undefined;

    user.emailVerificationExpire = undefined;

    await user.save();

    return user;

};

module.exports = verifyEmail;
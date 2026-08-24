const User = require("../auth.model");
const bcrypt = require("bcrypt");
const AppError = require("../../../utils/AppError");

const changePassword = async (userId, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.mustChangePassword = false;
    await user.save();

    return user;
};

module.exports = changePassword;

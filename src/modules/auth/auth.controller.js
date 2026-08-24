const authService = require("./auth.service");

const registerCompany = async (req, res, next) => {
    try {
        const result = await authService.registerCompany(req.body);

        res.status(201).json({
            success:true,
            message:"Company registered successfully. Please verify your email.",
            data:result
        });
    } catch(error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const user = await authService.verifyEmail(req.params.token);

        res.status(200).json({
            success:true,
            message:"Email verified successfully. Account activated.",
            data:{user}
        });
    } catch(error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);

        res.status(200).json({
            success:true,
            message:"Login successful",
            data:result
        });
    } catch(error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshAccessToken(req.body.refreshToken);

        res.status(200).json({
            success:true,
            message:"Access token generated successfully",
            data:result
        });
    } catch(error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        await authService.logoutUser(req.body.refreshToken);

        res.status(200).json({
            success:true,
            message:"Logout successful"
        });
    } catch(error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        await authService.changePassword(req.user.id, req.body.newPassword);

        res.status(200).json({
            success:true,
            message:"Password changed successfully"
        });
    } catch(error) {
        next(error);
    }
};

module.exports = {
    registerCompany,
    verifyEmail,
    login,
    refreshToken,
    logout,
    changePassword
};
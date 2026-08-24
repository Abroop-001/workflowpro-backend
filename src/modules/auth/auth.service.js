const registerCompany = require("./services/registerCompany.service");
const verifyEmail = require("./services/verifyEmail.service");
const loginUser = require("./services/login.service");
const refreshAccessToken = require("./services/refreshToken.service");
const logoutUser = require("./services/logout.service");
const changePassword = require("./services/changePassword.service");

module.exports = {
    registerCompany,
    verifyEmail,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changePassword
};
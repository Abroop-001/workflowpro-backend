const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validate = require("../../middleware/validate.middleware");

const {
    companyRegisterValidation,
    loginValidation,
    changePasswordValidation
} = require("./auth.validation");
const protect = require("../../middleware/auth.middleware");

const {
    authLimiter
} = require("../../middleware/rateLimit.middleware");


router.post(
    "/register-company",
    authLimiter,
    validate(companyRegisterValidation),
    authController.registerCompany
);


router.get(
    "/verify-email/:token",
    authController.verifyEmail
);


router.post(
    "/login",
    authLimiter,
    validate(loginValidation),
    authController.login
);


router.post(
    "/refresh-token",
    authController.refreshToken
);

router.post(
    "/logout",
    authController.logout
);

router.post(
    "/change-password",
    protect,
    validate(changePasswordValidation),
    authController.changePassword
);

module.exports = router;
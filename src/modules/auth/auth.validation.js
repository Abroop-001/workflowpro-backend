const Joi = require("joi");

const companyRegisterValidation = Joi.object({
    companyName:Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    name:Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required(),

    email:Joi.string()
        .trim()
        .email()
        .required(),

    password:Joi.string()
        .min(8)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
        .required()
        .messages({
            "string.pattern.base":
            "Password must contain uppercase, lowercase, number and special character."
        })
});

const loginValidation = Joi.object({
    email:Joi.string()
        .trim()
        .email()
        .required(),

    password:Joi.string()
        .required()
});

const changePasswordValidation = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
        .required()
        .messages({
            "string.pattern.base":
            "Password must contain uppercase, lowercase, number and special character."
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            "any.only": "Confirm password must match new password."
        })
});

module.exports = {
    companyRegisterValidation,
    loginValidation,
    changePasswordValidation
};
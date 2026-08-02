const Joi = require("joi");

const createUserSchema = Joi.object({
    name:Joi.string()
        .trim()
        .max(50)
        .required(),

    email:Joi.string()
        .email()
        .lowercase()
        .trim()
        .required(),

    password:Joi.string()
        .min(8)
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
        )
        .required()
        .messages({
            "string.pattern.base":
            "Password must contain uppercase, lowercase, number and special character."
        }),

    role:Joi.string()
        .valid(
            "HR",
            "MANAGER",
            "EMPLOYEE"
        )
        .default("EMPLOYEE")
});


const updateUserSchema = Joi.object({

    name:Joi.string()
        .trim()
        .max(50),

    role:Joi.string()
        .valid(
            "HR",
            "MANAGER",
            "EMPLOYEE"
        ),

    status:Joi.string()
        .valid(
            "ACTIVE",
            "INACTIVE",
            "SUSPENDED"
        )
});


module.exports={
    createUserSchema,
    updateUserSchema
};
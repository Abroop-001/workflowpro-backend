const Joi = require("joi");

const createDepartmentSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("", null),

    departmentCode: Joi.string()
        .trim()
        .uppercase()
        .min(2)
        .max(10)
        .pattern(/^[A-Z0-9]+$/)
        .required()
        .messages({
            "string.pattern.base":
                "Department code can contain only uppercase letters and numbers"
        }),

    manager: Joi.string()
        .hex()
        .length(24)
        .allow(null, ""),

    status: Joi.string()
        .valid(
            "ACTIVE",
            "INACTIVE"
        )
        .default("ACTIVE")

});


const updateDepartmentSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("", null),

    departmentCode: Joi.string()
        .trim()
        .uppercase()
        .min(2)
        .max(10)
        .pattern(/^[A-Z0-9]+$/),

    manager: Joi.string()
        .hex()
        .length(24)
        .allow(null, ""),

    status: Joi.string()
        .valid(
            "ACTIVE",
            "INACTIVE"
        )

}).min(1);

module.exports = {
    createDepartmentSchema,
    updateDepartmentSchema
};
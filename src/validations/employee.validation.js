const Joi = require("joi");


const personalInfoSchema = Joi.object({

    firstName: Joi.string()
        .trim()
        .max(50)
        .required(),

    lastName: Joi.string()
        .trim()
        .max(50)
        .allow("", null),

    email: Joi.string()
        .email()
        .lowercase()
        .trim(),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/),

    dateOfBirth: Joi.date(),

    gender: Joi.string()
        .valid(
            "MALE",
            "FEMALE",
            "OTHER"
        )

});


const jobInfoSchema = Joi.object({

    designation: Joi.string()
        .trim()
        .max(100),

    joiningDate: Joi.date(),

    employmentType: Joi.string()
        .valid(
            "FULL_TIME",
            "PART_TIME",
            "CONTRACT",
            "INTERN"
        )

});


const statusSchema = Joi.string()
    .valid(
        "ACTIVE",
        "INACTIVE",
        "ON_LEAVE",
        "TERMINATED"
    );


const createEmployeeSchema = Joi.object({

    employeeId: Joi.string()
        .trim()
        .uppercase()
        .pattern(/^[A-Z0-9-]+$/)
        .max(20)
        .required(),

    personalInfo: personalInfoSchema
        .required(),

    jobInfo: jobInfoSchema,

    department: Joi.string()
        .hex()
        .length(24)
        .allow(null),

    salary: Joi.number()
        .min(0),

    status: statusSchema
        .default("ACTIVE")

});


const updateEmployeeSchema = Joi.object({

    employeeId: Joi.string()
        .trim()
        .uppercase()
        .pattern(/^[A-Z0-9-]+$/)
        .max(20),

    personalInfo: personalInfoSchema,

    jobInfo: jobInfoSchema,

    department: Joi.string()
        .hex()
        .length(24)
        .allow(null),

    salary: Joi.number()
        .min(0),

    status: statusSchema

});


module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema
};
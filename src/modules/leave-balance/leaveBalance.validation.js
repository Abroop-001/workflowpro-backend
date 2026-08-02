const Joi = require("joi");

const createLeaveBalanceSchema = Joi.object({
    employee: Joi.string()
        .hex()
        .length(24)
        .required(),

    year: Joi.number()
        .integer()
        .min(2024)
        .required(),

    casualLeave: Joi.object({
        allocated: Joi.number()
            .min(0),
    }),



    sickLeave: Joi.object({
        allocated: Joi.number()
            .min(0),
    }),



    paidLeave: Joi.object({
        allocated: Joi.number()
            .min(0),

    })

});

const updateLeaveAllocationSchema = Joi.object({

    employee: Joi.string()

        .hex()

        .length(24)

        .required(),



    year: Joi.number()

        .integer()

        .min(2024)

        .required(),



    casualLeave: Joi.number()

        .min(0),



    sickLeave: Joi.number()

        .min(0),



    paidLeave: Joi.number()

        .min(0)

});

const employeeLeaveBalanceSchema = Joi.object({

    employeeId: Joi.string()

        .hex()

        .length(24)

        .required(),



    year: Joi.number()

        .integer()

        .min(2024)

});


module.exports = {

    createLeaveBalanceSchema,

    updateLeaveAllocationSchema,

    employeeLeaveBalanceSchema

};
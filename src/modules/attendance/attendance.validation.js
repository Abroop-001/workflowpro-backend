const Joi = require("joi");

const checkInSchema = Joi.object({

    employee:Joi.string()
        .hex()
        .length(24),

    remarks:Joi.string()
        .trim()
        .max(200)
        .allow("",null)

});


const checkOutSchema = Joi.object({

    attendanceId:Joi.string()
        .hex()
        .length(24)
        .required()

});


const attendanceReportSchema = Joi.object({

    employee:Joi.string()
        .hex()
        .length(24),

    month:Joi.number()
        .integer()
        .min(1)
        .max(12),

    year:Joi.number()
        .integer()
        .min(2020)
        .max(2100)

});


module.exports={
    checkInSchema,
    checkOutSchema,
    attendanceReportSchema
};
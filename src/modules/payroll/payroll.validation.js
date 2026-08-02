const Joi=require("joi");

const generatePayrollSchema=Joi.object({

    employee:Joi.string()
        .hex()
        .length(24)
        .required(),

    month:Joi.number()
        .integer()
        .min(1)
        .max(12)
        .required(),

    year:Joi.number()
        .integer()
        .min(2000)
        .max(2100)
        .required()

});


const markPayrollPaidSchema=Joi.object({

    paymentReference:Joi.string()
        .trim()
        .max(100)
        .allow("",null),

    paymentDate:Joi.date()
        .default(Date.now)

});


module.exports={
    generatePayrollSchema,
    markPayrollPaidSchema
};
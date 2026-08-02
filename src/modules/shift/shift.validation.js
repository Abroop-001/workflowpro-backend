const Joi=require("joi");


const timePattern=/^([01]\d|2[0-3]):([0-5]\d)$/;


const createShiftSchema=Joi.object({

    name:Joi.string()
        .trim()
        .max(50)
        .required(),


    startTime:Joi.string()
        .pattern(timePattern)
        .required(),


    endTime:Joi.string()
        .pattern(timePattern)
        .required(),


    breakDuration:Joi.number()
        .min(0)
        .default(60),


    workingHours:Joi.number()
        .min(1)
        .max(24)
        .default(8),


    gracePeriod:Joi.number()
        .min(0)
        .default(15),


    isNightShift:Joi.boolean()
        .default(false)


}).unknown(false);





const updateShiftSchema=Joi.object({


    name:Joi.string()
        .trim()
        .max(50),


    startTime:Joi.string()
        .pattern(timePattern),


    endTime:Joi.string()
        .pattern(timePattern),


    breakDuration:Joi.number()
        .min(0),


    workingHours:Joi.number()
        .min(1)
        .max(24),


    gracePeriod:Joi.number()
        .min(0),


    isNightShift:Joi.boolean()


})
.min(1)
.unknown(false);




module.exports={
    createShiftSchema,
    updateShiftSchema
};
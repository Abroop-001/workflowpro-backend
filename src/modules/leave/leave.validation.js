const Joi = require("joi");

const id = Joi.string()
    .hex()
    .length(24);


const createLeaveSchema = Joi.object({

    employee:id,

    leaveType:Joi.string()
        .valid(
            "CASUAL",
            "SICK",
            "PAID",
            "UNPAID",
            "OTHER"
        )
        .required(),

    startDate:Joi.date()
        .required(),

    endDate:Joi.date()
        .min(Joi.ref("startDate"))
        .required(),

    reason:Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required()

});


const approveLeaveSchema = Joi.object({});


const rejectLeaveSchema = Joi.object({

    rejectionReason:Joi.string()
        .trim()
        .min(3)
        .max(300)
        .required()

});


const cancelLeaveSchema = Joi.object({});


module.exports={
    createLeaveSchema,
    approveLeaveSchema,
    rejectLeaveSchema,
    cancelLeaveSchema
};
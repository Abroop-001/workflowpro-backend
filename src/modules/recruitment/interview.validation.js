const Joi = require("joi");

const objectId = Joi.string()
    .length(24)
    .hex();

const createInterviewSchema = Joi.object({
    candidateName: Joi.string().trim().min(2).max(100).required(),
    candidateEmail: Joi.string().email().required(),
    candidatePhone: Joi.string().trim().required(),
    position: Joi.string().trim().min(2).max(100).required(),
    interviewer: objectId.required(),
    interviewDate: Joi.date().required(),
    interviewTime: Joi.string().required(),
    interviewType: Joi.string().valid("ONLINE", "OFFLINE", "PHONE").default("ONLINE"),
    status: Joi.string().valid("SCHEDULED", "COMPLETED", "CANCELLED").default("SCHEDULED")
});

const updateInterviewStatusSchema = Joi.object({
    status: Joi.string().valid("SCHEDULED", "COMPLETED", "CANCELLED").required()
});

module.exports = {
    createInterviewSchema,
    updateInterviewStatusSchema
};
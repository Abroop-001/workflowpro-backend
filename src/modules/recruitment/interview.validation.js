const Joi = require("joi");



// ObjectId validation

const objectId = Joi.string()

    .length(24)

    .hex();









// ======================================
// Schedule Interview
// ======================================

const createInterviewSchema = Joi.object({


    candidate: objectId

        .required(),




    round:Joi.string()

        .valid(

            "SCREENING",

            "TECHNICAL",

            "MANAGERIAL",

            "HR",

            "FINAL"

        )

        .required(),




    interviewer:objectId

        .required(),




    scheduledDate:Joi.date()

        .greater("now")

        .required(),




    duration:Joi.number()

        .min(15)

        .max(480)

        .default(60),




    mode:Joi.string()

        .valid(

            "ONLINE",

            "OFFLINE",

            "PHONE"

        )

        .default("ONLINE"),




    meetingLink:Joi.string()

        .uri()

        .allow(""),




    location:Joi.string()

        .trim()

        .max(200)

        .allow("")


});









// ======================================
// Update Interview Status
// ======================================

const updateInterviewStatusSchema = Joi.object({


    status:Joi.string()

        .valid(

            "SCHEDULED",

            "COMPLETED",

            "CANCELLED",

            "RESCHEDULED"

        )

        .required()


});









// ======================================
// Submit Interview Feedback
// ======================================

const submitInterviewFeedbackSchema = Joi.object({


    rating:Joi.number()

        .min(1)

        .max(5)

        .required(),




    comments:Joi.string()

        .trim()

        .max(1000)

        .required(),




    recommendation:Joi.string()

        .valid(

            "SELECT",

            "REJECT",

            "HOLD"

        )

        .required()


});









// ======================================
// Reschedule Interview
// ======================================

const rescheduleInterviewSchema = Joi.object({


    scheduledDate:Joi.date()

        .greater("now")

        .required()


});









module.exports={


    createInterviewSchema,


    updateInterviewStatusSchema,


    submitInterviewFeedbackSchema,


    rescheduleInterviewSchema


};
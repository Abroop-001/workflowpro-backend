const Joi = require("joi");


const createPerformanceSchema = Joi.object({

    employee:Joi.string()
        .hex()
        .length(24)
        .required(),


    reviewPeriod:Joi.string()
        .trim()
        .pattern(/^\d{4}-(Q[1-4])$/)
        .required()
        .messages({
            "string.pattern.base":
            "Review period must be like 2026-Q1"
        }),


    goals:Joi.array()
        .items(

            Joi.object({

                title:Joi.string()
                    .trim()
                    .max(100)
                    .required(),


                description:Joi.string()
                    .trim()
                    .max(500)
                    .allow(""),


                targetDate:Joi.date()
                    .optional(),


                status:Joi.string()
                    .valid(
                        "PENDING",
                        "IN_PROGRESS",
                        "COMPLETED"
                    )
                    .default("PENDING")

            })
            .unknown(false)

        )
        .min(1)
        .max(20)
        .required()


})
.unknown(false);





const submitSelfReviewSchema = Joi.object({

    comments:Joi.string()
        .trim()
        .max(1000)
        .required(),


    rating:Joi.number()
        .min(1)
        .max(5)
        .required()

})
.unknown(false);





const submitManagerReviewSchema = Joi.object({

    comments:Joi.string()
        .trim()
        .max(1000)
        .required(),


    rating:Joi.number()
        .min(1)
        .max(5)
        .required()

})
.unknown(false);





const updateGoalStatusSchema = Joi.object({

    goalId:Joi.string()
        .hex()
        .length(24)
        .required(),


    status:Joi.string()
        .valid(
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED"
        )
        .required()

})
.unknown(false);


const updatePerformanceSchema = Joi.object({
    reviewPeriod:Joi.string()
        .trim()
        .pattern(/^\d{4}-(Q[1-4])$/)
        .messages({
            "string.pattern.base":
            "Review period must be like 2026-Q1"
        }),

    goals:Joi.array()
        .items(
            Joi.object({
                title:Joi.string()
                    .trim()
                    .max(100)
                    .required(),

                description:Joi.string()
                    .trim()
                    .max(500)
                    .allow(""),

                targetDate:Joi.date()
                    .optional(),

                status:Joi.string()
                    .valid(
                        "PENDING",
                        "IN_PROGRESS",
                        "COMPLETED"
                    )
                    .default("PENDING")
            })
            .unknown(false)
        )
        .min(1)
        .max(20)
})
.min(1)
.unknown(false);


module.exports={
    createPerformanceSchema,
    submitSelfReviewSchema,
    submitManagerReviewSchema,
    updateGoalStatusSchema,
    updatePerformanceSchema
};
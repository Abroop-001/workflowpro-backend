const Joi = require("joi");


const {

    NOTIFICATION_TYPE,

    NOTIFICATION_PRIORITY

} = require("./notification.constants");


const objectId = Joi.string()

    .length(24)

    .hex();



const createNotificationSchema = Joi.object({



    user:objectId

        .required(),





    type:Joi.string()

        .valid(

            ...Object.values(

                NOTIFICATION_TYPE

            )

        )

        .required(),





    priority:Joi.string()

        .valid(

            ...Object.values(

                NOTIFICATION_PRIORITY

            )

        )

        .default(

            NOTIFICATION_PRIORITY.MEDIUM

        ),





    title:Joi.string()

        .trim()

        .min(3)

        .max(150)

        .required(),





    message:Joi.string()

        .trim()

        .min(3)

        .max(500)

        .required(),





    reference:Joi.object({

        

        module:Joi.string()

            .trim()

            .allow(null),




        id:objectId

            .allow(null)



    })

    .optional(),





    expiresAt:Joi.date()

        .allow(null)

        .optional()



});


const markReadSchema = Joi.object({


    notificationId:objectId

        .required()


});


const notificationFilterSchema = Joi.object({



    type:Joi.string()

        .valid(

            ...Object.values(

                NOTIFICATION_TYPE

            )

        ),

    priority:Joi.string()

        .valid(

            ...Object.values(

                NOTIFICATION_PRIORITY

            )

        ),

    isRead:Joi.boolean()



});

module.exports={


    createNotificationSchema,


    markReadSchema,


    notificationFilterSchema


};
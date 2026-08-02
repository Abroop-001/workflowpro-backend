const AppError = require("../../utils/AppError");


const {

    createNotification,

    findUserNotifications,

    countUserNotifications,

    countUnreadNotifications,

    markNotificationRead,

    findNotificationById,

    deleteExpiredNotifications

} = require("./notification.query");

const sendNotification = async (

    data,

    companyId,

    createdBy=null

)=>{


    const notification = await createNotification({

        ...data,

        company:companyId,

        createdBy
    });

    return notification;

};

const getUserNotifications = async (

    userId,

    companyId,

    filters={},

    page=1,

    limit=10

)=>{


    const skip =

        (

            Number(page)-1

        )

        *

        Number(limit);

    const [

        notifications,

        total

    ] = await Promise.all([



        findUserNotifications(

            userId,

            companyId,

            filters,

            {

                skip,

                limit:Number(limit)

            }

        ),

        countUserNotifications(

            userId,

            companyId,

            filters

        )



    ]);

return {


        notifications,


        pagination:{


            total,


            page:Number(page),


            limit:Number(limit),


            pages:Math.ceil(

                total /

                Number(limit)

            )


        }


    };

};


const getUnreadCount = async (

    userId,

    companyId

)=>{


    return await countUnreadNotifications(

        userId,

        companyId

    );

};

const markAsRead = async (

    notificationId,

    userId,

    companyId

)=>{


    const notification = await findNotificationById(

        notificationId,

        companyId,

        userId

    );

    if(!notification){

        throw new AppError(

            "Notification not found",

            404

        );

    }

    const updated = await markNotificationRead(

        notificationId,

        userId,

        companyId

    );

    return updated;

};

const removeExpiredNotifications = async ()=>{


    return deleteExpiredNotifications(

        new Date()

    );

};

module.exports={
    sendNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    removeExpiredNotifications
};
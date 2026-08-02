const Notification = require("./notification.model");

const findNotificationById = (

    notificationId,

    companyId,

    userId

)=>{


    return Notification.findOne({

        _id:notificationId,

        company:companyId,

        user:userId

    });

};


const createNotification = (

    payload

)=>{


    return Notification.create(

        payload

    );

};

const findUserNotifications = (

    userId,

    companyId,

    filters={},

    options={}

)=>{


    const query={


        user:userId,


        company:companyId


    };

    if(filters.type){

        query.type = filters.type;

    }

    if(filters.priority){

        query.priority = filters.priority;

    }


    if(filters.isRead !== undefined){

        query.isRead = filters.isRead;

    }

    return Notification.find(query)

        .sort({

            createdAt:-1

        })

        .skip(

            options.skip || 0

        )

        .limit(

            options.limit || 10

        );

};


const countUserNotifications = (

    userId,

    companyId,

    filters={}

)=>{


    const query={


        user:userId,


        company:companyId


    };

    if(filters.type){

        query.type = filters.type;

    }

    if(filters.priority){

        query.priority = filters.priority;

    }

    if(filters.isRead !== undefined){

        query.isRead = filters.isRead;

    }

    return Notification.countDocuments(

        query

    );

};

const countUnreadNotifications = (

    userId,

    companyId

)=>{


    return Notification.countDocuments({

        user:userId,

        company:companyId,

        isRead:false

    });

};

const markNotificationRead = (

    notificationId,

    userId,

    companyId

)=>{


    return Notification.findOneAndUpdate(

        {


            _id:notificationId,


            user:userId,


            company:companyId


        },


        {


            isRead:true,


            readAt:new Date()


        },


        {


            new:true


        }

    );

};


const deleteExpiredNotifications = (

    date

)=>{


    return Notification.deleteMany({

        expiresAt:{

            $lte:date

        }

    });

};

module.exports={
    findNotificationById,
    createNotification,
    findUserNotifications,
    countUserNotifications,
    countUnreadNotifications,
    markNotificationRead,
    deleteExpiredNotifications


};
const notificationService = require("./notification.service");

const getNotifications = async (

    req,

    res,

    next

)=>{


    try{


        const result = await notificationService.getUserNotifications(

            req.user._id,

            req.user.company,

            req.query,

            req.query.page,

            req.query.limit

        );

        res.status(200).json({

            success:true,

            data:result

        });



    }

    catch(error){

        next(error);

    }


};

const getUnreadCount = async (

    req,

    res,

    next

)=>{


    try{


        const count = await notificationService.getUnreadCount(

            req.user._id,

            req.user.company

        );

        res.status(200).json({

            success:true,

            data:{


                unreadCount:count


            }

        });



    }

    catch(error){

        next(error);

    }


};

const markAsRead = async (

    req,

    res,

    next

)=>{


    try{


        const notification = await notificationService.markAsRead(

            req.params.id,

            req.user._id,

            req.user.company

        );

        res.status(200).json({

            success:true,

            message:"Notification marked as read",

            data:{
                notification

            }

        });



    }

    catch(error){

        next(error);

    }
};

const createNotification = async (

    req,

    res,

    next

)=>{
    try{

        const notification = await notificationService.sendNotification(

            req.body,

            req.user.company,

            req.user._id

        );

        res.status(201).json({

            success:true,

            message:"Notification created successfully",

            data:{


                notification


            }

        });

    }

    catch(error){

        next(error);

    }
};

module.exports={
    getNotifications,
    getUnreadCount,
    markAsRead,
    createNotification


};
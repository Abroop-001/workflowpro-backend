const express = require("express");

const router = express.Router();



const notificationController = require("./notification.controller");

const protect = require("../../middleware/auth.middleware");

const authorize = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");

const {

    createNotificationSchema

} = require("./notification.validation");


router.get(

    "/",

    protect,

    notificationController.getNotifications

);


router.get(

    "/unread-count",

    protect,

    notificationController.getUnreadCount

);


router.patch(

    "/:id/read",

    protect,

    notificationController.markAsRead

);


router.post(

    "/",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    validate(createNotificationSchema),

    notificationController.createNotification

);


module.exports = router;
const NOTIFICATION_TYPE = {


    LEAVE: "LEAVE",


    PAYROLL: "PAYROLL",


    ATTENDANCE: "ATTENDANCE",


    RECRUITMENT: "RECRUITMENT",


    DOCUMENT: "DOCUMENT",


    PERFORMANCE: "PERFORMANCE",


    SYSTEM: "SYSTEM"


};








const NOTIFICATION_PRIORITY = {


    LOW: "LOW",


    MEDIUM: "MEDIUM",


    HIGH: "HIGH",


    URGENT: "URGENT"


};








const NOTIFICATION_STATUS = {


    UNREAD: false,


    READ: true


};








const NOTIFICATION_EXPIRY_DAYS = {


    DEFAULT: 90


};








module.exports = {


    NOTIFICATION_TYPE,


    NOTIFICATION_PRIORITY,


    NOTIFICATION_STATUS,


    NOTIFICATION_EXPIRY_DAYS


};
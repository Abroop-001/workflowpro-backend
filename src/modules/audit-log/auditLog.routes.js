const express=require("express");

const router=express.Router();

const auditLogController=require("./auditLog.controller");

const protect=require("../../middleware/auth.middleware");
const authorize=require("../../middleware/role.middleware");


router.get(
    "/",
    protect,
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "HR"
    ),
    auditLogController.getAuditLogs
);


router.get(
    "/user/:userId",
    protect,
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN"
    ),
    auditLogController.getUserActivity
);


router.get(
    "/module/:module",
    protect,
    authorize(
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "HR"
    ),
    auditLogController.getModuleHistory
);


module.exports=router;
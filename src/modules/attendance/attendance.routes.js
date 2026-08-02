const express=require("express");
const router=express.Router();

const attendanceController=require("./attendance.controller");

const protect=require("../../middleware/auth.middleware");
const authorize=require("../../middleware/role.middleware");
const validate=require("../../middleware/validate.middleware");

const {
    checkInSchema,
    checkOutSchema
}=require("./attendance.validation");


router.post(
    "/check-in",
    protect,
    authorize(
        "EMPLOYEE",
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(checkInSchema),
    attendanceController.checkIn
);


router.post(
    "/check-out",
    protect,
    authorize(
        "EMPLOYEE",
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(checkOutSchema),
    attendanceController.checkOut
);


router.get(
    "/today",
    protect,
    authorize(
        "EMPLOYEE",
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    attendanceController.getTodayAttendance
);


router.get(
    "/employee/:employeeId",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR",
        "MANAGER"
    ),
    attendanceController.getEmployeeAttendance
);

router.get(
    "/",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR",
        "MANAGER"
    ),
    attendanceController.getAttendances
);

module.exports=router;
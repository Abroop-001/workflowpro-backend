const express = require("express");
const router = express.Router();

const leaveBalanceController = require("./leaveBalance.controller");

const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createLeaveBalanceSchema,
    updateLeaveAllocationSchema
} = require("./leaveBalance.validation");


router.post(
    "/",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(createLeaveBalanceSchema),
    leaveBalanceController.createLeaveBalance
);


router.get(
    "/employee/:employeeId",
    protect,
    authorize(
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    leaveBalanceController.getEmployeeLeaveBalance
);


router.get(
    "/my",
    protect,
    authorize("EMPLOYEE"),
    leaveBalanceController.getMyLeaveBalance
);


router.patch(
    "/employee/:employeeId",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(updateLeaveAllocationSchema),
    leaveBalanceController.updateAllocation
);


module.exports = router;
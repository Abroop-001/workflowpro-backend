const express = require("express");
const router = express.Router();

const leaveController = require("./leave.controller");

const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createLeaveSchema,
    approveLeaveSchema,
    rejectLeaveSchema,
    cancelLeaveSchema
} = require("./leave.validation");



router.post(
    "/",
    protect,
    authorize(
        "EMPLOYEE",
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(createLeaveSchema),
    leaveController.createLeave
);


router.patch(
    "/:id/approve",
    protect,
    authorize(
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(approveLeaveSchema),
    leaveController.approveLeave
);


router.patch(
    "/:id/reject",
    protect,
    authorize(
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(rejectLeaveSchema),
    leaveController.rejectLeave
);


router.patch(
    "/:id/cancel",
    protect,
    authorize(
        "EMPLOYEE",
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(cancelLeaveSchema),
    leaveController.cancelLeave
);


router.get(
    "/employee/:employeeId",
    protect,
    authorize(
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    leaveController.getEmployeeLeaves
);

router.get(
    "/",
    protect,
    authorize(
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    leaveController.getLeaves
);

module.exports = router;
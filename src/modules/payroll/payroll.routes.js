const router = require("express").Router();

const payrollController = require("./payroll.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    generatePayrollSchema,
    markPayrollPaidSchema
} = require("./payroll.validation");


router.post(
    "/generate",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    validate(generatePayrollSchema),
    payrollController.createPayroll
);

router.get(
    "/",
    protect,
    authorize("HR","COMPANY_ADMIN","MANAGER"),
    payrollController.getCompanyPayroll
);

router.get(
    "/employee/:employeeId",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "MANAGER",
        "EMPLOYEE"
    ),
    payrollController.getEmployeePayrollHistory
);

router.get(
    "/:id",
    protect,
    authorize("HR","COMPANY_ADMIN","MANAGER"),
    payrollController.getPayrollById
);

router.patch(
    "/:id/approve",
    protect,
    authorize("COMPANY_ADMIN"),
    payrollController.approvePayroll
);

router.patch(
    "/:id/pay",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    validate(markPayrollPaidSchema),
    payrollController.markPayrollPaid
);

router.patch(
    "/:id/cancel",
    protect,
    authorize("COMPANY_ADMIN"),
    payrollController.cancelPayroll
);

module.exports = router;
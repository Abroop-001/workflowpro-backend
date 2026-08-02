const express = require("express");

const router = express.Router();


const payslipController = require("./payslip.controller");

const downloadController = require("./payslip.download.controller");


const protect = require("../../middleware/auth.middleware");

const authorize = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");


const {
    generatePayslipSchema
} = require("./payslip.validation");




// Generate Payslip

router.post(
    "/generate",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(generatePayslipSchema),
    payslipController.createPayslip
);




// Get Employee Payslip History

router.get(
    "/employee/:employeeId",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "MANAGER"
    ),
    payslipController.getEmployeePayslips
);




// Download Payslip PDF

router.get(
    "/:id/download",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "EMPLOYEE"
    ),
    downloadController.downloadPayslip
);




// Get Payslip Details

router.get(
    "/:id",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "MANAGER",
        "EMPLOYEE"
    ),
    payslipController.getPayslipById
);


module.exports = router;
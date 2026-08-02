const express = require("express");
const router = express.Router();

const employeeController = require("./employee.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createEmployeeSchema,
    updateEmployeeSchema
} = require("../../validations/employee.validation");


router.post(
    "/",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR"
    ),
    validate(createEmployeeSchema),
    employeeController.createEmployee
);


router.get(
    "/",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR",
        "MANAGER"
    ),
    employeeController.getEmployees
);


router.get(
    "/:id",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR",
        "MANAGER",
        "EMPLOYEE"
    ),
    employeeController.getEmployee
);


router.patch(
    "/:id",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR"
    ),
    validate(updateEmployeeSchema),
    employeeController.updateEmployee
);


router.patch(
    "/:id/deactivate",
    protect,
    authorize(
        "COMPANY_ADMIN"
    ),
    employeeController.deactivateEmployee
);


module.exports = router;
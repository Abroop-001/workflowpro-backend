const express = require("express");
const router = express.Router();
const departmentController = require("./department.controller");

const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createDepartmentSchema,
    updateDepartmentSchema
} = require("./department.validation");

router.post(
    "/",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR"
    ),
    validate(createDepartmentSchema),
    departmentController.createDepartment
);

router.get(
    "/",
  protect,
    authorize(
        "COMPANY_ADMIN",
        "HR",
        "MANAGER"
    ),
    departmentController.getDepartments
);

router.get(
    "/:id/details",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR",
        "MANAGER"
    ),
    departmentController.getDepartmentDetails
);

router.get(
    "/:id",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR",
        "MANAGER"
    ),
    departmentController.getDepartment
);

router.patch(
    "/:id",
    protect,
    authorize(
        "COMPANY_ADMIN",
        "HR"
    ),
    validate(updateDepartmentSchema),
    departmentController.updateDepartment
);

router.patch(
    "/:id/deactivate",
    protect,
    authorize(
        "COMPANY_ADMIN"
    ),
    departmentController.deactivateDepartment
);

module.exports = router;
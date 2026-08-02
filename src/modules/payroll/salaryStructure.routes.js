const express = require("express");

const router = express.Router();


const salaryController = require("./salaryStructure.controller");


// Middleware

const protect = require("../../middleware/auth.middleware");

const authorize = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");



// Validation

const {

    createSalaryStructureSchema,

    updateSalaryStructureSchema

} = require("./salaryStructure.validation");









// =======================================
// Create Salary Structure
// HR / Company Admin
// =======================================

router.post(

    "/",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    validate(createSalaryStructureSchema),

    salaryController.createSalaryStructure

);









// =======================================
// Get All Company Salary Structures
// =======================================

router.get(

    "/",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    salaryController.getCompanySalaryStructures

);









// =======================================
// Get Employee Salary
// =======================================

router.get(

    "/employee/:employeeId",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    salaryController.getEmployeeSalary

);









// =======================================
// Update Salary Structure
// =======================================

router.patch(

    "/:id",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    validate(updateSalaryStructureSchema),

    salaryController.updateSalaryStructure

);









// =======================================
// Deactivate Salary
// =======================================

router.delete(

    "/:id",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    salaryController.deactivateSalaryStructure

);









module.exports = router;
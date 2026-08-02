const express = require("express");

const router = express.Router();


const userController = require("./user.controller");

const protect = require("../../middleware/auth.middleware");

const authorize = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");


const {
    createUserSchema,
    updateUserSchema
} = require("./user.validation");




// =======================================
// Create User
// COMPANY_ADMIN only
// =======================================

router.post(

    "/",

    protect,

    authorize(
        "COMPANY_ADMIN"
    ),

    validate(createUserSchema),

    userController.createUser

);




// =======================================
// Get Company Users
// COMPANY_ADMIN / HR
// =======================================

router.get(

    "/",

    protect,

    authorize(
        "COMPANY_ADMIN",
        "HR"
    ),

    userController.getUsers

);




// =======================================
// Get User Details
// COMPANY_ADMIN / HR
// =======================================

router.get(

    "/:id",

    protect,

    authorize(
        "COMPANY_ADMIN",
        "HR"
    ),

    userController.getUser

);




// =======================================
// Update User
// COMPANY_ADMIN only
// =======================================

router.patch(

    "/:id",

    protect,

    authorize(
        "COMPANY_ADMIN"
    ),

    validate(updateUserSchema),

    userController.updateUser

);




// =======================================
// Change User Status
// COMPANY_ADMIN only
// =======================================

router.patch(

    "/:id/status",

    protect,

    authorize(
        "COMPANY_ADMIN"
    ),

    userController.toggleStatus

);



module.exports = router;
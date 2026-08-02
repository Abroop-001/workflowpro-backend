const express = require("express");
const router = express.Router();

const shiftController = require("./shift.controller");

const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createShiftSchema,
    updateShiftSchema
}=require("./shift.validation");


router.post(
    "/",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(createShiftSchema),
    shiftController.createShift
);


router.get(
    "/",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    shiftController.getCompanyShifts
);


router.get(
    "/:id",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    shiftController.getShiftById
);


router.patch(
    "/:id",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(updateShiftSchema),
    shiftController.updateShift
);


router.patch(
    "/:id/deactivate",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    shiftController.deactivateShift
);


module.exports = router;
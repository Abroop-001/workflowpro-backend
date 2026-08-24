const express = require("express");
const router = express.Router();
const interviewController = require("./interview.controller");
const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createInterviewSchema,
    updateInterviewStatusSchema
} = require("./interview.validation");

router.post(
    "/",
    protect,
    authorize("HR", "COMPANY_ADMIN", "MANAGER"),
    validate(createInterviewSchema),
    interviewController.createInterview
);

router.get(
    "/",
    protect,
    authorize("HR", "COMPANY_ADMIN", "MANAGER"),
    interviewController.getInterviews
);

router.get(
    "/:id",
    protect,
    authorize("HR", "COMPANY_ADMIN", "MANAGER", "EMPLOYEE"),
    interviewController.getInterviewById
);

router.patch(
    "/:id/status",
    protect,
    authorize("HR", "COMPANY_ADMIN", "MANAGER"),
    validate(updateInterviewStatusSchema),
    interviewController.updateInterviewStatus
);

module.exports = router;
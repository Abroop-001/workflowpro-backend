const express = require("express");

const router = express.Router();

const performanceController = require("./performance.controller");

const protect = require("../../middleware/auth.middleware");
const authorize = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createPerformanceSchema,
    submitSelfReviewSchema,
    submitManagerReviewSchema,
    updateGoalStatusSchema,
    updatePerformanceSchema
} = require("./performance.validation");



router.post(
    "/",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(createPerformanceSchema),
    performanceController.createPerformance
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
    performanceController.getEmployeePerformance
);



router.get(
    "/:id",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "MANAGER",
        "EMPLOYEE"
    ),
    performanceController.getPerformanceById
);



router.patch(
    "/:id/self-review",
    protect,
    authorize(
        "EMPLOYEE"
    ),
    validate(submitSelfReviewSchema),
    performanceController.submitSelfReview
);



router.patch(
    "/:id/manager-review",
    protect,
    authorize(
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(submitManagerReviewSchema),
    performanceController.submitManagerReview
);



router.patch(
    "/:id/goals",
    protect,
    authorize(
        "EMPLOYEE",
        "MANAGER",
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(updateGoalStatusSchema),
    performanceController.updateGoalStatus
);


router.patch(
    "/:id",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    validate(updatePerformanceSchema),
    performanceController.updatePerformance
);


router.delete(
    "/:id",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN"
    ),
    performanceController.deletePerformance
);


module.exports = router;
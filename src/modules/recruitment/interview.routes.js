const express = require("express");

const router = express.Router();



const interviewController = require("./interview.controller");



// Middleware

const protect = require("../../middleware/auth.middleware");

const authorize = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");



// Validation

const {

    createInterviewSchema,

    updateInterviewStatusSchema,

    submitInterviewFeedbackSchema,

    rescheduleInterviewSchema

} = require("./interview.validation");









// ======================================
// Schedule Interview
// ======================================

router.post(

    "/",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    validate(createInterviewSchema),

    interviewController.createInterview

);

router.get(
    "/",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "MANAGER"
    ),
    interviewController.getInterviews
);









// ======================================
// Get Interview Details
// ======================================

router.get(

    "/:id",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER",

        "EMPLOYEE"

    ),

    interviewController.getInterviewById

);









// ======================================
// Candidate Interview History
// ======================================

router.get(

    "/candidate/:candidateId",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    interviewController.getCandidateInterviews

);









// ======================================
// Update Interview Status
// ======================================

router.patch(

    "/:id/status",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    validate(updateInterviewStatusSchema),

    interviewController.updateInterviewStatus

);









// ======================================
// Submit Feedback
// ======================================

router.patch(

    "/:id/feedback",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    validate(submitInterviewFeedbackSchema),

    interviewController.submitFeedback

);









// ======================================
// Reschedule Interview
// ======================================

router.patch(

    "/:id/reschedule",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    validate(rescheduleInterviewSchema),

    interviewController.rescheduleInterview

);









module.exports = router;
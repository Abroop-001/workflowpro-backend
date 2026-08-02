const express = require("express");

const router = express.Router();


const recruitmentController = require("./recruitment.controller");


const protect = require("../../middleware/auth.middleware");

const authorize = require("../../middleware/role.middleware");

const validate = require("../../middleware/validate.middleware");


const {

    createRecruitmentSchema,

    updateRecruitmentSchema,

    updateStageSchema,

    addNoteSchema,

    hireCandidateSchema

} = require("./recruitment.validation");

router.post(

    "/",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    validate(createRecruitmentSchema),

    recruitmentController.createRecruitment

);

router.get(

    "/",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    recruitmentController.getRecruitments

);

router.get(

    "/:id",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    recruitmentController.getRecruitmentById

);

router.patch(

    "/:id",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    validate(updateRecruitmentSchema),

    recruitmentController.updateRecruitment

);

router.patch(

    "/:id/stage",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    validate(updateStageSchema),

    recruitmentController.updateCandidateStage

);

router.post(

    "/:id/notes",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN",

        "MANAGER"

    ),

    validate(addNoteSchema),

    recruitmentController.addCandidateNote

);

router.patch(

    "/:id/resume",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    recruitmentController.updateResume

);









// ======================================
// Hire Candidate
// Convert Candidate → Employee
// ======================================

router.post(

    "/:id/hire",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    validate(hireCandidateSchema),

    recruitmentController.hireCandidate

);









// ======================================
// Archive Candidate
// ======================================

router.delete(

    "/:id",

    protect,

    authorize(

        "HR",

        "COMPANY_ADMIN"

    ),

    recruitmentController.archiveCandidate

);









module.exports = router;
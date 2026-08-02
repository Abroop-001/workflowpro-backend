const Joi = require("joi");



// ======================================
// Common Validators
// ======================================

const objectId = Joi.string()

    .length(24)

    .hex();







// ======================================
// Create Candidate
// ======================================

const createRecruitmentSchema = Joi.object({

    firstName: Joi.string()

        .trim()

        .min(2)

        .max(50)

        .required(),




    lastName: Joi.string()

        .trim()

        .max(50)

        .allow(""),




    email: Joi.string()

        .email()

        .lowercase()

        .required(),




    phone: Joi.string()

        .trim()

        .pattern(/^[0-9+\-\s()]{8,20}$/)

        .required()

        .messages({

            "string.pattern.base":"Invalid phone number"

        }),




    jobTitle: Joi.string()

        .trim()

        .min(2)

        .max(100)

        .required(),




    department: objectId

        .required(),




    experience: Joi.number()

        .min(0)

        .max(50)

        .default(0),




    expectedSalary: Joi.number()

        .min(0)

        .default(0),




    skills: Joi.array()

        .items(

            Joi.string()

                .trim()

                .max(50)

        )

        .default([]),




    source: Joi.string()

        .valid(

            "CAREER_PORTAL",

            "LINKEDIN",

            "REFERRAL",

            "INDEED",

            "NAUKRI",

            "WALK_IN",

            "OTHER"

        )

        .default("OTHER")

});









// ======================================
// Update Candidate
// ======================================

const updateRecruitmentSchema = Joi.object({

    firstName: Joi.string()

        .trim()

        .min(2)

        .max(50),




    lastName: Joi.string()

        .trim()

        .max(50)

        .allow(""),




    email: Joi.string()

        .email()

        .lowercase(),




    phone: Joi.string()

        .trim()

        .pattern(/^[0-9+\-\s()]{8,20}$/),




    jobTitle: Joi.string()

        .trim()

        .min(2)

        .max(100),




    department: objectId,




    experience: Joi.number()

        .min(0)

        .max(50),




    expectedSalary: Joi.number()

        .min(0),




    skills: Joi.array()

        .items(

            Joi.string()

                .trim()

                .max(50)

        ),




    source: Joi.string()

        .valid(

            "CAREER_PORTAL",

            "LINKEDIN",

            "REFERRAL",

            "INDEED",

            "NAUKRI",

            "WALK_IN",

            "OTHER"

        )

}).min(1);









// ======================================
// Update Candidate Stage
// ======================================

const updateStageSchema = Joi.object({

    stage: Joi.string()

        .valid(

            "APPLIED",

            "SCREENING",

            "INTERVIEW",

            "TECHNICAL",

            "HR",

            "OFFERED",

            "HIRED",

            "REJECTED"

        )

        .required()

});









// ======================================
// Add Internal Note
// ======================================

const addNoteSchema = Joi.object({

    comment: Joi.string()

        .trim()

        .min(2)

        .max(1000)

        .required()

});









// ======================================
// Convert Candidate To Employee
// ======================================

const hireCandidateSchema = Joi.object({

    employeeId: Joi.string()

        .trim()

        .uppercase()

        .required(),




    joiningDate: Joi.date()

        .required(),




    designation: Joi.string()

        .trim()

        .required(),




    salary: Joi.number()

        .min(0)

        .required()

});









module.exports = {

    createRecruitmentSchema,

    updateRecruitmentSchema,

    updateStageSchema,

    addNoteSchema,

    hireCandidateSchema

};
const Joi = require("joi");




// =======================================
// Create Salary Structure Validation
// =======================================

const createSalaryStructureSchema = Joi.object({


    employee:Joi.string()

        .required(),



    basicSalary:Joi.number()

        .min(0)

        .required(),




    allowances:Joi.object({

        houseAllowance:Joi.number()

            .min(0)

            .default(0),


        transportAllowance:Joi.number()

            .min(0)

            .default(0),


        medicalAllowance:Joi.number()

            .min(0)

            .default(0),


        otherAllowance:Joi.number()

            .min(0)

            .default(0)


    })

    .default({}),






    deductions:Joi.object({


        tax:Joi.number()

            .min(0)

            .default(0),



        providentFund:Joi.number()

            .min(0)

            .default(0),



        insurance:Joi.number()

            .min(0)

            .default(0),



        otherDeduction:Joi.number()

            .min(0)

            .default(0)


    })

    .default({}),







    overtimeRatePerHour:Joi.number()

        .min(0)

        .default(0),






    effectiveFrom:Joi.date()

        .default(Date.now)


});









// =======================================
// Update Salary Structure Validation
// =======================================

const updateSalaryStructureSchema = Joi.object({


    basicSalary:Joi.number()

        .min(0),




    allowances:Joi.object({

        houseAllowance:Joi.number()

            .min(0),


        transportAllowance:Joi.number()

            .min(0),


        medicalAllowance:Joi.number()

            .min(0),


        otherAllowance:Joi.number()

            .min(0)

    }),





    deductions:Joi.object({


        tax:Joi.number()

            .min(0),


        providentFund:Joi.number()

            .min(0),


        insurance:Joi.number()

            .min(0),


        otherDeduction:Joi.number()

            .min(0)


    }),






    overtimeRatePerHour:Joi.number()

        .min(0),




    status:Joi.string()

        .valid(

            "ACTIVE",

            "INACTIVE"

        )


});









module.exports = {


    createSalaryStructureSchema,

    updateSalaryStructureSchema


};
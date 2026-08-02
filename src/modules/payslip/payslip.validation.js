const Joi = require("joi");


const objectId = Joi.string()
    .hex()
    .length(24);



const generatePayslipSchema = Joi.object({

    payrollId: objectId
        .required()

});




const sendPayslipSchema = Joi.object({

    payslipId: objectId
        .required(),

    email:Joi.string()
        .email()
        .required()

});



module.exports = {

    generatePayslipSchema,

    sendPayslipSchema

};
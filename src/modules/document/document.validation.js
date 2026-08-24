const Joi=require("joi");
const {DOCUMENT_CATEGORY,DOCUMENT_STATUS}=require("./document.constants");

const objectId=Joi.string().hex().length(24);

const createDocumentSchema=Joi.object({
    employee:objectId.required(),
    title:Joi.string().trim().min(2).max(100).required(),
    category:Joi.string().valid(...Object.values(DOCUMENT_CATEGORY)).required(),
    description:Joi.string().trim().max(500).allow("",null),
    expiryDate:Joi.date().allow(null)
});


const updateDocumentSchema=Joi.object({
    title:Joi.string().trim().min(2).max(100),
    description:Joi.string().trim().max(500).allow("",null),
    expiryDate:Joi.date().allow(null)
}).min(1);

const verifyDocumentSchema=Joi.object({
    status:Joi.string()
        .valid(DOCUMENT_STATUS.VERIFIED,DOCUMENT_STATUS.REJECTED)
        .required(),
    rejectionReason:Joi.string()
        .trim()
        .max(500)
        .when("status",{
            is:DOCUMENT_STATUS.REJECTED,
            then:Joi.required(),
            otherwise:Joi.allow("",null)
        })
});

const documentFilterSchema=Joi.object({
    employee:objectId,
    category:Joi.string().valid(...Object.values(DOCUMENT_CATEGORY)),
    status:Joi.string().valid(...Object.values(DOCUMENT_STATUS))
});

module.exports={
    createDocumentSchema,
    updateDocumentSchema,
    verifyDocumentSchema,
    documentFilterSchema
};
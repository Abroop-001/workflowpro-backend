const Joi = require("joi");

const addressSchema = Joi.object({
    street: Joi.string().trim().allow("", null),
    city: Joi.string().trim().allow("", null),
    state: Joi.string().trim().allow("", null),
    country: Joi.string().trim().allow("", null)
});

const createCompanySchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().lowercase().trim().required(),
    phone: Joi.string().trim().allow("", null),
    address: addressSchema,
    industry: Joi.string().trim().allow("", null)
});

const updateCompanySchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: Joi.string().email().lowercase().trim(),
    phone: Joi.string().trim().allow("", null),
    address: addressSchema,
    industry: Joi.string().trim().allow("", null)
});

module.exports = {
    createCompanySchema,
    updateCompanySchema
};

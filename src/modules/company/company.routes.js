const express=require("express");
const router=express.Router();

const companyController=require("./company.controller");
const protect=require("../../middleware/auth.middleware");
const authorize=require("../../middleware/role.middleware");
const validate=require("../../middleware/validate.middleware");

const {
    createCompanySchema,
    updateCompanySchema
}=require("./company.validation");

router.post(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    validate(createCompanySchema),
    companyController.createCompany
);

router.get(
    "/:id",
    protect,
    authorize("SUPER_ADMIN","COMPANY_ADMIN"),
    companyController.getCompany
);

router.get(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    companyController.getCompanies
);

router.patch(
    "/:id",
    protect,
    authorize("SUPER_ADMIN","COMPANY_ADMIN"),
    validate(updateCompanySchema),
    companyController.updateCompany
);

router.patch(
    "/:id/deactivate",
    protect,
    authorize("SUPER_ADMIN"),
    companyController.deactivateCompany
);

router.patch(
    "/:id/activate",
    protect,
    authorize("SUPER_ADMIN"),
    companyController.activateCompany
);

module.exports=router;
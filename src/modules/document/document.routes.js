const express=require("express");
const router=express.Router();

const documentController=require("./document.controller");
const uploadDocumentFile=require("../../middleware/upload/document.upload.middleware");

const protect=require("../../middleware/auth.middleware");
const authorize=require("../../middleware/role.middleware");
const validate=require("../../middleware/validate.middleware");

const {
    createDocumentSchema,
    updateDocumentSchema,
    verifyDocumentSchema
}=require("./document.validation");


router.post(
    "/",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    uploadDocumentFile.single("document"),
    validate(createDocumentSchema),
    documentController.uploadDocument
);


router.get(
    "/reports/expiring",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    documentController.getExpiringDocuments
);


router.get(
    "/reports/pending",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    documentController.getPendingDocuments
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
    documentController.getDocumentById
);


router.get(
    "/employee/:employeeId",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "MANAGER"
    ),
    documentController.getEmployeeDocuments
);


router.patch(
    "/:id",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    validate(updateDocumentSchema),
    documentController.updateDocument
);


router.patch(
    "/:id/verify",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    validate(verifyDocumentSchema),
    documentController.verifyDocument
);


router.get(
    "/:id/download",
    protect,
    authorize(
        "HR",
        "COMPANY_ADMIN",
        "MANAGER",
        "EMPLOYEE"
    ),
    documentController.downloadDocument
);


router.delete(
    "/:id",
    protect,
    authorize("HR","COMPANY_ADMIN"),
    documentController.deleteDocument
);


module.exports=router;
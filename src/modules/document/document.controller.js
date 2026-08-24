const AppError=require("../../utils/AppError");
const documentService=require("./document.service");
const { logAction } = require("../../utils/auditLogger");


const uploadDocument=async(req,res,next)=>{
    try{
        if(!req.file)
            throw new AppError("Document file is required",400);

        const document=await documentService.uploadDocument(
            {
                ...req.body,
                file:{
                    originalName:req.file.originalname,
                    fileName:req.file.filename,
                    filePath:req.file.path,
                    mimeType:req.file.mimetype,
                    size:req.file.size
                }
            },
            req.user.company,
            req.user._id
        );

        await logAction(req, {
            action: "CREATE",
            module: "DOCUMENT",
            description: `Uploaded document: ${document.title} (${document.category})`,
            targetId: document._id,
            newData: { title: document.title, category: document.category }
        });

        res.status(201).json({
            success:true,
            message:"Document uploaded successfully",
            data:{document}
        });

    }catch(error){
        next(error);
    }
};


const getDocumentById=async(req,res,next)=>{
    try{

        const document=await documentService.getDocumentById(
            req.params.id,
            req.user.company,
            req.user
        );

        res.status(200).json({
            success:true,
            data:{document}
        });

    }catch(error){
        next(error);
    }
};


const getEmployeeDocuments=async(req,res,next)=>{
    try{

        const result=await documentService.getEmployeeDocuments(
            req.params.employeeId,
            req.user,
            req.query
        );

        res.status(200).json({
            success:true,
            data:result
        });

    }catch(error){
        next(error);
    }
};


const updateDocument=async(req,res,next)=>{
    try{

        const document=await documentService.updateDocument(
            req.params.id,
            req.body,
            req.user.company,
            req.user._id
        );

        await logAction(req, {
            action: "UPDATE",
            module: "DOCUMENT",
            description: `Updated document details: ${document.title}`,
            targetId: document._id,
            newData: req.body
        });

        res.status(200).json({
            success:true,
            message:"Document updated successfully",
            data:{document}
        });

    }catch(error){
        next(error);
    }
};


const verifyDocument=async(req,res,next)=>{
    try{

        const document=await documentService.verifyDocument(
            req.params.id,
            req.body,
            req.user.company,
            req.user._id
        );

        await logAction(req, {
            action: req.body.status === "VERIFIED" ? "APPROVE" : "REJECT",
            module: "DOCUMENT",
            description: `Document "${document.title}" verification status set to ${req.body.status}`,
            targetId: document._id,
            newData: req.body
        });

        res.status(200).json({
            success:true,
            message:"Document verification updated",
            data:{document}
        });

    }catch(error){
        next(error);
    }
};


const deleteDocument=async(req,res,next)=>{
    try{

        const document=await documentService.deleteDocument(
            req.params.id,
            req.user.company,
            req.user._id
        );

        await logAction(req, {
            action: "DELETE",
            module: "DOCUMENT",
            description: `Deleted document: ${document.title}`,
            targetId: document._id
        });

        res.status(200).json({
            success:true,
            message:"Document deleted successfully",
            data:{document}
        });

    }catch(error){
        next(error);
    }
};


const getExpiringDocuments=async(req,res,next)=>{
    try{

        const documents=await documentService.getExpiringDocuments(
            req.user.company,
            req.query.before
        );

        res.status(200).json({
            success:true,
            results:documents.length,
            data:{documents}
        });

    }catch(error){
        next(error);
    }
};


const getPendingDocuments=async(req,res,next)=>{
    try{

        const documents=await documentService.getPendingDocuments(
            req.user.company
        );

        res.status(200).json({
            success:true,
            results:documents.length,
            data:{documents}
        });

    }catch(error){
        next(error);
    }
};


const downloadDocument=async(req,res,next)=>{
    try{

        const document=await documentService.downloadDocument(
            req.params.id,
            req.user
        );

        res.download(
            document.file.filePath,
            document.file.originalName
        );

    }catch(error){
        next(error);
    }
};


module.exports={
    uploadDocument,
    getDocumentById,
    getEmployeeDocuments,
    updateDocument,
    verifyDocument,
    deleteDocument,
    getExpiringDocuments,
    getPendingDocuments,
    downloadDocument
};
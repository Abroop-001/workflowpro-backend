const auditLogService=require("./auditLog.service");


const getAuditLogs=async(req,res,next)=>{
    try{
        const isSuperAdmin = req.user.role === "SUPER_ADMIN";
        const companyId = isSuperAdmin ? null : req.user.company;

        const result=await auditLogService.getAuditLogs(
            companyId,
            req.query,
            isSuperAdmin
        );

        res.status(200).json({
            success:true,
            data:result
        });
    }
    catch(error){
        next(error);
    }
};


const getUserActivity=async(req,res,next)=>{
    try{
        const isSuperAdmin = req.user.role === "SUPER_ADMIN";
        const companyId = isSuperAdmin ? req.query.company || null : req.user.company;

        const logs=await auditLogService.getUserActivity(
            req.params.userId,
            companyId
        );

        res.status(200).json({
            success:true,
            data:logs
        });
    }
    catch(error){
        next(error);
    }
};


const getModuleHistory=async(req,res,next)=>{
    try{
        const isSuperAdmin = req.user.role === "SUPER_ADMIN";
        const companyId = isSuperAdmin ? req.query.company || null : req.user.company;

        const logs=await auditLogService.getModuleHistory(
            req.params.module,
            companyId
        );

        res.status(200).json({
            success:true,
            data:logs
        });
    }
    catch(error){
        next(error);
    }
};


module.exports={
    getAuditLogs,
    getUserActivity,
    getModuleHistory
};
const auditLogService=require("./auditLog.service");


const getAuditLogs=async(req,res,next)=>{
    try{
        const result=await auditLogService.getAuditLogs(
            req.user.company,
            req.query
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
        const logs=await auditLogService.getUserActivity(
            req.params.userId,
            req.user.company
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
        const logs=await auditLogService.getModuleHistory(
            req.params.module,
            req.user.company
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
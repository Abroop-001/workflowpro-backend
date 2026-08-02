const AuditLog=require("./auditLog.model");
const AppError=require("../../utils/AppError");


const createAuditLog=async(data)=>{
    return AuditLog.create({
        company:data.company||null,
        user:data.user,
        action:data.action,
        module:data.module,
        description:data.description,
        oldData:data.oldData||null,
        newData:data.newData||null,
        ipAddress:data.ipAddress||null,
        userAgent:data.userAgent||null
    });
};


const getAuditLogs=async(
    companyId,
    filters={}
)=>{
    const {
        page=1,
        limit=20,
        module,
        action,
        user
    }=filters;


    const query={company:companyId};

    if(module) query.module=module;
    if(action) query.action=action;
    if(user) query.user=user;


    const skip=(Number(page)-1)*Number(limit);


    const [logs,total]=await Promise.all([
        AuditLog.find(query)
            .populate("user","name email role")
            .sort({createdAt:-1})
            .skip(skip)
            .limit(Number(limit)),

        AuditLog.countDocuments(query)
    ]);


    return {
        logs,
        pagination:{
            total,
            page:Number(page),
            limit:Number(limit),
            pages:Math.ceil(total/Number(limit))
        }
    };
};


const getUserActivity=async(
    userId,
    companyId
)=>{
    return AuditLog.find({
        user:userId,
        company:companyId
    })
    .populate("user","name email role")
    .sort({createdAt:-1});
};


const getModuleHistory=async(
    module,
    companyId
)=>{
    if(!module)
        throw new AppError(
            "Module is required",
            400
        );


    return AuditLog.find({
        module:module.toUpperCase(),
        company:companyId
    })
    .populate("user","name email role")
    .sort({createdAt:-1});
};


module.exports={
    createAuditLog,
    getAuditLogs,
    getUserActivity,
    getModuleHistory
};
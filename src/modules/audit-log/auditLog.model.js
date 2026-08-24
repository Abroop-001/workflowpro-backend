const mongoose=require("mongoose");


const auditLogSchema=new mongoose.Schema(
{
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:false,
        index:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },

    action:{
        type:String,
        enum:[
            "CREATE",
            "UPDATE",
            "DELETE",
            "LOGIN",
            "LOGOUT",
            "APPROVE",
            "REJECT",
            "CANCEL",
            "GENERATE"
        ],
        uppercase:true,
        required:true
    },

    module:{
        type:String,
        enum:[
            "EMPLOYEE",
            "ATTENDANCE",
            "LEAVE",
            "PAYROLL",
            "DOCUMENT",
            "RECRUITMENT",
            "DEPARTMENT",
            "SHIFT",
            "USER",
            "COMPANY"
        ],
        uppercase:true,
        required:true
    },

    targetId:{
        type:mongoose.Schema.Types.ObjectId
    },

    description:String,

    oldData:Object,

    newData:Object,

    ipAddress:String,

    userAgent:String

},
{
    timestamps:true
});


auditLogSchema.index({
    company:1,
    module:1,
    createdAt:-1
});


module.exports=mongoose.model(
    "AuditLog",
    auditLogSchema
);
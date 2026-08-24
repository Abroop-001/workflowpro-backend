const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true,maxlength:50},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},
    password:{type:String,required:true,minlength:8,select:false},
    role:{
        type:String,
        enum:["SUPER_ADMIN","COMPANY_ADMIN","HR","MANAGER","EMPLOYEE"],
        default:"EMPLOYEE"
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        index:true
    },
    status:{
        type:String,
        enum:["ACTIVE","INACTIVE","SUSPENDED","PENDING"],
        default:"PENDING",
        index:true
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    emailVerificationToken:{
        type:String,
        select:false
    },
    emailVerificationExpire:{
        type:Date,
        select:false,
        index:{
            expireAfterSeconds:0
        }
    },
    lastLogin:Date,
    failedLoginAttempts:{
        type:Number,
        default:0
    },
    lockUntil:Date,
    isDeleted:{
        type:Boolean,
        default:false,
        index:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    mustChangePassword:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

userSchema.index({company:1,role:1});
userSchema.index({company:1,status:1});

module.exports = mongoose.model("User",userSchema);
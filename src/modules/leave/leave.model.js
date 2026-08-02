const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
{
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true,
        index:true
    },

    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true,
        index:true
    },

    leaveType:{
        type:String,
        enum:[
            "CASUAL",
            "SICK",
            "PAID",
            "UNPAID",
            "OTHER"
        ],
        required:true
    },

    startDate:{
        type:Date,
        required:true
    },

    endDate:{
        type:Date,
        required:true,
        validate:{
            validator:function(value){
                return value >= this.startDate;
            },
            message:"End date cannot be before start date"
        }
    },

    totalDays:{
        type:Number,
        required:true,
        min:1
    },

    reason:{
        type:String,
        required:true,
        trim:true,
        maxlength:500
    },

    status:{
        type:String,
        enum:[
            "PENDING",
            "APPROVED",
            "REJECTED",
            "CANCELLED"
        ],
        default:"PENDING"
    },

    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    approvedAt:{
        type:Date
    },

    rejectionReason:{
        type:String,
        trim:true,
        maxlength:300
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    isDeleted:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
});


leaveSchema.index({
    company:1,
    employee:1,
    status:1
});

leaveSchema.index({
    company:1,
    startDate:1,
    endDate:1
});


module.exports = mongoose.model(
    "Leave",
    leaveSchema
);
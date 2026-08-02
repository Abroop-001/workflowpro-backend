const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    date:{
        type:Date,
        required:true
    },

    dateKey:{
        type:String,
        required:true
    },

    checkIn:{
        type:Date
    },

    checkOut:{
        type:Date
    },

    workingHours:{
        type:Number,
        default:0
    },

    overtimeHours:{
        type:Number,
        default:0
    },

    lateMinutes:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:[
            "PRESENT",
            "ABSENT",
            "HALF_DAY",
            "LEAVE"
        ],
        default:"PRESENT"
    },

    remarks:{
        type:String,
        trim:true,
        maxlength:200
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{
    timestamps:true
});


attendanceSchema.index(
{
    employee:1,
    dateKey:1
},
{
    unique:true
});


attendanceSchema.index({
    company:1,
    date:1
});


const Attendance = mongoose.model(
    "Attendance",
    attendanceSchema
);

module.exports = Attendance;
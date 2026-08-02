const mongoose=require("mongoose");


const shiftSchema=new mongoose.Schema({

    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true,
        index:true
    },


    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:50
    },


    startTime:{
        type:String,
        required:true,
        match:/^([01]\d|2[0-3]):([0-5]\d)$/
    },


    endTime:{
        type:String,
        required:true,
        match:/^([01]\d|2[0-3]):([0-5]\d)$/
    },


    breakDuration:{
        type:Number,
        default:60,
        min:0
    },


    workingHours:{
        type:Number,
        default:8,
        min:0,
        max:24
    },


    gracePeriod:{
        type:Number,
        default:15,
        min:0
    },


    isNightShift:{
        type:Boolean,
        default:false
    },


    status:{
        type:String,
        enum:[
            "ACTIVE",
            "INACTIVE"
        ],
        default:"ACTIVE"
    },


    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    isDeleted:{
        type:Boolean,
        default:false
    }


},
{
    timestamps:true
});



shiftSchema.index(
{
    company:1,
    name:1
},
{
    unique:true,
    partialFilterExpression:{
        isDeleted:false
    }
});


module.exports=mongoose.model(
    "Shift",
    shiftSchema
);
const mongoose = require("mongoose");


const departmentSchema = new mongoose.Schema(
{
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
        maxlength:100

    },


    description:{
        type:String,
        trim:true,
        maxlength:500

    },

    departmentCode:{
        type:String,
        required:true,
        uppercase:true,
        trim:true

    },


    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        default:null

    },

    status:{
        type:String,
        enum:[
            "ACTIVE",
            "INACTIVE"

        ],
        default:"ACTIVE"
    },

    isDeleted:{
        type:Boolean,
        default:false

    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    }

},
{
    timestamps:true
});

departmentSchema.index(
    {
        company:1,
        departmentCode:1

    },
    {
        unique:true
    }

);

departmentSchema.index(
    {
        company:1,
        name:1

    },

    {
        unique:true
    }
);
const Department =
mongoose.model(
    "Department",
    departmentSchema
);

module.exports = Department;
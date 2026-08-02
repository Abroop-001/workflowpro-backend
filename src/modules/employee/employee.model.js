const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
{

    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Company",
        required:true,
        index:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    employeeId:{
        type:String,
        required:true,
        trim:true,
        uppercase:true

    },

    personalInfo:{
        firstName:{
            type:String,
            required:true,
            trim:true,
            maxlength:50
        },
        lastName:{
            type:String,
            trim:true,
            maxlength:50
        },
        email:{
            type:String,
            lowercase:true,
            trim:true
        },
        phone:{
            type:String,
            trim:true
        },
        dateOfBirth:{
            type:Date
        },
        gender:{
            type:String,
            enum:[
                "MALE",
                "FEMALE",
                "OTHER"
            ]
        }
    },

    jobInfo:{
        designation:{
            type:String,
            trim:true
        },

        joiningDate:{
            type:Date,
        default:Date.now
        },
        employmentType:{
            type:String,
            enum:[
                "FULL_TIME",
                "PART_TIME",
                "CONTRACT",
                "INTERN"
            ],
            default:"FULL_TIME"
        },
        shift:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Shift",
            default:null
        }
    },

    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        default:null,
        index:true
    },

    salary:{
        type:Number,
        default:0,
        min:0
    },

    status:{
        type:String,
        enum:[
            "ACTIVE",
            "INACTIVE",
            "ON_LEAVE",
            "TERMINATED"
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
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{
    timestamps:true
});

employeeSchema.index(
    {
        company:1,
        employeeId:1
    },
    {
        unique:true
    }
);

employeeSchema.index(
    {
        company:1,
        department:1
    }
);

employeeSchema.index(
    {
        company:1,
        status:1
    }
);

employeeSchema.index(
    {
        company:1,
        "jobInfo.shift":1
    }
);

const Employee = mongoose.model(
    "Employee",
  employeeSchema
);
module.exports = Employee;
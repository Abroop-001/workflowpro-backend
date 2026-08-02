const mongoose = require("mongoose");

const recruitmentSchema = new mongoose.Schema(

{

    company:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Company",

        required:true,

        index:true

    },



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

        required:true,

        lowercase:true,

        trim:true

    },



    phone:{

        type:String,

        required:true,

        trim:true

    },



    jobTitle:{

        type:String,

        required:true,

        trim:true

    },



    department:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Department",

        required:true

    },



    experience:{

        type:Number,

        default:0,

        min:0

    },



    expectedSalary:{

        type:Number,

        default:0,

        min:0

    },



    resume:{

        fileName:String,

        originalName:String,

        filePath:String,

        mimeType:String,

        fileSize:Number

    },



    skills:[

        {

            type:String,

            trim:true

        }

    ],



    source:{

        type:String,

        enum:[

            "CAREER_PORTAL",

            "LINKEDIN",

            "REFERRAL",

            "INDEED",

            "NAUKRI",

            "WALK_IN",

            "OTHER"

        ],

        default:"OTHER"

    },



    stage:{

        type:String,

        enum:[

            "APPLIED",

            "SCREENING",

            "INTERVIEW",

            "TECHNICAL",

            "HR",

            "OFFERED",

            "HIRED",

            "REJECTED"

        ],

        default:"APPLIED",

        index:true

    },



    status:{

        type:String,

        enum:[

            "ACTIVE",

            "CLOSED"

        ],

        default:"ACTIVE"

    },



    notes:[

        {

            comment:{

                type:String,

                trim:true

            },

            createdBy:{

                type:mongoose.Schema.Types.ObjectId,

                ref:"User"

            },

            createdAt:{

                type:Date,

                default:Date.now

            }

        }

    ],



    hiredEmployee:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Employee",

        default:null

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

}

);



// Same email cannot have two active applications
recruitmentSchema.index(

    {

        company:1,

        email:1,

        jobTitle:1

    },

    {

        unique:true

    }

);



// Faster candidate search
recruitmentSchema.index({

    company:1,

    stage:1

});



recruitmentSchema.index({

    company:1,

    department:1

});



module.exports = mongoose.model(

    "Recruitment",

    recruitmentSchema

);
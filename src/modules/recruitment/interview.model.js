const mongoose = require("mongoose");



const interviewSchema = new mongoose.Schema(

{

    company:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Company",

        required:true,

        index:true

    },



    candidate:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Recruitment",

        required:true,

        index:true

    },



    // Interview information

    round:{

        type:String,

        enum:[

            "SCREENING",

            "TECHNICAL",

            "MANAGERIAL",

            "HR",

            "FINAL"

        ],

        required:true

    },





    interviewer:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },







    scheduledDate:{

        type:Date,

        required:true

    },



    duration:{


        type:Number,


        default:60


    },







    mode:{

        type:String,

        enum:[

            "ONLINE",

            "OFFLINE",

            "PHONE"

        ],

        default:"ONLINE"

    },







    meetingLink:{

        type:String,

        trim:true

    },







    location:{

        type:String,

        trim:true

    },







    status:{

        type:String,

        enum:[

            "SCHEDULED",

            "COMPLETED",

            "CANCELLED",

            "RESCHEDULED"

        ],

        default:"SCHEDULED",

        index:true

    },







    feedback:{


        rating:{


            type:Number,

            min:1,

            max:5


        },



        comments:{


            type:String,


            trim:true,


            maxlength:1000


        },



        recommendation:{


            type:String,

            enum:[

                "SELECT",

                "REJECT",

                "HOLD"

            ]

        },



        submittedBy:{


            type:mongoose.Schema.Types.ObjectId,

            ref:"User"


        },



        submittedAt:{


            type:Date


        }


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







// Faster interview lookup

interviewSchema.index({

    company:1,

    candidate:1,

    status:1

});






interviewSchema.index({

    interviewer:1,

    scheduledDate:1

});







module.exports = mongoose.model(

    "Interview",

    interviewSchema

);
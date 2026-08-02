const mongoose = require("mongoose");


const performanceSchema = new mongoose.Schema(

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



    // Review period

    reviewPeriod:{

        type:String,

        required:true,

        trim:true

    },





    // Employee goals

    goals:[{


        title:{

            type:String,

            required:true,

            trim:true

        },


        description:{

            type:String,

            trim:true

        },


        targetDate:{

            type:Date

        },


        status:{

            type:String,

            enum:[

                "PENDING",

                "IN_PROGRESS",

                "COMPLETED"

            ],

            default:"PENDING"

        }


    }],









    // Employee self evaluation

    selfReview:{


        comments:{

            type:String,

            trim:true

        },


        rating:{

            type:Number,

            min:1,

            max:5

        }


    },









    // Manager evaluation

    managerReview:{


        comments:{

            type:String,

            trim:true

        },


        rating:{

            type:Number,

            min:1,

            max:5

        },


        reviewedBy:{

            type:mongoose.Schema.Types.ObjectId,

            ref:"User"

        },


        reviewedAt:{

            type:Date

        }


    },









    finalRating:{

        type:Number,

        min:1,

        max:5

    },









    status:{

        type:String,

        enum:[


            "DRAFT",

            "SELF_REVIEW",

            "MANAGER_REVIEW",

            "COMPLETED"


        ],

        default:"DRAFT"

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







performanceSchema.index({

    company:1,

    employee:1,

    reviewPeriod:1

});






module.exports = mongoose.model(

    "Performance",

    performanceSchema

);
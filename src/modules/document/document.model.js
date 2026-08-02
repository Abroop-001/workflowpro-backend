const mongoose = require("mongoose");



const documentSchema = new mongoose.Schema(

{

    // Company ownership

    company:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Company",

        required:true,

        index:true

    },



    // Employee document belongs to

    employee:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Employee",

        required:true,

        index:true

    },





    // Document information

    title:{

        type:String,

        required:true,

        trim:true,

        maxlength:100

    },





    category:{

        type:String,

        enum:[

            "IDENTITY",

            "EDUCATION",

            "EXPERIENCE",

            "CONTRACT",

            "OFFER_LETTER",

            "SALARY",

            "CERTIFICATE",

            "OTHER"

        ],

        required:true,

        index:true

    },







    description:{

        type:String,

        trim:true,

        maxlength:500

    },







    // File information

    file:{


        originalName:{

            type:String,

            required:true

        },



        fileName:{

            type:String,

            required:true

        },



        filePath:{

            type:String,

            required:true

        },



        mimeType:{

            type:String,

            required:true

        },



        size:{

            type:Number,

            required:true

        }


    },







    // Document expiry

    expiryDate:{

        type:Date,

        default:null

    },







    // Verification workflow

    verificationStatus:{

        type:String,

        enum:[

            "PENDING",

            "VERIFIED",

            "REJECTED"

        ],

        default:"PENDING",

        index:true

    },







    verifiedBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        default:null

    },







    verifiedAt:{

        type:Date,

        default:null

    },







    rejectionReason:{

        type:String,

        trim:true

    },







    // Soft delete

    isDeleted:{

        type:Boolean,

        default:false,

        index:true

    },







    // Audit

    uploadedBy:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

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









// Employee document search

documentSchema.index({

    company:1,

    employee:1,

    category:1

});







// Expiry reminders

documentSchema.index({

    expiryDate:1

});







module.exports = mongoose.model(

    "Document",

    documentSchema

);